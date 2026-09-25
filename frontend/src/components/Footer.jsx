import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-20">
    <div className="container-page py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 font-display font-bold text-xl text-white mb-3">
          <span className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-lg">🏠</span>
          EstateHub
        </div>
        <p className="text-sm text-slate-400">
          A modern real-estate marketplace connecting buyers and sellers with properties they'll love.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Explore</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/properties" className="hover:text-white">All Properties</Link></li>
          <li><Link to="/properties?listingType=sale" className="hover:text-white">Buy a Home</Link></li>
          <li><Link to="/properties?listingType=rent" className="hover:text-white">Rent a Home</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Company</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/about" className="hover:text-white">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          <li><Link to="/register" className="hover:text-white">List Your Property</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Contact</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>support@estatehub.demo</li>
          <li>+91 12345 67890</li>
          <li>Coimbatore, Tamil Nadu, India</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} EstateHub. All demo data — built for development purposes.
    </div>
  </footer>
);

export default Footer;
