import ProductCard from './ProductCard';

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Minimalist Desk Lamp', price: 89.00, category: 'Lighting', imageUrl: null },
  { id: 2, name: 'Ceramic Coffee Mug', price: 24.00, category: 'Drinkware', imageUrl: null },
  { id: 3, name: 'Linen Throw Blanket', price: 115.00, category: 'Home', imageUrl: null },
  { id: 4, name: 'Concrete Planter', price: 45.00, category: 'Decor', imageUrl: null },
  { id: 5, name: 'Leather Notebook', price: 32.00, category: 'Stationery', imageUrl: null },
  { id: 6, name: 'Matte Black Pen', price: 18.00, category: 'Stationery', imageUrl: null },
  { id: 7, name: 'Oak Wall Shelf', price: 150.00, category: 'Furniture', imageUrl: null },
  { id: 8, name: 'Glass Water Bottle', price: 28.00, category: 'Drinkware', imageUrl: null },
];

export default function ProductGrid() {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">New Arrivals</h2>
          <p className="text-secondary">Discover our latest minimal collections.</p>
        </div>
        <a href="/products" className="text-sm font-medium hover:underline underline-offset-4 hidden sm:block">
          View All Products
        </a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {DUMMY_PRODUCTS.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
