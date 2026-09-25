import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as adminService from '../../services/adminService';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'properties', label: 'Manage Properties' },
  { key: 'users', label: 'Manage Users' },
  { key: 'reports', label: 'Reports' },
];

const statCards = [
  { key: 'totalUsers', label: 'Total Users' },
  { key: 'totalBuyers', label: 'Buyers' },
  { key: 'totalSellers', label: 'Sellers' },
  { key: 'totalProperties', label: 'Properties' },
  { key: 'pendingProperties', label: 'Pending Approval' },
  { key: 'soldProperties', label: 'Sold Properties' },
  { key: 'totalEnquiries', label: 'Enquiries' },
  { key: 'totalOffers', label: 'Offers Made' },
  { key: 'openReports', label: 'Open Reports' },
];

const OverviewTab = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => { adminService.getStats().then(setStats); }, []);
  if (!stats) return <LoadingSpinner label="Loading dashboard stats..." />;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {statCards.map((c) => (
        <div key={c.key} className="card p-5">
          <p className="text-3xl font-bold text-primary-700">{stats[c.key] ?? 0}</p>
          <p className="text-slate-500 text-sm mt-1">{c.label}</p>
        </div>
      ))}
    </div>
  );
};

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  sold: 'bg-slate-200 text-slate-600',
  open: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-green-100 text-green-700',
  dismissed: 'bg-slate-200 text-slate-600',
};

const PropertiesTab = () => {
  const [items, setItems] = useState(null);
  const load = () => adminService.getAllProperties().then(setItems);
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    await adminService.updatePropertyStatus(id, status);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    await adminService.deletePropertyAdmin(id);
    load();
  };

  if (!items) return <LoadingSpinner label="Loading properties..." />;

  return (
    <div className="space-y-4">
      {items.map((p) => (
        <div key={p._id} className="card p-5">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h4 className="font-semibold text-slate-900">{p.title}</h4>
              <p className="text-slate-500 text-sm">{p.location?.city}, {p.location?.state} · ₹{p.price?.toLocaleString('en-IN')}</p>
              <p className="text-slate-400 text-xs mt-1">Seller: {p.seller?.name} ({p.seller?.email})</p>
            </div>
            <span className={`badge ${statusColor[p.status]}`}>{p.status}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {p.status !== 'approved' && (
              <button onClick={() => handleStatus(p._id, 'approved')} className="btn-secondary !py-1.5 !px-3 text-sm !text-green-600">Approve</button>
            )}
            {p.status !== 'rejected' && (
              <button onClick={() => handleStatus(p._id, 'rejected')} className="btn-secondary !py-1.5 !px-3 text-sm !text-red-600">Reject</button>
            )}
            <button onClick={() => handleDelete(p._id)} className="btn-secondary !py-1.5 !px-3 text-sm">Delete</button>
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-slate-500">No properties yet.</p>}
    </div>
  );
};

const UsersTab = () => {
  const [items, setItems] = useState(null);
  const load = () => adminService.getUsers().then(setItems);
  useEffect(() => { load(); }, []);

  const handleBlock = async (id) => {
    await adminService.toggleBlockUser(id);
    load();
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await adminService.deleteUser(id);
    load();
  };

  if (!items) return <LoadingSpinner label="Loading users..." />;

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u._id} className="border-t border-slate-100">
              <td className="p-4 font-medium text-slate-800">{u.name}</td>
              <td className="p-4 text-slate-500">{u.email}</td>
              <td className="p-4 capitalize">{u.role}</td>
              <td className="p-4">
                <span className={`badge ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {u.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </td>
              <td className="p-4 flex gap-2">
                <button onClick={() => handleBlock(u._id)} className="btn-secondary !py-1 !px-3 text-xs">
                  {u.isBlocked ? 'Unblock' : 'Block'}
                </button>
                <button onClick={() => handleDelete(u._id)} className="btn-secondary !py-1 !px-3 text-xs !text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p className="text-slate-500 p-6">No users found.</p>}
    </div>
  );
};

const ReportsTab = () => {
  const [items, setItems] = useState(null);
  const load = () => adminService.getReports().then(setItems);
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    await adminService.updateReportStatus(id, status);
    load();
  };

  if (!items) return <LoadingSpinner label="Loading reports..." />;

  return (
    <div className="space-y-4">
      {items.map((r) => (
        <div key={r._id} className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-800 text-sm">{r.reason}</p>
              <p className="text-slate-400 text-xs mt-1">
                Filed by {r.reportedBy?.name} {r.property ? `about "${r.property.title}"` : ''} {r.reportedUser ? `against ${r.reportedUser.name}` : ''}
              </p>
            </div>
            <span className={`badge ${statusColor[r.status]}`}>{r.status}</span>
          </div>
          {r.status === 'open' && (
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleStatus(r._id, 'reviewed')} className="btn-secondary !py-1.5 !px-3 text-sm">Mark Reviewed</button>
              <button onClick={() => handleStatus(r._id, 'dismissed')} className="btn-secondary !py-1.5 !px-3 text-sm">Dismiss</button>
            </div>
          )}
        </div>
      ))}
      {items.length === 0 && <p className="text-slate-500">No reports filed yet.</p>}
    </div>
  );
};

const AdminDashboard = () => (
  <DashboardLayout title="Admin Dashboard" tabs={tabs} basePath="/admin/dashboard">
    {(activeTab) => (
      <>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'properties' && <PropertiesTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </>
    )}
  </DashboardLayout>
);

export default AdminDashboard;
