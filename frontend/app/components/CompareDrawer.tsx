import React, { useState, useEffect } from "react";
import { Car, CompareResponse } from "../types/car";

interface CompareDrawerProps {
  cars: Car[];
  onClose: () => void;
  onRemove: (carId: string) => void;
  userQuery?: string;
}

export default function CompareDrawer({ cars, onClose, onRemove, userQuery }: CompareDrawerProps) {
  const [compareData, setCompareData] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cars.length > 0) {
      setLoading(true);
      fetch("https://car-dekho-assessment-ten.vercel.app/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ car_ids: cars.map(c => c.id), user_query: userQuery })
      })
        .then(res => res.json())
        .then(data => {
          setCompareData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching compare data", err);
          setLoading(false);
        });
    } else {
      setCompareData(null);
    }
  }, [cars]);

  if (cars.length === 0) return null;

  // Sort cars based on AI ranking if available
  const sortedCars = [...cars].sort((a, b) => {
    if (!compareData?.ranked_car_ids) return 0;
    const indexA = compareData.ranked_car_ids.indexOf(a.id);
    const indexB = compareData.ranked_car_ids.indexOf(b.id);
    // If not found in ranking, put at the end
    const rankA = indexA === -1 ? 999 : indexA;
    const rankB = indexB === -1 ? 999 : indexB;
    return rankA - rankB;
  });

  const categories = sortedCars[0]?.detailed_specs ? Object.keys(sortedCars[0].detailed_specs) : [];

  // Helper to extract the first number from a string (e.g. "1197cc Petrol Engine" -> 1197)
  const extractNumber = (val: string): number | null => {
    if (!val) return null;
    const match = val.toString().match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  };

  // Helper to get best value across all cars for a specific spec row
  const getBestSpecValue = (category: string, specKey: string) => {
    if (sortedCars.length < 2) return null;

    let isLowerBetter = false;
    const lowerKey = specKey.toLowerCase();
    if (lowerKey.includes("price") || lowerKey.includes("time") || lowerKey.includes("0-100")) {
      isLowerBetter = true;
    }

    const values = sortedCars.map(car => {
      const valStr = car.detailed_specs?.[category]?.[specKey];
      return extractNumber(valStr || "");
    }).filter(v => v !== null) as number[];

    if (values.length === 0) return null;

    return isLowerBetter ? Math.min(...values) : Math.max(...values);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl shadow-[0_-20px_60px_rgba(0,0,0,0.15)] border-t border-gray-100 p-8 transform transition-transform z-50 rounded-t-[2.5rem] max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Compare <span className="text-primary">Cars</span> ({sortedCars.length}/3)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-3 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-gray-500 font-semibold animate-pulse">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            AI is analyzing and comparing your selections...
          </div>
        ) : compareData && compareData.overall_summary && (
          <div className="mb-10 bg-orange-50/50 border-l-4 border-primary p-6 rounded-r-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              AI Overall Verdict
            </h3>
            <p className="text-gray-700 leading-relaxed font-medium">{compareData.overall_summary}</p>
          </div>
        )}

        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="p-5 border-b-2 border-gray-100 w-1/4 text-gray-400 font-bold uppercase tracking-wider text-sm align-bottom">Features & Specs</th>
                {sortedCars.map((car, index) => (
                  <th key={car.id} className="p-5 border-b-2 border-gray-100 w-1/4 relative group align-top">
                    {compareData?.ranked_car_ids && (
                      <div className={`absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-sm ${index === 0 ? 'bg-green-500' : ''}`}>
                        Rank #{index + 1}
                      </div>
                    )}
                    <button
                      onClick={() => onRemove(car.id)}
                      className="absolute top-7 right-7 bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                    <div className="rounded-2xl overflow-hidden mb-4 shadow-sm relative mt-4">
                      <img src={car.image_url} alt={car.model} className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="text-xl font-bold text-gray-900 tracking-tight">{car.make} {car.model}</div>
                    <div className="text-sm text-primary font-semibold mt-1 mb-4">{car.variant} • ₹{car.price_lakh} Lakh</div>

                    {compareData && compareData.individual_summaries?.[car.id] && (
                      <div className={`rounded-xl p-4 border ${index === 0 ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed">
                          <span className={`font-bold ${index === 0 ? 'text-green-800' : 'text-gray-800'}`}>AI Reason:</span> {compareData.individual_summaries[car.id]}
                        </p>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Render grouped detailed specs */}
              {categories.map((category) => (
                <React.Fragment key={category}>
                  <tr>
                    <td colSpan={sortedCars.length + 1} className="p-4 bg-gray-100/50 font-bold text-gray-900 text-sm uppercase tracking-wider mt-4">
                      {category}
                    </td>
                  </tr>
                  {Object.keys(sortedCars[0].detailed_specs![category]).map((specKey, index) => {
                    const bestValue = getBestSpecValue(category, specKey);

                    return (
                      <tr key={specKey} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-gray-50/30'}`}>
                        <td className="p-4 font-semibold text-gray-700 text-sm">{specKey}</td>
                        {sortedCars.map(car => {
                          const valStr = car.detailed_specs?.[category]?.[specKey] || "N/A";
                          const valNum = extractNumber(valStr);
                          const isBest = valNum !== null && bestValue !== null && valNum === bestValue && sortedCars.length > 1;

                          return (
                            <td key={car.id} className={`p-4 text-sm ${isBest ? 'text-green-600 font-bold' : 'text-gray-600 font-medium'}`}>
                              <div className="flex items-center gap-2">
                                <span>{valStr}</span>
                                {isBest && (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
