import React from 'react';
import { SectionLabel } from '../ui/Typography';
import { PrimaryButton } from '../ui/Buttons';
import { SpinningCog } from '../ui';

/**
 * Export section component
 * Provides buttons to export full backup, zones only, or configs only
 */
function ExportSection({ onExport, loading }) {
  return (
    <div className="space-y-4">
      <SectionLabel>EXPORT</SectionLabel>

      <div className="text-secondary mb-4">
        <p>Download a backup of your DNS configuration</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <PrimaryButton
          onClick={() => onExport('all')}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {loading ? <SpinningCog /> : null}
          Export Full Backup
        </PrimaryButton>

        <PrimaryButton
          onClick={() => onExport('zones')}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {loading ? <SpinningCog /> : null}
          Export Zones Only
        </PrimaryButton>

        <PrimaryButton
          onClick={() => onExport('configs')}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {loading ? <SpinningCog /> : null}
          Export Configs Only
        </PrimaryButton>
      </div>
    </div>
  );
}

export default ExportSection;
