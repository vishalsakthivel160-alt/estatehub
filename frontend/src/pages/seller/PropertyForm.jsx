import { useState } from 'react';
import * as propertyService from '../../services/propertyService';

const propertyTypes = ['Apartment', 'House', 'Villa', 'Plot', 'Land', 'Commercial', 'Office', 'Shop', 'Warehouse'];
const amenityOptions = ['Parking', 'Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Lift', 'Garden', 'Clubhouse', 'Furnished'];

const PropertyForm = ({ property, onDone }) => {
  const isEdit = Boolean(property);

  const [form, setForm] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || '',
    listingType: property?.listingType || 'sale',
    propertyType: property?.propertyType || 'Apartment',
    city: property?.location?.city || '',
    state: property?.location?.state || '',
    address: property?.address || '',
    area: property?.area || '',
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    amenities: property?.amenities || [],
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'amenities') fd.append('amenities', JSON.stringify(value));
        else fd.append(key, value);
      });
      images.forEach((img) => fd.append('images', img));

      if (isEdit) {
        await propertyService.updateProperty(property._id, fd);
        setMessage('Property updated successfully.');
      } else {
        await propertyService.createProperty(fd);
        setMessage('Property submitted for admin approval.');
        setForm({
          title: '', description: '', price: '', listingType: 'sale', propertyType: 'Apartment',
          city: '', state: '', address: '', area: '', bedrooms: 0, bathrooms: 0, amenities: [],
        });
        setImages([]);
      }
      if (onDone) setTimeout(onDone, 800);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5 max-w-2xl">
      <h3 className="font-semibold text-slate-900 text-lg">{isEdit ? 'Edit Property' : 'Add New Property'}</h3>
      {message && <p className="bg-primary-50 text-primary-700 text-sm rounded-lg px-4 py-3">{message}</p>}

      <input required placeholder="Property title" className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea required placeholder="Description" rows={4} className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <div className="grid grid-cols-2 gap-3">
        <select className="input-field" value={form.listingType} onChange={(e) => setForm({ ...form, listingType: e.target.value })}>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
        <select className="input-field" value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
          {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <input required type="number" placeholder="Price (₹)" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />

      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="City" className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input required placeholder="State" className="input-field" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
      </div>
      <input required placeholder="Full address" className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

      <div className="grid grid-cols-3 gap-3">
        <input required type="number" placeholder="Area (sqft)" className="input-field" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
        <input type="number" placeholder="Bedrooms" className="input-field" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
        <input type="number" placeholder="Bathrooms" className="input-field" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
      </div>

      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {amenityOptions.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => toggleAmenity(a)}
              className={`badge border ${form.amenities.includes(a) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">
          {isEdit ? 'Add more images' : 'Upload images'}
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files))}
          className="input-field"
        />
        {images.length > 0 && <p className="text-xs text-slate-500 mt-1">{images.length} file(s) selected</p>}
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Saving...' : isEdit ? 'Update Property' : 'Submit Property'}
      </button>
    </form>
  );
};

export default PropertyForm;
