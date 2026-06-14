import { MapPin, X, Navigation, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export default function LocationModal({ isOpen, onClose, onSelectAddress }) {
  const { recentLocations, isGoogleLoaded, setSelectedCoordinates } = useApp();
  
  const {
    ready,
    value: search,
    suggestions: { status, data },
    setValue: setSearch,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'ph' }
    },
    debounce: 300,
    initOnMount: isGoogleLoaded,
  });

  // Re-init when google script loads
  useEffect(() => {
    if (isGoogleLoaded && !ready) {
      // It auto-inits if initOnMount is true, but just in case
    }
  }, [isGoogleLoaded, ready]);

  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlace = async (address) => {
    setSearch(address, false);
    clearSuggestions();
    
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setSelectedCoordinates({ lat, lng });
      onSelectAddress(address);
      onClose();
    } catch (error) {
      console.error("Error: ", error);
      onSelectAddress(address); // Fallback
      onClose();
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setSelectedCoordinates({ lat: latitude, lng: longitude });

          if (window.google) {
            const geocoder = new window.google.maps.Geocoder();
            const response = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });
            if (response.results[0]) {
              onSelectAddress(response.results[0].formatted_address);
            } else {
              onSelectAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
            }
          } else {
            onSelectAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          console.error('Error fetching location:', error);
          alert("Failed to get address. Using coordinates instead.");
          onSelectAddress(`Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`);
        } finally {
          setIsLocating(false);
          onClose();
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLocating(false);
        alert("Unable to retrieve your location. Please check your permissions.");
      }
    );
  };

  const filteredLocations = recentLocations.filter(loc =>
    loc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden mx-4 animate-slide-in-right md:animate-none md:scale-100">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Select Location</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={!ready}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brandTeal focus:bg-white transition-all disabled:opacity-50"
            />
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {/* Autocomplete Suggestions */}
          {status === "OK" && (
            <div className="mb-4">
              <span className="text-xs font-semibold text-brandTeal uppercase tracking-wider">Suggestions</span>
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto no-scrollbar bg-white rounded-xl border border-gray-100 shadow-sm p-1">
                {data.map(({ place_id, description }) => (
                  <button
                    key={place_id}
                    onClick={() => handleSelectPlace(description)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-emerald-50 text-gray-700 hover:text-brandTeal text-sm font-medium transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Locations</span>
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto no-scrollbar">
              {filteredLocations.map((loc, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectPlace(loc)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-gray-50 text-gray-700 hover:text-brandTeal text-sm font-medium transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-brandTeal shrink-0" />
                  <span className="truncate">{loc}</span>
                </button>
              ))}
              {filteredLocations.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-400">
                  No locations found matching &quot;{search}&quot;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="w-full py-3 bg-brandTeal text-white font-semibold text-sm rounded-xl hover:bg-brandTeal/90 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brandTeal/10 disabled:opacity-75 disabled:active:scale-100"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Locating...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Use Current Location
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
