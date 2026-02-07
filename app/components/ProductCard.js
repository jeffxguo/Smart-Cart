import Image from 'next/image';

export default function ProductCard({ product }) {
    return (
        <div className="card h-100 shadow-sm border-0">
            <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                <Image
                    src={product.image || 'https://placehold.co/300x200'}
                    alt={product.name}
                    fill
                    className="card-img-top"
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate">{product.name}</h5>
                <p className="card-text text-muted small flex-grow-1 text-clamp-3">
                    {product.description}
                </p>
                <div className="mt-3 d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0 text-primary">${product.price.toFixed(2)}</span>
                    <button className="btn btn-outline-primary btn-sm rounded-pill">View Details</button>
                </div>
            </div>
        </div>
    );
}
