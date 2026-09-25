const stats = [
  { label: 'Properties Listed', value: '2,400+' },
  { label: 'Verified Sellers', value: '300+' },
  { label: 'Happy Buyers', value: '1,200+' },
  { label: 'Cities Covered', value: '25+' },
];

const About = () => (
  <div>
    <section className="bg-slate-900 text-white py-20">
      <div className="container-page text-center">
        <h1 className="text-4xl font-bold mb-4">About EstateHub</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          EstateHub is a modern real-estate marketplace built to make buying, selling, and renting
          property simple, transparent, and fast — connecting buyers and sellers directly on one platform.
        </p>
      </div>
    </section>

    <section className="container-page py-16 grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div key={s.label} className="card p-6 text-center">
          <p className="text-3xl font-bold text-primary-700">{s.value}</p>
          <p className="text-slate-500 text-sm mt-1">{s.label}</p>
        </div>
      ))}
    </section>

    <section className="container-page pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="card p-6">
        <div className="text-3xl mb-3">🔍</div>
        <h3 className="font-semibold text-slate-900 mb-2">Smart Search</h3>
        <p className="text-slate-500 text-sm">Filter by location, price, and property type to find exactly what you need.</p>
      </div>
      <div className="card p-6">
        <div className="text-3xl mb-3">🤝</div>
        <h3 className="font-semibold text-slate-900 mb-2">Direct Connections</h3>
        <p className="text-slate-500 text-sm">Message sellers, make offers, and schedule visits — all in one place.</p>
      </div>
      <div className="card p-6">
        <div className="text-3xl mb-3">✅</div>
        <h3 className="font-semibold text-slate-900 mb-2">Verified Listings</h3>
        <p className="text-slate-500 text-sm">Every listing is reviewed by our admin team before it goes live.</p>
      </div>
    </section>
  </div>
);

export default About;
