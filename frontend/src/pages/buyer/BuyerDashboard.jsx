import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as wishlistService from '../../services/wishlistService';
import * as enquiryService from '../../services/enquiryService';
import * as offerService from '../../services/offerService';
import * as siteVisitService from '../../services/siteVisitService';
import * as authService from '../../services/authService';

const tabs = [
  { key: 'wishlist', label: 'Wishlist' },
  { key: 'enquiries', label: 'My Enquiries' },
  { key: 'offers', label: 'My Offers' },
  { key: 'visits', label: 'Site Visits' },
  { key: 'profile', label: 'Profile' },
];

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  open: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  countered: 'bg-blue-100 text-blue-700',
  rescheduled: 'bg-blue-100 text-blue-700',
  responded: 'bg-green-100 text-green-700',
  closed: 'bg-slate-200 text-slate-600',
};

const WishlistTab = () => {
  const [items, setItems] = useState(null);
  const load = () => wishlistService.getWishlist().then(setItems);
  useEffect(() => { load(); }, []);

  const handleRemove = async (propertyId) => {
    await wishlistService.removeFromWishlist(propertyId);
    load();
  };

  if (!items) return <LoadingSpinner label="Loading wishlist..." />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {items.map((item) => item.property && (
        <PropertyCard
          key={item._id}
          property={item.property}
          isWishlisted={true}
          onWishlistToggle={() => handleRemove(item.property._id)}
        />
      ))}
      {items.length === 0 && <p className="text-slate-500 col-span-full">Your wishlist is empty. Browse properties and tap ♡ to save them.</p>}
    </div>
  );
};

const EnquiriesTab = () => {
  const [items, setItems] = useState(null);
  useEffect(() => { enquiryService.getMyEnquiries().then(setItems); }, []);
  if (!items) return <LoadingSpinner label="Loading enquiries..." />;

  return (
    <div className="space-y-4">
      {items.map((e) => (
        <div key={e._id} className="card p-5">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-slate-900">{e.property?.title}</h4>
            <span className={`badge ${statusColor[e.status]}`}>{e.status}</span>
          </div>
          <p className="text-slate-600 text-sm mt-2">"{e.message}"</p>
          <p className="text-slate-400 text-xs mt-2">Seller: {e.seller?.name} · {e.seller?.phone}</p>
        </div>
      ))}
      {items.length === 0 && <p className="text-slate-500">No enquiries sent yet.</p>}
    </div>
  );
};

const OffersTab = () => {
  const [items, setItems] = useState(null);
  useEffect(() => { offerService.getMyOffers().then(setItems); }, []);
  if (!items) return <LoadingSpinner label="Loading offers..." />;

  return (
    <div className="space-y-4">
      {items.map((o) => (
        <div key={o._id} className="card p-5">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-slate-900">{o.property?.title}</h4>
            <span className={`badge ${statusColor[o.status]}`}>{o.status}</span>
          </div>
          <p className="text-slate-600 text-sm mt-2">Your offer: ₹{o.amount?.toLocaleString('en-IN')}</p>
          {o.status === 'countered' && (
            <p className="text-blue-700 text-sm mt-1">Seller counter-offer: ₹{o.counterAmount?.toLocaleString('en-IN')}</p>
          )}
        </div>
      ))}
      {items.length === 0 && <p className="text-slate-500">No offers made yet.</p>}
    </div>
  );
};

const VisitsTab = () => {
  const [items, setItems] = useState(null);
  useEffect(() => { siteVisitService.getMySiteVisits().then(setItems); }, []);
  if (!items) return <LoadingSpinner label="Loading site visits..." />;

  return (
    <div className="space-y-4">
      {items.map((v) => (
        <div key={v._id} className="card p-5">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-slate-900">{v.property?.title}</h4>
            <span className={`badge ${statusColor[v.status]}`}>{v.status}</span>
          </div>
          <p className="text-slate-600 text-sm mt-2">Requested: {v.date} at {v.time}</p>
          {v.note && <p className="text-slate-500 text-sm mt-1">Note from seller: {v.note}</p>}
        </div>
      ))}
      {items.length === 0 && <p className="text-slate-500">No site visits requested yet.</p>}
    </div>
  );
};

const ProfileTab = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await authService.updateProfile(form);
    updateUser(data.user);
    setMessage('Profile updated successfully.');
    setForm({ ...form, password: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-md">
      {message && <p className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">{message}</p>}
      <input className="input-field" value={user?.email} disabled />
      <input className="input-field" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input-field" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input className="input-field" type="password" placeholder="New password (optional)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit" className="btn-primary w-full">Save Changes</button>
    </form>
  );
};

const BuyerDashboard = () => (
  <DashboardLayout title="Buyer Dashboard" tabs={tabs} basePath="/buyer/dashboard">
    {(activeTab) => (
      <>
        {activeTab === 'wishlist' && <WishlistTab />}
        {activeTab === 'enquiries' && <EnquiriesTab />}
        {activeTab === 'offers' && <OffersTab />}
        {activeTab === 'visits' && <VisitsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </>
    )}
  </DashboardLayout>
);

export default BuyerDashboard;
