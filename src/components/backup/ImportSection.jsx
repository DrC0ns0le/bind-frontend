import React, { useRef } from 'react';
import { SectionLabel } from '../ui/Typography';
import { PrimaryButton } from '../ui/Buttons';

/**
 * Import section component
 * Handles file upload, import type detection, and import options
 */
function ImportSection({
  onFileSelect,
  importFile,
  importType,
  importOptions,
  onOptionsChange,
  onDryRun,
  workflowStep
}) {
  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const isFileSelected = workflowStep !== 'idle';
  const isDryRunLoading = workflowStep === 'dry_run_loading';

  return (
    <div className="space-y-4">
      <SectionLabel>IMPORT</SectionLabel>

      <div className="text-secondary mb-4">
        <p>Restore from a backup file</p>
      </div>

      {/* File selection */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={onFileSelect}
          className="hidden"
        />

        <div className="flex gap-2">
          <PrimaryButton
            onClick={handleFileButtonClick}
            disabled={isDryRunLoading}
            className="flex-shrink-0"
          >
            Choose File
          </PrimaryButton>

          {importFile && (
            <div className="flex-1 flex items-center px-4 py-2 bg-surface rounded border border-border">
              <span className="text-primary text-sm truncate">
                {importFile.file.name}
              </span>
            </div>
          )}
        </div>

        {isFileSelected && (
          <div className="text-sm text-secondary">
            Detected type: <span className="font-bold text-primary uppercase">{importType}</span>
          </div>
        )}
      </div>

      {/* Import options */}
      {isFileSelected && (
        <div className="space-y-4 p-4 bg-surface rounded border border-border">
          <div className="text-sm font-bold text-primary">Import Options</div>

          {/* Conflict Action Radio Group */}
          <div className="space-y-2">
            <div className="text-sm font-bold text-primary">Conflict Handling</div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="conflict_action"
                value="error"
                checked={importOptions.conflict_action === 'error'}
                onChange={(e) => onOptionsChange({
                  ...importOptions,
                  conflict_action: e.target.value
                })}
                className="cursor-pointer mt-1"
              />
              <div>
                <span className="font-bold text-sm">Error on conflict</span>
                <span className="text-xs text-secondary block">Safest - stops if items already exist</span>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="conflict_action"
                value="skip"
                checked={importOptions.conflict_action === 'skip'}
                onChange={(e) => onOptionsChange({
                  ...importOptions,
                  conflict_action: e.target.value
                })}
                className="cursor-pointer mt-1"
              />
              <div>
                <span className="font-bold text-sm">Skip existing</span>
                <span className="text-xs text-secondary block">Keep current data, add new items only</span>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="conflict_action"
                value="merge"
                checked={importOptions.conflict_action === 'merge'}
                onChange={(e) => onOptionsChange({
                  ...importOptions,
                  conflict_action: e.target.value
                })}
                className="cursor-pointer mt-1"
              />
              <div>
                <span className="font-bold text-sm text-warning">Merge changes</span>
                <span className="text-xs text-secondary block">Update existing, add new, keep items not in backup</span>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="conflict_action"
                value="replace"
                checked={importOptions.conflict_action === 'replace'}
                onChange={(e) => onOptionsChange({
                  ...importOptions,
                  conflict_action: e.target.value
                })}
                className="cursor-pointer mt-1"
              />
              <div>
                <span className="font-bold text-sm text-danger">Replace all data</span>
                <span className="text-xs text-secondary block">⚠️ Deletes EVERYTHING, restores only from backup</span>
              </div>
            </label>
          </div>

          {/* Preserve UUIDs Checkbox */}
          <div className="pt-4 border-t border-border">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={importOptions.preserve_uuids}
                onChange={(e) => onOptionsChange({
                  ...importOptions,
                  preserve_uuids: e.target.checked
                })}
                className="cursor-pointer mt-1"
              />
              <div>
                <span className="font-bold text-sm">Preserve UUIDs</span>
                <span className="text-xs text-secondary block">Use UUIDs from backup file (for exact restore)</span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Dry run button */}
      {isFileSelected && (
        <PrimaryButton
          onClick={onDryRun}
          disabled={isDryRunLoading}
          className="w-full"
        >
          {isDryRunLoading ? 'Running preview...' : 'Dry Run Preview'}
        </PrimaryButton>
      )}
    </div>
  );
}

export default ImportSection;
