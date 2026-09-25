import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import * as propertyService from '../services/propertyService';

const propertyTypes = [
  { name: 'Apartment', icon: '🏢' },
  { name: 'Villa', icon: '🏡' },
  { name: 'House', icon: '🏠' },
  { name: 'Plot', icon: '📐' },
  { name: 'Commercial', icon: '🏬' },
  { name: 'Office', icon: '💼' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    propertyService
      .getProperties({ limit: 6 })
      .then((data) => setFeatured(data.properties))
      .catch(() => setError('Could not load featured properties.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Hero />

      <section className="container-page py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Browse by Property Type</h2>
        <p className="text-slate-500 mb-8">Explore listings tailored to what you're looking for.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {propertyTypes.map((t) => (
            <Link
              key={t.name}
              to={`/properties?propertyType=${t.name}`}
              className="card p-5 text-center hover:-translate-y-1 transition-transform"
            >
              <div className="text-3xl mb-2">{t.icon}</div>
              <p className="text-sm font-medium text-slate-700">{t.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Properties</h2>
              <p className="text-slate-500 mt-1">Hand-picked listings you shouldn't miss.</p>
            </div>
            <Link to="/properties" className="btn-secondary hidden sm:inline-flex">View All</Link>
          </div>

          {loading && <LoadingSpinner label="Loading featured properties..." />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
              {featured.length === 0 && (
                <p className="text-slate-500 col-span-full text-center py-10">
                  No properties yet — be the first seller to list one!
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="card p-10 md:p-14 bg-gradient-to-r from-primary-700 to-primary-900 text-white text-center">
          <h2 className="text-3xl font-bold mb-3">Have a Property to Sell or Rent?</h2>
          <p className="text-primary-100 max-w-lg mx-auto mb-6">
            Join thousands of sellers listing on EstateHub and reach serious buyers today.
          </p>
          <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-slate-100 font-medium px-5 py-2.5 rounded-lg transition-all duration-200">
            List Your Property
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
