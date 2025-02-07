import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface AllocationManagerProps {
  salary: number;
  allocations: {
    investment: number;
    debt: number;
    needs: number;
    leisure: number;
  };
  onSave: (allocations: {
    investment: number;
    debt: number;
    needs: number;
    leisure: number;
  }) => void;
}

export function AllocationManager({ salary, allocations, onSave }: AllocationManagerProps) {
  const [percentages, setPercentages] = useState({
    investment: (allocations.investment / salary) * 100,
    debt: (allocations.debt / salary) * 100,
    needs: (allocations.needs / salary) * 100,
    leisure: (allocations.leisure / salary) * 100,
  });

  const handlePercentageChange = (category: keyof typeof percentages, value: number) => {
    const newPercentages = { ...percentages, [category]: value };
    setPercentages(newPercentages);
  };

  const handleSave = () => {
    onSave({
      investment: (percentages.investment / 100) * salary,
      debt: (percentages.debt / 100) * salary,
      needs: (percentages.needs / 100) * salary,
      leisure: (percentages.leisure / 100) * salary,
    });
  };

  const totalPercentage = Object.values(percentages).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Allocation Manager</h3>
        <button
          onClick={handleSave}
          disabled={totalPercentage !== 100}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>Save Allocations</span>
        </button>
      </div>

      <div className="space-y-4">
        <AllocationSlider
          label="Investment"
          value={percentages.investment}
          onChange={(value) => handlePercentageChange('investment', value)}
          color="bg-blue-500"
        />
        <AllocationSlider
          label="Debt"
          value={percentages.debt}
          onChange={(value) => handlePercentageChange('debt', value)}
          color="bg-red-500"
        />
        <AllocationSlider
          label="Needs"
          value={percentages.needs}
          onChange={(value) => handlePercentageChange('needs', value)}
          color="bg-purple-500"
        />
        <AllocationSlider
          label="Leisure"
          value={percentages.leisure}
          onChange={(value) => handlePercentageChange('leisure', value)}
          color="bg-amber-500"
        />
      </div>

      <div className="mt-4 text-sm">
        <span className={totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}>
          Total: {totalPercentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function AllocationSlider({ label, value, onChange, color }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-600">{value.toFixed(1)}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${color}`}
      />
    </div>
  );
}