import React from 'react';
import { SectionLabel } from '../ui/Typography';
import { PrimaryButton, DangerButton } from '../ui/Buttons';
import { Alert } from '../ui/InlineAlert';
import ImportDetailsTable from './ImportDetailsTable';

/**
 * Import preview component
 * Displays dry run results with statistics and conflict warnings
 */
function ImportPreview({ results, onProceed, onCancel }) {
  if (!results) return null;

  const hasConflicts = results.zones_skipped > 0 ||
                      results.records_skipped > 0 ||
                      results.configs_skipped > 0;

  const hasErrors = results.errors && results.errors.length > 0;

  // Check if we have detailed information
  const hasDetails = results.zone_details || results.record_details || results.config_details;

  return (
    <div className="space-y-4">
      <SectionLabel>DRY RUN RESULTS</SectionLabel>

      {/* Alert */}
      <Alert type={hasConflicts ? 'warning' : 'info'}>
        <div className="space-y-2">
          <div className="font-bold">
            {hasConflicts ? 'Conflicts Detected' : 'Preview Successful'}
          </div>
          <div className="text-sm">
            {hasConflicts
              ? 'Some items will be skipped due to conflicts. Review the statistics below.'
              : 'No conflicts detected. Safe to proceed with import.'}
          </div>
        </div>
      </Alert>

      {/* Statistics grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Created */}
        {((results.zones_created || 0) > 0 || (results.records_created || 0) > 0 || (results.configs_created || 0) > 0) && (
          <>
            <div className="border border-green-500 rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Zones Created</div>
              <div className="text-2xl font-bold text-status-created">
                {results.zones_created || 0}
              </div>
            </div>
            <div className="border border-green-500 rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Records Created</div>
              <div className="text-2xl font-bold text-status-created">
                {results.records_created || 0}
              </div>
            </div>
            <div className="border border-green-500 rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Configs Created</div>
              <div className="text-2xl font-bold text-status-created">
                {results.configs_created || 0}
              </div>
            </div>
          </>
        )}

        {/* Updated */}
        {((results.zones_updated || 0) > 0 || (results.records_updated || 0) > 0 || (results.configs_updated || 0) > 0) && (
          <>
            <div className="border border-blue-500 rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Zones Updated</div>
              <div className="text-2xl font-bold text-status-updated">
                {results.zones_updated || 0}
              </div>
            </div>
            <div className="border border-blue-500 rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Records Updated</div>
              <div className="text-2xl font-bold text-status-updated">
                {results.records_updated || 0}
              </div>
            </div>
            <div className="border border-blue-500 rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Configs Updated</div>
              <div className="text-2xl font-bold text-status-updated">
                {results.configs_updated || 0}
              </div>
            </div>
          </>
        )}

        {/* Skipped */}
        {((results.zones_skipped || 0) > 0 || (results.records_skipped || 0) > 0 || (results.configs_skipped || 0) > 0) && (
          <>
            <div className="border border-yellow-500 rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Zones Skipped</div>
              <div className="text-2xl font-bold text-status-skipped">
                {results.zones_skipped || 0}
              </div>
            </div>
            <div className="border border-yellow-500 rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Records Skipped</div>
              <div className="text-2xl font-bold text-status-skipped">
                {results.records_skipped || 0}
              </div>
            </div>
            <div className="border border-yellow-500 rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Configs Skipped</div>
              <div className="text-2xl font-bold text-status-skipped">
                {results.configs_skipped || 0}
              </div>
            </div>
          </>
        )}

        {/* Deleted (for replace action) */}
        {((results.zones_deleted || 0) > 0 || (results.records_deleted || 0) > 0 || (results.configs_deleted || 0) > 0) && (
          <>
            <div className="border border-danger rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Zones Deleted</div>
              <div className="text-2xl font-bold text-danger">
                {results.zones_deleted || 0}
              </div>
            </div>
            <div className="border border-danger rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Records Deleted</div>
              <div className="text-2xl font-bold text-danger">
                {results.records_deleted || 0}
              </div>
            </div>
            <div className="border border-danger rounded p-3 surface-elevated">
              <div className="text-sm text-secondary">Configs Deleted</div>
              <div className="text-2xl font-bold text-danger">
                {results.configs_deleted || 0}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Errors */}
      {hasErrors && (
        <Alert type="error">
          <div className="space-y-2">
            <div className="font-bold">Errors During Dry Run</div>
            <ul className="text-sm space-y-1">
              {results.errors.slice(0, 5).map((err, i) => (
                <li key={i} className="font-mono">{err}</li>
              ))}
              {results.errors.length > 5 && (
                <li>... and {results.errors.length - 5} more</li>
              )}
            </ul>
          </div>
        </Alert>
      )}

      {/* Detailed changes table */}
      {hasDetails && (
        <ImportDetailsTable
          zoneDetails={results.zone_details}
          recordDetails={results.record_details}
          configDetails={results.config_details}
        />
      )}

      {/* Action buttons */}
      <div className="flex gap-4">
        <DangerButton onClick={onCancel} className="flex-1">
          Cancel
        </DangerButton>

        <PrimaryButton onClick={onProceed} className="flex-1">
          Proceed to Import
        </PrimaryButton>
      </div>
    </div>
  );
}

export default ImportPreview;
