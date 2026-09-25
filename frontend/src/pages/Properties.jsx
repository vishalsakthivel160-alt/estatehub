import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filters from '../components/Filters';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import * as propertyService from '../services/propertyService';
import * as wishlistService from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const filtersFromParams = Object.fromEntries(searchParams.entries());

  const fetchProperties = (params, pageNum = 1) => {
    setLoading(true);
    setError('');
    propertyService
      .getProperties({ ...params, page: pageNum })
      .then((data) => {
        setProperties(data.properties);
        setPages(data.pages || 1);
        setPage(data.page || 1);
      })
      .catch(() => setError('Could not load properties. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties(filtersFromParams, 1);
    if (user?.role === 'buyer') {
      wishlistService.getWishlist().then((items) => {
        setWishlistIds(items.map((i) => i.property?._id));
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleApply = (filters) => {
    const cleaned = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    setSearchParams(cleaned);
  };

  const toggleWishlist = async (propertyId) => {
    if (!user || user.role !== 'buyer') return;
    if (wishlistIds.includes(propertyId)) {
      await wishlistService.removeFromWishlist(propertyId);
      setWishlistIds(wishlistIds.filter((id) => id !== propertyId));
    } else {
      await wishlistService.addToWishlist(propertyId);
      setWishlistIds([...wishlistIds, propertyId]);
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">All Properties</h1>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <div>
          <Filters initial={filtersFromParams} onApply={handleApply} />
        </div>

        <div>
          {loading && <LoadingSpinner label="Fetching properties..." />}
          {error && <ErrorMessage message={error} />}

          {!loading && !error && (
            <>
              <p className="text-slate-500 text-sm mb-4">{properties.length} results found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((p) => (
                  <PropertyCard
                    key={p._id}
                    property={p}
                    onWishlistToggle={user?.role === 'buyer' ? toggleWishlist : undefined}
                    isWishlisted={wishlistIds.includes(p._id)}
                  />
                ))}
              </div>

              {properties.length === 0 && (
                <p className="text-slate-500 text-center py-16">No properties match your filters.</p>
              )}

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchProperties(filtersFromParams, p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${
                        p === page ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
