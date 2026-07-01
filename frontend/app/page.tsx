"use client";

import { useState, useEffect } from "react";
import { Car, ChatResponse, FilterParams } from "./types/car";
import { chatWithAI } from "./lib/api";
import CarGrid from "./components/CarGrid";
import FilterSidebar from "./components/FilterSidebar";
import AIResponseBubble from "./components/AIResponseBubble";
import CompareDrawer from "./components/CompareDrawer";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [defaultCars, setDefaultCars] = useState<Car[]>([]);
  const [allCars, setAllCars] = useState<Car[]>([]);
  
  // Local state for manual filter overrides
  const [manualFilters, setManualFilters] = useState<FilterParams | null>(null);

  // Compare state
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // Fetch random suggestions and all cars on mount
  useEffect(() => {
    fetch("http://localhost:8000/api/cars")
      .then(res => res.json())
      .then((data: Car[]) => {
        setAllCars(data);
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setDefaultCars(shuffled);
        setInitialLoading(false);
      })
      .catch(err => {
        console.error("Error fetching cars", err);
        setInitialLoading(false);
      });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setManualFilters(null); // reset manual filters on new search
    setCompareList([]);
    try {
      const result = await chatWithAI(query);
      setResponse(result);
    } catch (error) {
      console.error("Failed to fetch response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  const handleCompareToggle = (carId: string) => {
    setCompareList(prev => {
      if (prev.includes(carId)) {
        return prev.filter(id => id !== carId);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 cars at a time.");
        return prev;
      }
      return [...prev, carId];
    });
  };

  const handleCompareRemove = (carId: string) => {
    setCompareList(prev => prev.filter(id => id !== carId));
    if (compareList.length <= 1) {
      setShowCompare(false);
    }
  };

  // Get effective filters (AI extracted + manual overrides)
  const effectiveFilters = manualFilters || response?.filters || {};

  // Apply manual filters locally on top of the matched_cars OR defaultCars
  let sourceCars = response ? (response.matched_cars || []) : defaultCars;
  let displayedCars = sourceCars;
  
  if (manualFilters) {
    displayedCars = displayedCars.filter(car => {
      const checkArrayFilter = (filterVal: string | string[] | undefined, carVal: string) => {
        if (!filterVal) return true;
        if (Array.isArray(filterVal)) return filterVal.length === 0 || filterVal.includes(carVal);
        return filterVal === carVal;
      };

      if (!checkArrayFilter(manualFilters.body_type, car.body_type)) return false;
      if (!checkArrayFilter(manualFilters.fuel_type, car.fuel_type)) return false;
      if (!checkArrayFilter(manualFilters.make, car.make)) return false;
      if (manualFilters.min_price_lakh && car.price_lakh < manualFilters.min_price_lakh) return false;
      if (manualFilters.max_price_lakh && car.price_lakh > manualFilters.max_price_lakh) return false;
      return true;
    });
  }

  // Always pull compare cars from the master list, so they don't disappear if filtered out
  const compareCarsData = allCars.filter(car => compareList.includes(car.id));

  return (
    <main className="min-h-screen flex flex-col items-center p-6 lg:p-12 bg-[#fafafa]">
      {/* Hero Section */}
      <div className="w-full max-w-4xl flex flex-col items-center mt-16 mb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          AI-Powered Car Discovery
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
          Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">perfect car.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
          Skip the endless scrolling. Just tell us what you need in plain English, and our AI will find the exact match.
        </p>
      </div>

      {/* Search/Chat Input */}
      <div className="w-full max-w-3xl mb-12 relative z-10">
        <form onSubmit={handleSearch} className="flex gap-3 bg-white p-3 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 transition-shadow hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          <div className="pl-6 flex items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. I need a safe family SUV under 20 lakhs"
            className="flex-1 bg-transparent px-4 py-5 text-xl focus:outline-none transition-all placeholder:text-gray-300 text-gray-900 font-medium"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-primary hover:bg-primary-dark disabled:bg-gray-200 disabled:text-gray-400 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Thinking
              </>
            ) : "Search"}
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {["Best mileage under ₹8L", "Family SUV under ₹15L", "EV for daily city commute", "Safe highway cruiser"].map((chip) => (
            <button
              key={chip}
              onClick={() => handleSuggestionClick(chip)}
              className="text-sm bg-white hover:bg-primary hover:text-white hover:border-primary border border-gray-200 px-5 py-2.5 rounded-full text-gray-600 font-medium transition-all shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-7xl mt-8 pb-32">
        {response && (
          <AIResponseBubble 
            reply={response.reply} 
          />
        )}
        
        {(!response && !manualFilters && !initialLoading && defaultCars.length > 0) && (
          <h2 className="text-2xl font-bold text-gray-800 mb-6 px-4 border-l-4 border-primary ml-2 lg:ml-0">Top Recommended Cars</h2>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <FilterSidebar 
            filters={effectiveFilters} 
            onFilterChange={setManualFilters} 
          />
          
          <div className="flex-1 w-full min-w-0">
            {initialLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-3xl h-[400px] shadow-sm border border-gray-100"></div>
                ))}
              </div>
            ) : (
              <>
                {(response || manualFilters) && (
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {displayedCars.length} Cars Found
                    </h2>
                  </div>
                )}
                <CarGrid 
                  cars={displayedCars} 
                  onCompareToggle={handleCompareToggle}
                  compareList={compareList}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Compare Button */}
      {compareList.length > 0 && !showCompare && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 animate-bounce-short">
          <button 
            onClick={() => setShowCompare(true)}
            className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:bg-gray-800 hover:scale-105 transition-all flex items-center gap-3 border border-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Compare Cars ({compareList.length})
          </button>
        </div>
      )}

      {/* Compare Drawer */}
      {showCompare && (
        <CompareDrawer 
          cars={compareCarsData} 
          onClose={() => setShowCompare(false)} 
          onRemove={handleCompareRemove}
          userQuery={query}
        />
      )}
    </main>
  );
}
