import { Car } from "../types/car";

interface CarCardProps {
  car: Car;
  summary?: string;
  onCompareToggle?: (carId: string) => void;
  isCompared?: boolean;
}

export default function CarCard({ car, summary, onCompareToggle, isCompared }: CarCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col group hover:-translate-y-1">
      <div className="h-52 bg-gray-50 relative">
        <img 
          src={car.image_url} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-4 right-4 flex justify-end">
          {onCompareToggle && (
            <button 
              onClick={() => onCompareToggle(car.id)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-md backdrop-blur-md transition-colors ${
                isCompared 
                  ? 'bg-primary text-white border border-primary/20' 
                  : 'bg-white/90 text-gray-800 hover:bg-white hover:text-primary'
              }`}
            >
              {isCompared ? '✓ Added' : '+ Compare'}
            </button>
          )}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{car.make} {car.model}</h3>
        <p className="text-gray-500 text-sm mb-3 font-medium">{car.variant} • {car.year}</p>
        <p className="text-primary font-black text-xl mb-5">₹ {car.price_lakh} Lakh</p>
        
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600 mb-5">
          <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">{car.fuel_type}</span>
          <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">{car.transmission}</span>
          <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">{car.body_type}</span>
        </div>

        {summary && (
          <div className="mt-auto pt-5 border-t border-gray-50">
            <div className="flex gap-3 items-start">
              <span className="text-primary mt-0.5 bg-primary/10 p-1 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
              </span>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">{summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
