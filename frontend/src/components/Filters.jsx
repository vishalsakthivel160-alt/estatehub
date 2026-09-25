import { useState } from 'react';

const propertyTypes = ['Apartment', 'House', 'Villa', 'Plot', 'Land', 'Commercial', 'Office', 'Shop', 'Warehouse'];

const Filters = ({ initial = {}, onApply }) => {
  const [filters, setFilters] = useState({
    keyword: initial.keyword || '',
    city: initial.city || '',
    listingType: initial.listingType || '',
    propertyType: initial.propertyType || '',
    minPrice: initial.minPrice || '',
    maxPrice: initial.maxPrice || '',
    bedrooms: initial.bedrooms || '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(filters);
  };

  const handleReset = () => {
    const cleared = { keyword: '', city: '', listingType: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '' };
    setFilters(cleared);
    onApply(cleared);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-semibold text-slate-900">Search & Filter</h3>

      <input
        name="keyword"
        value={filters.keyword}
        onChange={handleChange}
        placeholder="Search by title or description"
        className="input-field"
      />
      <input
        name="city"
        value={filters.city}
        onChange={handleChange}
        placeholder="City"
        className="input-field"
      />

      <select name="listingType" value={filters.listingType} onChange={handleChange} className="input-field">
        <option value="">Buy or Rent</option>
        <option value="sale">Buy</option>
        <option value="rent">Rent</option>
      </select>

      <select name="propertyType" value={filters.propertyType} onChange={handleChange} className="input-field">
        <option value="">Property Type</option>
        {propertyTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <input
          name="minPrice"
          type="number"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Min Price"
          className="input-field"
        />
        <input
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Max Price"
          className="input-field"
        />
      </div>

      <select name="bedrooms" value={filters.bedrooms} onChange={handleChange} className="input-field">
        <option value="">Any Bedrooms</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary flex-1">Apply</button>
        <button type="button" onClick={handleReset} className="btn-secondary flex-1">Reset</button>
      </div>
    </form>
  );
};

export default Filters;
