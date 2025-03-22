import { useState, useEffect } from 'react';
import { WebsiteLimit, getWebsiteLimits, setWebsiteLimit } from '../utils/db';

export default function Options() {
  const [limits, setLimits] = useState<WebsiteLimit[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [newLimit, setNewLimit] = useState('');

  useEffect(() => {
    loadLimits();
  }, []);

  async function loadLimits() {
    const websiteLimits = await getWebsiteLimits();
    setLimits(websiteLimits);
  }

  async function handleAddLimit(e: React.FormEvent) {
    e.preventDefault();
    if (!newDomain || !newLimit) return;

    await setWebsiteLimit({
      domain: newDomain,
      dailyLimit: parseInt(newLimit) * 60 * 1000, // Convert minutes to milliseconds
      isActive: true
    });

    setNewDomain('');
    setNewLimit('');
    await loadLimits();
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Time Tracker Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Website Time Limits</h2>
        
        <form onSubmit={handleAddLimit} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Domain (e.g., example.com)"
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="Minutes per day"
              className="w-32 px-3 py-2 border rounded-md"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Limit
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {limits.map((limit) => (
            <div
              key={limit.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
            >
              <div>
                <h3 className="font-medium text-gray-700">{limit.domain}</h3>
                <p className="text-sm text-gray-500">
                  {Math.round(limit.dailyLimit / (60 * 1000))} minutes per day
                </p>
              </div>
              <button
                onClick={async () => {
                  await setWebsiteLimit({
                    ...limit,
                    isActive: !limit.isActive
                  });
                  await loadLimits();
                }}
                className={`px-3 py-1 rounded-md ${
                  limit.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {limit.isActive ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 