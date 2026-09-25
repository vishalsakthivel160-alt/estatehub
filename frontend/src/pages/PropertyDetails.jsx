import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import * as propertyService from '../services/propertyService';
import * as enquiryService from '../services/enquiryService';
import * as offerService from '../services/offerService';
import * as siteVisitService from '../services/siteVisitService';
import { useAuth } from '../context/AuthContext';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeForm, setActiveForm] = useState(null); // 'enquiry' | 'offer' | 'visit'
  const [formData, setFormData] = useState({ message: '', amount: '', date: '', time: '' });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    propertyService
      .getPropertyById(id)
      .then(setProperty)
      .catch(() => setError('Property not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (e) => {
    e.preventDefault();
    setFeedback('');
    try {
      if (activeForm === 'enquiry') {
        await enquiryService.createEnquiry({ propertyId: id, message: formData.message });
        setFeedback('Your enquiry has been sent to the seller!');
      } else if (activeForm === 'offer') {
        await offerService.createOffer({ propertyId: id, amount: formData.amount, message: formData.message });
        setFeedback('Your offer has been submitted!');
      } else if (activeForm === 'visit') {
        await siteVisitService.createSiteVisit({ propertyId: id, date: formData.date, time: formData.time });
        setFeedback('Site visit request sent!');
      }
      setFormData({ message: '', amount: '', date: '', time: '' });
      setActiveForm(null);
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading property..." />;
  if (error) return <div className="container-page py-16"><ErrorMessage message={error} /></div>;
  if (!property) return null;

  const isBuyer = user?.role === 'buyer';

  return (
    <div className="container-page py-10">
      <Link to="/properties" className="text-primary-600 text-sm font-medium">← Back to Properties</Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 mt-4">
        <div>
          <ImageGallery images={property.images} />

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-primary-600 text-white capitalize">{property.listingType}</span>
              <span className="badge bg-slate-100 text-slate-600">{property.propertyType}</span>
              {property.status === 'sold' && <span className="badge bg-red-600 text-white">Sold</span>}
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{property.title}</h1>
            <p className="text-slate-500 mt-1">📍 {property.address}, {property.location?.city}, {property.location?.state}</p>
            <p className="text-3xl font-bold text-primary-700 mt-4">
              {formatPrice(property.price)}{property.listingType === 'rent' ? '/mo' : ''}
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
              <div className="card p-4 text-center">
                <p className="text-xl font-bold text-slate-900">{property.bedrooms}</p>
                <p className="text-xs text-slate-500">Bedrooms</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-xl font-bold text-slate-900">{property.bathrooms}</p>
                <p className="text-xs text-slate-500">Bathrooms</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-xl font-bold text-slate-900">{property.area}</p>
                <p className="text-xs text-slate-500">Sqft Area</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-xl font-bold text-slate-900">{property.propertyType}</p>
                <p className="text-xs text-slate-500">Type</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Description</h2>
              <p className="text-slate-600 leading-relaxed">{property.description}</p>
            </div>

            {property.amenities?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span key={a} className="badge bg-primary-50 text-primary-700">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="card p-6 h-fit sticky top-24">
          <h3 className="font-semibold text-slate-900 mb-1">Seller Contact</h3>
          <p className="text-slate-700">{property.seller?.name}</p>
          <p className="text-slate-500 text-sm">{property.seller?.email}</p>
          <p className="text-slate-500 text-sm mb-5">{property.seller?.phone}</p>

          {!user && (
            <p className="text-sm text-slate-500">
              <Link to="/login" className="text-primary-600 font-medium">Login</Link> as a buyer to contact the seller, make an offer, or book a visit.
            </p>
          )}

          {isBuyer && property.status !== 'sold' && (
            <div className="space-y-2">
              <button onClick={() => setActiveForm('enquiry')} className="btn-primary w-full">Send Enquiry</button>
              <button onClick={() => setActiveForm('offer')} className="btn-secondary w-full">Make an Offer</button>
              <button onClick={() => setActiveForm('visit')} className="btn-secondary w-full">Request Site Visit</button>
              <a
                href={`https://wa.me/91${(property.seller?.phone || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full !text-green-600"
              >
                WhatsApp Seller
              </a>
            </div>
          )}

          {feedback && <p className="text-sm text-primary-700 mt-4">{feedback}</p>}

          {activeForm && (
            <form onSubmit={handleAction} className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              {activeForm === 'enquiry' && (
                <textarea
                  required
                  placeholder="Write your message to the seller..."
                  className="input-field"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              )}
              {activeForm === 'offer' && (
                <>
                  <input
                    required
                    type="number"
                    placeholder="Your offer amount (₹)"
                    className="input-field"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                  <textarea
                    placeholder="Optional message"
                    className="input-field"
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </>
              )}
              {activeForm === 'visit' && (
                <>
                  <input
                    required
                    type="date"
                    className="input-field"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                  <input
                    required
                    type="time"
                    className="input-field"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </>
              )}
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Submit</button>
                <button type="button" onClick={() => setActiveForm(null)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PropertyDetails;
