import React, { useState } from 'react';
import { insertTestData } from '../lib/testData';

export function TestDataButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInsertTestData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await insertTestData();
      if (result.success) {
        window.location.reload(); // Reload to show new data
      } else {
        setError(result.error?.message || 'Failed to insert test data');
        console.error('Failed to insert test data:', result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleInsertTestData}
        disabled={loading}
        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg shadow-lg disabled:opacity-50"
      >
        {loading ? 'Adding Test Data...' : 'Add Test Data'}
      </button>
      {error && (
        <div className="text-rose-500 text-sm bg-rose-500/10 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
