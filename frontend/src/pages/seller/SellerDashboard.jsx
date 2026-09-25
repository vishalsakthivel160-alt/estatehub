import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import PropertyForm from './PropertyForm';
import * as propertyService from '../../services/propertyService';
import * as enquiryService from '../../services/enquiryService';
import * as offerService from '../../services/offerService';
import * as siteVisitService from '../../services/siteVisitService';
import { BASE_SERVER_URL } from '../../services/api';

const tabs = [
  { key: 'listings', label: 'My Listings' },
  { key: 'add', label: 'Add Property' },
  { key: 'enquiries', label: 'Enquiries' },
  { key: 'offers', label: 'Offers' },
  { key: 'visits', label: 'Site Visits' },
];

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  sold: 'bg-slate-200 text-slate-600',
  open: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  countered: 'bg-blue-100 text-blue-700',
  responded: 'bg-green-100 text-green-700',
  rescheduled: 'bg-blue-100 text-blue-700',
};

const imageUrl = (img) => (img?.startsWith('http') ? img : `${BASE_SERVER_URL}${img}`);

const ListingsTab = ({ onEdit }) => {
  const [items, setItems] = useState(null);

  const load = () => propertyService.getMyProperties().then(setItems);
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    await propertyService.deleteProperty(id);
    load();
  };

  const handleSold = async (id) => {
    await propertyService.markAsSold(id);
    load();
  };

  if (!items) return <LoadingSpinner label="Loading your listings..." />;

  return (
    <div className="space-y-4">
      {items.map((p) => (
        <div key={p._id} className="card p-4 flex flex-col sm:flex-row gap-4">
          <img src={imageUrl(p.images?.[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300'} alt="" className="w-full sm:w-32 h-28 object-cover rounded-lg" />
          <div className="flex-1">
            <div className="flex justify-between items-start gap-2">
              <h4 className="font-semibold text-slate-900">{p.title}</h4>
              <span className={`badge ${statusColor[p.status]}`}>{p.status}</span>
            </div>
            <p className="text-slate-500 text-sm">{p.location?.city}, {p.location?.state} · ₹{p.price.toLocaleString('en-IN')}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => onEdit(p)} className="btn-secondary !py-1.5 !px-3 text-sm">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="btn-secondary !py-1.5 !px-3 text-sm !text-red-600">Delete</button>
              {p.status !== 'sold' && (
                <button onClick={() => handleSold(p._id)} className="btn-secondary !py-1.5 !px-3 text-sm">Mark as Sold</button>
              )}
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-slate-500">You haven't listed any properties yet. Add your first one!</p>}
    </div>
  );
};

const EnquiriesTab = () => {
  const [items, setItems] = useState(null);
  const load = () => enquiryService.getReceivedEnquiries().then(setItems);
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    await enquiryService.updateEnquiryStatus(id, status);
    load();
  };

  if (!items) return <LoadingSpinner label="Loading enquiries..." />;

  return (
    <div className="space-y-4">
      {items.map((e) => (
        <div key={e._id} className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-slate-900">{e.property?.title}</h4>
              <p className="text-slate-400 text-xs">From: {e.buyer?.name} · {e.buyer?.phone}</p>
            </div>
            <span className={`badge ${statusColor[e.status]}`}>{e.status}</span>
          </div>
          <p className="text-slate-600 text-sm mt-2">"{e.message}"</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => handleStatus(e._id, 'responded')} className="btn-secondary !py-1.5 !px-3 text-sm">Mark Responded</button>
            <button onClick={() => handleStatus(e._id, 'closed')} className="btn-secondary !py-1.5 !px-3 text-sm">Close</button>
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-slate-500">No enquiries received yet.</p>}
    </div>
  );
};

const OffersTab = () => {
  const [items, setItems] = useState(null);
  const [counterFor, setCounterFor] = useState(null);
  const [counterAmount, setCounterAmount] = useState('');
  const load = () => offerService.getReceivedOffers().then(setItems);
  useEffect(() => { load(); }, []);

  const respond = async (id, action, amount) => {
    await offerService.respondToOffer(id, action, amount);
    setCounterFor(null);
    setCounterAmount('');
    load();
  };

  if (!items) return <LoadingSpinner label="Loading offers..." />;

  return (
    <div className="space-y-4">
      {items.map((o) => (
        <div key={o._id} className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-slate-900">{o.property?.title}</h4>
              <p className="text-slate-400 text-xs">From: {o.buyer?.name} · {o.buyer?.phone}</p>
            </div>
            <span className={`badge ${statusColor[o.status]}`}>{o.status}</span>
          </div>
          <p className="text-slate-600 text-sm mt-2">Offer amount: ₹{o.amount.toLocaleString('en-IN')}</p>
          {o.status === 'pending' && (
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => respond(o._id, 'accept')} className="btn-secondary !py-1.5 !px-3 text-sm !text-green-600">Accept</button>
              <button onClick={() => respond(o._id, 'reject')} className="btn-secondary !py-1.5 !px-3 text-sm !text-red-600">Reject</button>
              <button onClick={() => setCounterFor(o._id)} className="btn-secondary !py-1.5 !px-3 text-sm">Counter</button>
            </div>
          )}
          {counterFor === o._id && (
            <div className="flex gap-2 mt-3">
              <input
                type="number"
                placeholder="Counter amount"
                className="input-field"
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
              />
              <button onClick={() => respond(o._id, 'counter', counterAmount)} className="btn-primary whitespace-nowrap">Send</button>
            </div>
          )}
        </div>
      ))}
      {items.length === 0 && <p className="text-slate-500">No offers received yet.</p>}
    </div>
  );
};

const VisitsTab = () => {
  const [items, setItems] = useState(null);
  const load = () => siteVisitService.getReceivedSiteVisits().then(setItems);
  useEffect(() => { load(); }, []);

  const respond = async (id, status) => {
    await siteVisitService.respondToSiteVisit(id, { status });
    load();
  };

  if (!items) return <LoadingSpinner label="Loading site visits..." />;

  return (
    <div className="space-y-4">
      {items.map((v) => (
        <div key={v._id} className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-slate-900">{v.property?.title}</h4>
              <p className="text-slate-400 text-xs">Requested by: {v.buyer?.name} · {v.buyer?.phone}</p>
            </div>
            <span className={`badge ${statusColor[v.status]}`}>{v.status}</span>
          </div>
          <p className="text-slate-600 text-sm mt-2">Requested: {v.date} at {v.time}</p>
          {v.status === 'pending' && (
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => respond(v._id, 'approved')} className="btn-secondary !py-1.5 !px-3 text-sm !text-green-600">Approve</button>
              <button onClick={() => respond(v._id, 'rejected')} className="btn-secondary !py-1.5 !px-3 text-sm !text-red-600">Reject</button>
              <button onClick={() => respond(v._id, 'rescheduled')} className="btn-secondary !py-1.5 !px-3 text-sm">Ask to Reschedule</button>
            </div>
          )}
        </div>
      ))}
      {items.length === 0 && <p className="text-slate-500">No site visit requests yet.</p>}
    </div>
  );
};

const SellerDashboard = () => {
  const [editingProperty, setEditingProperty] = useState(null);
  const lastTab = useRef('listings');

  return (
    <DashboardLayout title="Seller Dashboard" tabs={tabs} basePath="/seller/dashboard">
      {(activeTab) => {
        if (activeTab !== lastTab.current) {
          lastTab.current = activeTab;
          if (editingProperty) setEditingProperty(null);
        }
        return (
        <>
          {activeTab === 'listings' && <ListingsTab onEdit={setEditingProperty} />}
          {(activeTab === 'add' || (activeTab === 'listings' && editingProperty)) && (
            <PropertyForm
              key={editingProperty?._id || 'new'}
              property={editingProperty}
              onDone={() => setEditingProperty(null)}
            />
          )}
          {activeTab === 'enquiries' && <EnquiriesTab />}
          {activeTab === 'offers' && <OffersTab />}
          {activeTab === 'visits' && <VisitsTab />}
        </>
        );
      }}
    </DashboardLayout>
  );
};

export default SellerDashboard;
