import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Hero = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [listingType, setListingType] = useState('sale');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (listingType) params.set('listingType', listingType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80')" }}
      />
      <div className="relative container-page py-24 md:py-32 text-center">
        <span className="badge bg-white/10 text-primary-100 mb-4">Trusted by 10,000+ home seekers</span>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-tight max-w-3xl mx-auto">
          Find Your <span className="text-accent-500">Dream Property</span> With Confidence
        </h1>
        <p className="mt-5 text-slate-300 max-w-xl mx-auto">
          Browse thousands of premium listings, connect directly with sellers, and close deals faster on EstateHub.
        </p>

        <form onSubmit={handleSearch} className="mt-10 bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className="text-slate-800 rounded-lg px-3 py-2.5 border border-slate-200 md:w-32"
          >
            <option value="sale">Buy</option>
            <option value="rent">Rent</option>
          </select>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by location, title, or keyword..."
            className="flex-1 text-slate-800 rounded-lg px-3 py-2.5 border border-slate-200"
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-slate-300">
          <div><span className="text-2xl font-bold text-white">2,400+</span><br />Listings</div>
          <div><span className="text-2xl font-bold text-white">1,200+</span><br />Happy Buyers</div>
          <div><span className="text-2xl font-bold text-white">300+</span><br />Verified Sellers</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
