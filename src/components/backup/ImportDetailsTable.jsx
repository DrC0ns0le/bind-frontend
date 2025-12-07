import React, { useState } from 'react';

/**
 * Import details table component
 * Displays detailed list of affected items with collapsible sections
 */
function ImportDetailsTable({ zoneDetails, recordDetails, configDetails }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const actionLabels = {
    0: { label: 'Skipped', className: 'text-status-skipped' },
    1: { label: 'Created', className: 'text-status-created' },
    2: { label: 'Updated', className: 'text-status-updated' },
    3: { label: 'Deleted', className: 'text-status-deleted' },
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderDetailSection = (title, details, sectionKey) => {
    if (!details || details.length === 0) return null;

    const isExpanded = expandedSection === sectionKey;

    // Count by action
    const counts = details.reduce((acc, item) => {
      acc[item.action] = (acc[item.action] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="border border-border rounded-lg bg-surface overflow-hidden">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full p-4 flex justify-between items-center hover:bg-surface-hover transition-smooth"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-primary">{title}</span>
            <span className="text-sm text-secondary">({details.length} items)</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Action counts */}
            <div className="flex gap-3 text-xs">
              {Object.entries(counts).map(([action, count]) => {
                const { label, className } = actionLabels[action];
                return (
                  <span key={action} className={className}>
                    {count} {label}
                  </span>
                );
              })}
            </div>
            {/* Chevron */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-border">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-hover sticky top-0">
                  <tr>
                    <th className="text-left p-3 font-bold text-primary">Name</th>
                    {sectionKey === 'records' && (
                      <th className="text-left p-3 font-bold text-primary">Type</th>
                    )}
                    <th className="text-left p-3 font-bold text-primary">UUID</th>
                    <th className="text-left p-3 font-bold text-primary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item, index) => {
                    const { label, className } = actionLabels[item.action];
                    return (
                      <tr
                        key={index}
                        className="border-t border-border hover:bg-surface-hover transition-smooth"
                      >
                        <td className="p-3 font-mono text-primary">{item.name}</td>
                        {sectionKey === 'records' && (
                          <td className="p-3 text-secondary">{item.type}</td>
                        )}
                        <td className="p-3 font-mono text-xs text-secondary">{item.uuid}</td>
                        <td className="p-3">
                          <span className={`font-bold ${className}`}>{label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // If no details available, return null
  if (!zoneDetails && !recordDetails && !configDetails) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-bold text-primary">Detailed Changes</div>
      <div className="space-y-3">
        {renderDetailSection('Zones', zoneDetails, 'zones')}
        {renderDetailSection('Records', recordDetails, 'records')}
        {renderDetailSection('Configs', configDetails, 'configs')}
      </div>
    </div>
  );
}

export default ImportDetailsTable;
