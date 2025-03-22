import { useState } from 'react';
import { useTimeTracker } from '../hooks/useTimeTracker';
import { deleteTimeEntryByDomain } from '../utils/db';

function formatTime(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function formatDomain(domain: string): string {
  return domain.replace(/^www\./, '');
}

export default function Popup() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const { stats, loading, refreshData } = useTimeTracker(period);

  const periodLabels = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month'
  };

  const handleDelete = async (domain: string) => {
    if (window.confirm(`Delete all entries for ${domain}?`)) {
      await deleteTimeEntryByDomain(domain);
      refreshData();
    }
  };

  return (
    <div style={{ width: '350px', padding: '12px', backgroundColor: 'white' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '12px'
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Time Tracker</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month')}
          style={{ 
            padding: '4px 8px', 
            border: '1px solid #d1d5db', 
            borderRadius: '4px', 
            fontSize: '14px' 
          }}
        >
          {Object.entries(periodLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '96px' }}>
          <div style={{ 
            animation: 'spin 1s linear infinite',
            width: '24px',
            height: '24px',
            border: '2px solid #3b82f6',
            borderTopColor: 'transparent',
            borderRadius: '50%'
          }}></div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ 
            backgroundColor: '#f9fafb', 
            borderRadius: '4px', 
            padding: '12px', 
            border: '1px solid #e5e7eb' 
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Total Time</h2>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginTop: '4px' }}>
              {formatTime(stats.totalTime)}
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '8px' }}>Top Sites</h2>
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '4px'
            }}>
              {stats.topSites.map((site) => (
                <div
                  key={site.domain}
                  style={{ 
                    padding: '8px', 
                    borderBottom: '1px solid #e5e7eb',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                      {formatDomain(site.domain)}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#4b5563' }}>
                        {formatTime(site.totalTime)}
                      </span>
                      <button 
                        onClick={() => handleDelete(site.domain)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ef4444',
                          fontSize: '14px',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div style={{ 
                    marginTop: '4px', 
                    height: '4px', 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: '9999px' 
                  }}>
                    <div
                      style={{ 
                        height: '100%', 
                        backgroundColor: '#3b82f6', 
                        borderRadius: '9999px',
                        width: `${Math.min(100, site.percentage)}%` 
                      }}
                    />
                  </div>
                </div>
              ))}

              {stats.topSites.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '16px 0', 
                  fontSize: '14px', 
                  color: '#6b7280' 
                }}>
                  No activity recorded yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}