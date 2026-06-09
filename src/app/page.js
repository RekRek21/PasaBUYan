'use client';

import { useState } from 'react';
import Hero from '../components/Hero';
import CategoriesTabs from '../components/CategoriesTabs';
import BrandGrid from '../components/BrandGrid';
import ProductGrid from '../components/ProductGrid';
import { useApp } from '../context/AppContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState('grocery');
  const [activeCategory, setActiveCategory] = useState(null);
  const { setSearchQuery } = useApp();

  const handleSelectCategory = (categoryName, tabId) => {
    setActiveTab(tabId);
    setActiveCategory(categoryName);
    setSearchQuery(''); // Clear general search query when selecting a specific category
    
    // Smooth scroll down to products grid
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectBrand = (brandName, tabId) => {
    setActiveTab(tabId);
    setActiveCategory(null);
    setSearchQuery(brandName);

    // Smooth scroll down to products grid
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setActiveCategory(null);
    setSearchQuery('');
  };

  return (
    <div className="bg-gray-50/30 min-h-screen pb-12">
      {/* Hero Banner Section */}
      <Hero />

      {/* Categories Tabs Section */}
      <CategoriesTabs 
        onSelectCategory={handleSelectCategory}
        onSelectBrand={handleSelectBrand}
      />


      {/* Brand Grid Section */}
      <BrandGrid 
        onSelectBrand={handleSelectBrand}
      />

      {/* Products Display Section */}
      <div id="products-section" className="scroll-mt-20">
        <ProductGrid 
          activeTab={activeTab}
          activeCategory={activeCategory}
          onClearFilter={handleClearFilters}
        />
      </div>
    </div>
  );
}
