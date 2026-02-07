import Image from 'next/image';

export default function ProductCard({ product }) {
    return (
        <div className="card-modern card-hover-lift h-100 overflow-hidden d-flex flex-column">
            <div className="product-img-wrapper position-relative" style={{ height: '200px', width: '100%' }}>
                <Image
                    src={product.image || 'https://placehold.co/300x200'}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="card-body d-flex flex-column p-3">
                <h5 className="card-title text-truncate fw-bold mb-1" style={{ fontSize: '1.1rem' }}>{product.name}</h5>
                <p className="card-text text-muted small flex-grow-1 text-clamp-3 mb-3" style={{ lineHeight: '1.6' }}>
                    {product.description}
                </p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0 fw-bold" style={{ color: 'var(--primary-dark)' }}>${product.price.toFixed(2)}</span>
                    <button className="btn btn-modern btn-sm px-3">View</button>
                </div>
            </div>
        </div>
    );
}
