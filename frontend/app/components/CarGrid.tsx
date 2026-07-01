import { Car } from "../types/car";
import CarCard from "./CarCard";

interface CarGridProps {
  cars: Car[];
  summaries?: Record<string, string>;
  onCompareToggle?: (carId: string) => void;
  compareList?: string[];
}

export default function CarGrid({ cars, summaries, onCompareToggle, compareList = [] }: CarGridProps) {
  if (cars.length === 0) {
    return (
      <div className="w-full text-center text-gray-500 py-12">
        No cars found matching those requirements.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard 
          key={car.id} 
          car={car} 
          summary={summaries?.[car.id]} 
          onCompareToggle={onCompareToggle}
          isCompared={compareList.includes(car.id)}
        />
      ))}
    </div>
  );
}
