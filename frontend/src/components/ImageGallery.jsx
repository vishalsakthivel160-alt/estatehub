import { useState } from 'react';
import { BASE_SERVER_URL } from '../services/api';

const imageUrl = (img) => (img.startsWith('http') ? img : `${BASE_SERVER_URL}${img}`);

const ImageGallery = ({ images = [] }) => {
  const list = images.length ? images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="rounded-2xl overflow-hidden h-80 md:h-[26rem] bg-slate-100">
        <img src={imageUrl(list[active])} alt="Property" className="w-full h-full object-cover" />
      </div>
      {list.length > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                active === i ? 'border-primary-600' : 'border-transparent'
              }`}
            >
              <img src={imageUrl(img)} alt={`thumb-${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
