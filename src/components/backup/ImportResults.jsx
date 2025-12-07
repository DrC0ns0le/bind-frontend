import React, { useState } from 'react';
import { SectionLabel } from '../ui/Typography';
import { PrimaryButton } from '../ui/Buttons';
import { Alert } from '../ui/InlineAlert';

/**
 * Import results component
 * Displays final import results with statistics and error details
 */
function ImportResults({ results, onStartNew }) {
  const [showErrors, setShowErrors] = useState(false);

  if (!results) return null;

  const hasErrors = results.errors && results.errors.length > 0;
  const hasError = results.error; // Single error message from catch block

  const alertType = hasError ? 'error' : (hasErrors ? 'warning' : 'success');

  return (
    <div className="space-y-4">
      <SectionLabel>IMPORT RESULTS</SectionLabel>

      {/* Alert */}
      {hasError ? (
        <Alert type="error">
          <div className="space-y-2">
            <div className="font-bold">Import Failed</div>
            <div className="text-sm">{results.error}</div>
          </div>
        </Alert>
      ) : (
        <Alert type={alertType}>
          <div className="space-y-2">
            <div className="font-bold">
              {hasErrors ? 'Import Completed With Errors' : 'Import Successful'}
            </div>
            <div className="text-sm">
              {hasErrors
                ? `Import completed but ${results.errors.length} errors occurred.`
                : 'All items imported successfully.'}
            </div>
          </div>
        </Alert>
      )}

      {/* Statistics grid (only if not a complete failure) */}
      {!hasError && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Created */}
          {((results.zones_created || 0) > 0 || (results.records_created || 0) > 0 || (results.configs_created || 0) > 0) && (
            <>
              <div className="border border-green-500 rounded p-3 bg-surface">
                <div className="text-sm text-secondary">Zones Created</div>
                <div className="text-2xl font-bold text-status-created">
                  {results.zones_created || 0}
                </div>
              </div>
              <div className="border border-green-500 rounded p-3 bg-surface">
                <div className="text-sm text-secondary">Records Created</div>
                <div className="text-2xl font-bold text-status-created">
                  {results.records_created || 0}
                </div>
              </div>
              <div className="border border-green-500 rounded p-3 bg-surface">
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
              <div className="border border-blue-500 rounded p-3 bg-surface">
                <div className="text-sm text-secondary">Zones Updated</div>
                <div className="text-2xl font-bold text-status-updated">
                  {results.zones_updated || 0}
                </div>
              </div>
              <div className="border border-blue-500 rounded p-3 bg-surface">
                <div className="text-sm text-secondary">Records Updated</div>
                <div className="text-2xl font-bold text-status-updated">
                  {results.records_updated || 0}
                </div>
              </div>
              <div className="border border-blue-500 rounded p-3 bg-surface">
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
              <div className="border border-yellow-500 rounded p-3 bg-surface">
                <div className="text-sm text-secondary">Zones Skipped</div>
                <div className="text-2xl font-bold text-status-skipped">
                  {results.zones_skipped || 0}
                </div>
              </div>
              <div className="border border-yellow-500 rounded p-3 bg-surface">
                <div className="text-sm text-secondary">Records Skipped</div>
                <div className="text-2xl font-bold text-status-skipped">
                  {results.records_skipped || 0}
                </div>
              </div>
              <div className="border border-yellow-500 rounded p-3 bg-surface">
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
              <div className="border border-danger rounded p-3 bg-surface">
                <div className="text-sm text-secondary">Zones Deleted</div>
                <div className="text-2xl font-bold text-danger">
                  {results.zones_deleted || 0}
                </div>
              </div>
              <div className="border border-danger rounded p-3 bg-surface">
                <div className="text-sm text-secondary">Records Deleted</div>
                <div className="text-2xl font-bold text-danger">
                  {results.records_deleted || 0}
                </div>
              </div>
              <div className="border border-danger rounded p-3 bg-surface">
                <div className="text-sm text-secondary">Configs Deleted</div>
                <div className="text-2xl font-bold text-danger">
                  {results.configs_deleted || 0}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error accordion */}
      {hasErrors && (
        <div className="mt-4 border border-danger rounded bg-surface">
          <button
            onClick={() => setShowErrors(!showErrors)}
            className="w-full p-4 flex justify-between items-center hover:bg-surface-hover transition-smooth"
          >
            <span className="font-bold text-danger">
              Errors ({results.errors.length})
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-5 h-5 transition-transform ${showErrors ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {showErrors && (
            <div className="p-4 border-t border-danger">
              <ul className="space-y-2">
                {results.errors.map((err, i) => (
                  <li key={i} className="text-sm text-danger font-mono">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Start new import button */}
      <PrimaryButton onClick={onStartNew} className="w-full">
        Start New Import
      </PrimaryButton>
    </div>
  );
}

export default ImportResults;
