'use client';
import { useSelector } from 'react-redux';
import { selectAllProducts } from '@/lib/features/productSlice';
import ProductCard from './components/ProductCard';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  const products = useSelector(selectAllProducts);

  return (
    <main className="container-fluid vh-100 p-3" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="row h-100 g-3">
        {/* Chat Interface Column */}
        <div className="col-lg-4 col-md-5 h-100 d-flex flex-column">
          <ChatInterface />
        </div>

        {/* Product List Column */}
        <div className="col-lg-8 col-md-7 h-100">
          <div className="h-100 overflow-auto p-2" style={{ scrollbarWidth: 'thin' }}>
            <h2 className="mb-4 text-center text-dark sticky-top bg-light py-2" style={{ zIndex: 10 }}>Featured Products</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              {products.map((product) => (
                <div key={product.id} className="col">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
