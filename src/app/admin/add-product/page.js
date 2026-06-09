'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { ArrowLeft, PlusCircle, Upload, FileSpreadsheet, Trash2, Check, X, AlertTriangle, Download } from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

export default function AddProductPage() {
  const { addCatalogProduct, isAdmin, setIsAdmin } = useApp();
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Tab state: 'manual' or 'import'
  const [activeMode, setActiveMode] = useState('manual');

  // ─── Manual Form States ────────────────────────────────────
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Grocery & Markets');
  const [store, setStore] = useState('S&R - Circuit Makati');
  const [type, setType] = useState('grocery');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ─── Excel Import States ───────────────────────────────────
  const [importedRows, setImportedRows] = useState([]);
  const [fileName, setFileName] = useState('');
  const [importError, setImportError] = useState('');
  const [importStore, setImportStore] = useState('S&R - Circuit Makati');
  const [importType, setImportType] = useState('grocery');
  const [importSuccess, setImportSuccess] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const demoImages = [
    { label: 'Grocery Cookies', url: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/MkKawAwSLfHoB7gNmybaPU_catalog.png' },
    { label: 'Fresh Salmon', url: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/bxj3J4oPCikquNJFoZNZc2_catalog.png' },
    { label: 'Wine Bottle', url: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/SkDiTjCCJ2wtg2qHbwqTyy_catalog.png' },
    { label: 'Electronics', url: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/5QQGM7uQZ2KoMeULY88stP_catalog.png' }
  ];

  const DEFAULT_IMAGE = 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/MkKawAwSLfHoB7gNmybaPU_catalog.png';

  // ─── Manual Submit ─────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Please fill in name and price.');
      return;
    }
    setLoading(true);
    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      category,
      store,
      type,
      image: image || DEFAULT_IMAGE
    };
    addCatalogProduct(newProduct);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setPrice('');
      setImage('');
      setTimeout(() => router.push('/'), 1500);
    }, 800);
  };

  // ─── Excel File Handler ────────────────────────────────────
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportError('');
    setImportSuccess(false);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (jsonData.length === 0) {
          setImportError('The spreadsheet appears to be empty. Please check the file.');
          setImportedRows([]);
          return;
        }

        // Normalize column names – accept flexible header naming
        const normalized = jsonData.map((row, idx) => {
          const keys = Object.keys(row);
          // Try to intelligently map columns regardless of casing
          const findCol = (patterns) => {
            for (const p of patterns) {
              const found = keys.find(k => k.toLowerCase().trim().includes(p));
              if (found) return row[found];
            }
            return '';
          };

          const productName = findCol(['product name', 'product_name', 'name', 'item', 'product']) || '';
          const productPrice = findCol(['price', 'cost', 'amount']) || 0;
          const productCategory = findCol(['category', 'cat', 'type']) || 'Grocery & Markets';
          const productImage = findCol(['image', 'img', 'photo', 'url', 'picture']) || '';

          return {
            _rowIndex: idx + 1,
            name: String(productName).trim(),
            price: parseFloat(productPrice) || 0,
            category: String(productCategory).trim() || 'Grocery & Markets',
            image: String(productImage).trim(),
            valid: String(productName).trim().length > 0 && (parseFloat(productPrice) > 0)
          };
        });

        setImportedRows(normalized);
      } catch (err) {
        setImportError('Failed to parse the file. Make sure it is a valid .xlsx or .xls Excel file.');
        setImportedRows([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const removeImportRow = (rowIndex) => {
    setImportedRows(prev => prev.filter(r => r._rowIndex !== rowIndex));
  };

  const handleImportAll = () => {
    const validRows = importedRows.filter(r => r.valid);
    if (validRows.length === 0) {
      setImportError('No valid rows to import. Each row needs a product name and a price greater than 0.');
      return;
    }

    setImportLoading(true);

    setTimeout(() => {
      validRows.forEach((row, i) => {
        addCatalogProduct({
          id: Date.now() + i,
          name: row.name,
          price: row.price,
          category: row.category,
          store: importStore,
          type: importType,
          image: row.image || DEFAULT_IMAGE
        });
      });

      setImportLoading(false);
      setImportSuccess(true);
      setImportedRows([]);
      setFileName('');

      setTimeout(() => router.push('/'), 2000);
    }, 1000);
  };

  // ─── Download Template ─────────────────────────────────────
  const handleDownloadTemplate = () => {
    const templateData = [
      { 'Product Name': 'Sample Cookies (250g)', 'Price': 199, 'Category': 'Grocery & Markets', 'Image': 'https://example.com/cookies.jpg' },
      { 'Product Name': 'Organic Olive Oil 500ml', 'Price': 450, 'Category': 'Specialty Grocery', 'Image': '' },
      { 'Product Name': 'Premium Face Serum', 'Price': 899, 'Category': 'Beauty & Personal Care', 'Image': '' }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    // Set column widths
    ws['!cols'] = [{ wch: 30 }, { wch: 10 }, { wch: 25 }, { wch: 45 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'pasabuyan_product_template.xlsx');
  };

  // ─── Access Gate ───────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full bg-white border border-red-100 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-fade-in">
          <span className="text-5xl">🛡️</span>
          <h2 className="text-xl font-extrabold text-gray-800">Admin Access Restricted</h2>
          <p className="text-xs text-gray-400">
            You need Admin Mode enabled to manage the product catalog and add new items.
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => setIsAdmin(true)}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-500/10 active:scale-95"
            >
              Enable Admin Mode & Unlock
            </button>
            <Link
              href="/"
              className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-sm rounded-xl transition-all border border-gray-100 block text-center"
            >
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const validCount = importedRows.filter(r => r.valid).length;
  const invalidCount = importedRows.filter(r => !r.valid).length;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brandTeal mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-100/50 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-gray-50">
          <div className="w-10 h-10 rounded-xl bg-brandTeal/5 flex items-center justify-center text-brandTeal">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-gray-800 tracking-tight">Add New Product</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Inject items into the live pasaBUYan storefront catalog</p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-gray-50 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveMode('manual')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeMode === 'manual'
                ? 'bg-white text-brandTeal shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Manual Entry
          </button>
          <button
            onClick={() => setActiveMode('import')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeMode === 'import'
                ? 'bg-white text-brandTeal shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Import from Excel
          </button>
        </div>

        {/* ═══════════ MANUAL ENTRY TAB ═══════════ */}
        {activeMode === 'manual' && (
          <div className="animate-fade-in">
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in mb-4">
                <span>✨</span>
                <span>Product added successfully! Redirecting you back to the storefront...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. S&R Chocolate Chip Cookies"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-700 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Price (PHP)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 399"
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-700 font-medium"
                    required
                  />
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Catalog Section (Type)</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-700 font-medium"
                  >
                    <option value="grocery">Grocery (Stores tab)</option>
                    <option value="shops">Shops (Boutiques/Brands)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-700 font-medium"
                  >
                    {type === 'grocery' ? (
                      <>
                        <option value="Grocery & Markets">Grocery & Markets</option>
                        <option value="Specialty Grocery">Specialty Grocery</option>
                        <option value="Fresh Goods">Fresh Goods</option>
                        <option value="Alcohol">Alcohol</option>
                        <option value="Frozen & Ready to Heat">Frozen & Ready to Heat</option>
                        <option value="Meat & Deli">Meat & Deli</option>
                        <option value="Organic">Organic</option>
                      </>
                    ) : (
                      <>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                        <option value="Lifestyle & Variety">Lifestyle & Variety</option>
                        <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                        <option value="Pet Care">Pet Care</option>
                        <option value="Flowers & Plants">Flowers & Plants</option>
                        <option value="Gadgets & Electronics">Gadgets & Electronics</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Store */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Merchant / Store</label>
                  <select
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-700 font-medium"
                  >
                    {type === 'grocery' ? (
                      <>
                        <option value="S&R - Circuit Makati">S&R - Circuit Makati</option>
                        <option value="Landmark - Makati">Landmark - Makati</option>
                        <option value="Robinsons Supermarket">Robinsons Supermarket</option>
                        <option value="The Marketplace">The Marketplace</option>
                        <option value="Shopwise - Sta. Rosa">Shopwise - Sta. Rosa</option>
                      </>
                    ) : (
                      <>
                        <option value="Big Scoop">Big Scoop</option>
                        <option value="Drypers">Drypers</option>
                        <option value="Big Box PH">Big Box PH</option>
                        <option value="Catchy Beauty PH">Catchy Beauty PH</option>
                        <option value="Summer Vibes Cafe">Summer Vibes Cafe</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Image URL (or select preset below)</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/product-image.jpg"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-700 font-medium"
                />
              </div>

              {/* Quick presets for images */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Demo Image Presets</span>
                <div className="flex flex-wrap gap-2">
                  {demoImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(img.url)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                        image === img.url
                          ? 'border-brandTeal bg-brandTeal/5 text-brandTeal'
                          : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              {image && (
                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50 flex items-center gap-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/100?text=Error'; }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-black text-brandTeal uppercase">Image Preview</span>
                    <p className="text-[10px] text-gray-400 truncate">{image}</p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brandTeal text-white font-extrabold text-sm rounded-2xl hover:bg-brandTeal/90 transition-all shadow-lg shadow-brandTeal/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-55"
              >
                {loading ? 'Adding Product...' : 'Create Product Entry'}
              </button>
            </form>
          </div>
        )}

        {/* ═══════════ IMPORT FROM EXCEL TAB ═══════════ */}
        {activeMode === 'import' && (
          <div className="space-y-6 animate-fade-in">

            {/* Instructions */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-black text-blue-700 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Excel Import Guide
              </h3>
              <p className="text-[11px] text-blue-600/70 leading-relaxed">
                Upload an <strong>.xlsx</strong> or <strong>.xls</strong> file with the following columns (in order):
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {['Product Name', 'Price', 'Category', 'Image'].map((col, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-blue-700 text-[10px] font-bold border border-blue-100 shadow-sm">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-black">{i + 1}</span>
                    {col}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-blue-500/60">
                The <em>Image</em> column is optional — items without an image URL will use a default placeholder.
              </p>

              {/* Download Template */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-2 mt-1 px-4 py-2 bg-white border border-blue-200 rounded-xl text-[11px] font-bold text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Template (.xlsx)
              </button>
            </div>

            {/* Default Store & Type for imported rows */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Default Store (all rows)</label>
                <select
                  value={importStore}
                  onChange={(e) => setImportStore(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-700 font-medium"
                >
                  <option value="S&R - Circuit Makati">S&R - Circuit Makati</option>
                  <option value="Landmark - Makati">Landmark - Makati</option>
                  <option value="Robinsons Supermarket">Robinsons Supermarket</option>
                  <option value="The Marketplace">The Marketplace</option>
                  <option value="Shopwise - Sta. Rosa">Shopwise - Sta. Rosa</option>
                  <option value="Big Scoop">Big Scoop</option>
                  <option value="Big Box PH">Big Box PH</option>
                  <option value="Catchy Beauty PH">Catchy Beauty PH</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Catalog Section</label>
                <select
                  value={importType}
                  onChange={(e) => setImportType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-700 font-medium"
                >
                  <option value="grocery">Grocery</option>
                  <option value="shops">Shops</option>
                </select>
              </div>
            </div>

            {/* Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-brandTeal/40 rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-brandTeal/[0.02] group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-brandTeal/5 flex items-center justify-center transition-colors">
                  <Upload className="w-6 h-6 text-gray-300 group-hover:text-brandTeal transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600">
                    {fileName ? fileName : 'Click to upload or drag & drop'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Accepts .xlsx, .xls, and .csv files
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {importError && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {/* Success */}
            {importSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>All products imported successfully! Redirecting to storefront...</span>
              </div>
            )}

            {/* Preview Table */}
            {importedRows.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-800">Preview ({importedRows.length} rows found)</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      <span className="text-emerald-500 font-bold">{validCount} valid</span>
                      {invalidCount > 0 && (
                        <span className="text-red-400 font-bold"> · {invalidCount} invalid</span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setImportedRows([]); setFileName(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider w-8">#</th>
                          <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Product Name</th>
                          <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Image</th>
                          <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider w-10">Status</th>
                          <th className="px-4 py-3 w-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {importedRows.map((row) => (
                          <tr key={row._rowIndex} className={`transition-colors ${row.valid ? 'hover:bg-gray-50/50' : 'bg-red-50/30'}`}>
                            <td className="px-4 py-3 text-[10px] font-bold text-gray-400">{row._rowIndex}</td>
                            <td className="px-4 py-3 text-xs font-semibold text-gray-700 max-w-[180px] truncate">{row.name || <span className="text-red-400 italic">Missing</span>}</td>
                            <td className="px-4 py-3 text-xs font-bold text-gray-700">{row.price > 0 ? `₱${row.price.toLocaleString()}` : <span className="text-red-400 italic">Invalid</span>}</td>
                            <td className="px-4 py-3 text-[10px] font-medium text-gray-500 max-w-[120px] truncate">{row.category}</td>
                            <td className="px-4 py-3">
                              {row.image ? (
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-50">
                                  <img src={row.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                              ) : (
                                <span className="text-[9px] text-gray-300 italic">Default</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {row.valid ? (
                                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                  <Check className="w-3 h-3" />
                                </span>
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-red-50 text-red-400 flex items-center justify-center">
                                  <X className="w-3 h-3" />
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => removeImportRow(row._rowIndex)}
                                className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                title="Remove row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Import Button */}
                <button
                  type="button"
                  onClick={handleImportAll}
                  disabled={importLoading || validCount === 0}
                  className="w-full py-4 bg-brandTeal text-white font-extrabold text-sm rounded-2xl hover:bg-brandTeal/90 transition-all shadow-lg shadow-brandTeal/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-55"
                >
                  {importLoading ? (
                    'Importing Products...'
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import {validCount} Product{validCount !== 1 ? 's' : ''} to Catalog
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
