import { Link } from 'react-router-dom';
import { BASE_SERVER_URL } from '../services/api';

const formatPrice = (price, listingType) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
  return listingType === 'rent' ? `${formatted}/mo` : formatted;
};

const imageUrl = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80';
  return img.startsWith('http') ? img : `${BASE_SERVER_URL}${img}`;
};

const PropertyCard = ({ property, onWishlistToggle, isWishlisted }) => {
  return (
    <div className="card overflow-hidden group animate-fade-in">
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageUrl(property.images?.[0])}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge bg-primary-600 text-white capitalize">{property.listingType}</span>
          {property.status === 'sold' && <span className="badge bg-red-600 text-white">Sold</span>}
        </div>
        {onWishlistToggle && (
          <button
            onClick={() => onWishlistToggle(property._id)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform"
            aria-label="Toggle wishlist"
          >
            <span className={isWishlisted ? 'text-red-500' : 'text-slate-400'}>{isWishlisted ? '♥' : '♡'}</span>
          </button>
        )}
      </div>

      <div className="p-5">
        <p className="text-primary-700 font-bold text-lg">{formatPrice(property.price, property.listingType)}</p>
        <h3 className="font-semibold text-slate-900 mt-1 line-clamp-1">{property.title}</h3>
        <p className="text-slate-500 text-sm mt-1 line-clamp-1">
          📍 {property.location?.city}, {property.location?.state}
        </p>

        <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
          {property.bedrooms > 0 && <span>🛏 {property.bedrooms} Beds</span>}
          {property.bathrooms > 0 && <span>🛁 {property.bathrooms} Baths</span>}
          <span>📐 {property.area} sqft</span>
        </div>

        <div className="flex items-center justify-between mt-5">
          <span className="badge bg-slate-100 text-slate-600">{property.propertyType}</span>
          <Link to={`/properties/${property._id}`} className="text-primary-600 font-medium text-sm hover:underline">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
