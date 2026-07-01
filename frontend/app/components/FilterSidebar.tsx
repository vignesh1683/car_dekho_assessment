import { FilterParams } from "../types/car";

interface FilterSidebarProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
}

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    // If the same range is clicked, clear it
    if (filters.min_price_lakh === min && filters.max_price_lakh === max) {
      onFilterChange({ ...filters, min_price_lakh: undefined, max_price_lakh: undefined });
    } else {
      onFilterChange({ ...filters, min_price_lakh: min, max_price_lakh: max });
    }
  };

  const toggleArrayFilter = (current: string | string[] | undefined, value: string): string[] | undefined => {
    let arr = Array.isArray(current) ? current : current ? [current] : [];
    if (arr.includes(value)) {
      arr = arr.filter(item => item !== value);
    } else {
      arr = [...arr, value];
    }
    return arr.length > 0 ? arr : undefined;
  };

  const handleBodyTypeChange = (bodyType: string) => {
    onFilterChange({ ...filters, body_type: toggleArrayFilter(filters.body_type, bodyType) });
  };

  const handleFuelTypeChange = (fuelType: string) => {
    onFilterChange({ ...filters, fuel_type: toggleArrayFilter(filters.fuel_type, fuelType) });
  };
  
  const handleMakeChange = (make: string) => {
    onFilterChange({ ...filters, make: toggleArrayFilter(filters.make, make) });
  };

  const handleClearAll = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(val => {
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null;
  });

  const isSelected = (current: string | string[] | undefined, value: string) => {
    if (Array.isArray(current)) return current.includes(value);
    return current === value;
  };

  return (
    <div className="w-72 flex-shrink-0 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-7 self-start sticky top-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Filters
        </h2>
        {hasActiveFilters && (
          <button 
            onClick={handleClearAll}
            className="text-sm text-gray-500 hover:text-primary font-semibold transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="mb-8">
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Price Range</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handlePriceChange(undefined, 5)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all text-left ${
              !filters.min_price_lakh && filters.max_price_lakh === 5
                ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            Under ₹5 Lakh
          </button>
          <button
            onClick={() => handlePriceChange(5, 10)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all text-left ${
              filters.min_price_lakh === 5 && filters.max_price_lakh === 10
                ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            ₹5 - ₹10 Lakh
          </button>
          <button
            onClick={() => handlePriceChange(10, 20)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all text-left ${
              filters.min_price_lakh === 10 && filters.max_price_lakh === 20
                ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            ₹10 - ₹20 Lakh
          </button>
          <button
            onClick={() => handlePriceChange(20, undefined)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all text-left ${
              filters.min_price_lakh === 20 && !filters.max_price_lakh
                ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            Over ₹20 Lakh
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Car Brand</h3>
        <div className="flex flex-wrap gap-2">
          {['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Kia', 'Toyota', 'Honda', 'Volkswagen', 'Skoda', 'MG'].map(make => (
            <button
              key={make}
              onClick={() => handleMakeChange(make)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
                isSelected(filters.make, make)
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
              }`}
            >
              {make}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Body Type</h3>
        <div className="flex flex-wrap gap-2">
          {['Hatchback', 'Sedan', 'SUV', 'MUV'].map(type => (
            <button
              key={type}
              onClick={() => handleBodyTypeChange(type)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
                isSelected(filters.body_type, type)
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Fuel Type</h3>
        <div className="flex flex-wrap gap-2">
          {['Petrol', 'Diesel', 'Electric', 'CNG'].map(type => (
            <button
              key={type}
              onClick={() => handleFuelTypeChange(type)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
                isSelected(filters.fuel_type, type)
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
