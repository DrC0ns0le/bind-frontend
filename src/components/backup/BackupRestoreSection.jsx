import React from 'react';
import { useBackupRestore } from './useBackupRestore';
import ExportSection from './ExportSection';
import ImportSection from './ImportSection';
import ImportPreview from './ImportPreview';
import ImportConfirmation from './ImportConfirmation';
import ImportResults from './ImportResults';
import { SpinningCog } from '../ui';

/**
 * Main Backup & Restore section component
 * Orchestrates the complete backup/restore workflow
 */
function BackupRestoreSection() {
  const {
    // Export
    exportLoading,
    handleExport,

    // Import file
    importFile,
    importType,
    handleFileSelect,

    // Import options
    importOptions,
    setImportOptions,

    // Workflow
    workflowStep,

    // Dry run
    dryRunResults,
    handleDryRun,
    handleProceedFromPreview,
    handleCancelFromPreview,

    // Confirmation
    confirmationText,
    setConfirmationText,
    handleConfirmImport,
    handleCancelFromConfirmation,
    CONFIRMATION_TEXT,

    // Results
    importResults,
    resetWorkflow,
  } = useBackupRestore();

  return (
    <div className="space-y-8">
      {/* Export Section - always visible */}
      <ExportSection
        onExport={handleExport}
        loading={exportLoading}
      />

      {/* Horizontal divider */}
      <div className="border-t border-border" />

      {/* Import Section - always visible */}
      <ImportSection
        onFileSelect={handleFileSelect}
        importFile={importFile}
        importType={importType}
        importOptions={importOptions}
        onOptionsChange={setImportOptions}
        onDryRun={handleDryRun}
        workflowStep={workflowStep}
      />

      {/* Dry Run Preview - conditional */}
      {workflowStep === 'dry_run_preview' && (
        <>
          <div className="border-t border-border" />
          <ImportPreview
            results={dryRunResults}
            onProceed={handleProceedFromPreview}
            onCancel={handleCancelFromPreview}
          />
        </>
      )}

      {/* Confirmation - conditional */}
      {workflowStep === 'confirmation' && (
        <>
          <div className="border-t border-border" />
          <ImportConfirmation
            confirmationText={confirmationText}
            onConfirmationTextChange={setConfirmationText}
            onConfirm={handleConfirmImport}
            onCancel={handleCancelFromConfirmation}
            requiredText={CONFIRMATION_TEXT}
          />
        </>
      )}

      {/* Importing state */}
      {workflowStep === 'importing' && (
        <>
          <div className="border-t border-border" />
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <SpinningCog />
            <p className="text-primary font-bold">Importing data...</p>
            <p className="text-sm text-secondary">This may take a moment. Please wait.</p>
          </div>
        </>
      )}

      {/* Results - conditional */}
      {workflowStep === 'results' && (
        <>
          <div className="border-t border-border" />
          <ImportResults
            results={importResults}
            onStartNew={resetWorkflow}
          />
        </>
      )}
    </div>
  );
}

export default BackupRestoreSection;
