import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container-page py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-slate-500 mb-8">
            Have questions about buying, selling, or renting? Our team is here to help.
          </p>
          <div className="space-y-4 text-slate-600">
            <p>📍 Coimbatore, Tamil Nadu, India</p>
            <p>📞 +91 12345 67890</p>
            <p>✉️ support@estatehub.demo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {sent && (
            <p className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">
              Thanks for reaching out! We'll get back to you shortly.
            </p>
          )}
          <input
            required
            placeholder="Your name"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Your email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <textarea
            required
            rows={5}
            placeholder="Your message"
            className="input-field"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button type="submit" className="btn-primary w-full">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
