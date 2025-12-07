import { useState } from 'react';
import { useNotification } from '../ui/Alert';
import { backupService } from '../../api/services/backupService';

const CONFIRMATION_TEXT = "I want to overwrite the data";

/**
 * Custom hook for Backup & Restore functionality
 * Manages export/import workflow with dry run preview and safety confirmations
 */
export function useBackupRestore() {
  const addNotification = useNotification();

  // Export state
  const [exportLoading, setExportLoading] = useState(false);

  // Import file state
  const [importFile, setImportFile] = useState(null); // { file, data, text }
  const [importType, setImportType] = useState(null); // 'all'|'zones'|'zone'|'configs'

  // Import options
  const [importOptions, setImportOptions] = useState({
    conflict_action: 'error', // Default to safest option
    preserve_uuids: false,
    details: true, // Enable detailed information by default for better UX
  });

  // Workflow state
  const [workflowStep, setWorkflowStep] = useState('idle');
  // Values: 'idle'|'file_selected'|'dry_run_loading'|'dry_run_preview'|'confirmation'|'importing'|'results'

  // Results
  const [dryRunResults, setDryRunResults] = useState(null);
  const [importResults, setImportResults] = useState(null);

  // Confirmation
  const [confirmationText, setConfirmationText] = useState('');

  /**
   * Detect import type from file data structure
   */
  const detectImportType = (data) => {
    if (data.exported_at && data.version) return 'all'; // ExportData
    if (Array.isArray(data) && data.length > 0) {
      if (data[0]?.records !== undefined) return 'zones';
      if (data[0]?.config_key) return 'configs';
    }
    if (data.uuid && data.records) return 'zone';
    return 'unknown';
  };

  /**
   * Handle file selection and validation
   */
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file extension
    if (!file.name.endsWith('.json')) {
      addNotification('error', 'Please select a JSON file');
      return;
    }

    // Size check
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    const WARN_SIZE = 10 * 1024 * 1024; // 10MB

    if (file.size > MAX_SIZE) {
      addNotification('error', 'File too large (max 50MB)');
      return;
    }

    if (file.size > WARN_SIZE) {
      addNotification('warning', 'Large file. Import may take a while.');
    }

    // Read and parse file
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Auto-detect type
      const type = detectImportType(data);

      if (type === 'unknown') {
        addNotification('error', 'Unknown backup file format');
        return;
      }

      setImportFile({ file, data, text });
      setImportType(type);
      setWorkflowStep('file_selected');
      addNotification('info', `Detected ${type} backup file`);
    } catch (err) {
      addNotification('error', 'Invalid JSON file');
    }
  };

  /**
   * Handle dry run preview
   */
  const handleDryRun = async () => {
    setWorkflowStep('dry_run_loading');

    try {
      const result = await backupService.import(
        importFile.data,
        importType,
        { ...importOptions, dry_run: true }
      );

      setDryRunResults(result);
      setWorkflowStep('dry_run_preview');

      // Check for different outcomes based on conflict_action
      const hasConflicts = result.zones_skipped > 0 ||
                          result.records_skipped > 0 ||
                          result.configs_skipped > 0;

      const hasUpdates = result.zones_updated > 0 ||
                        result.records_updated > 0 ||
                        result.configs_updated > 0;

      const hasDeletions = result.zones_deleted > 0 ||
                          result.records_deleted > 0 ||
                          result.configs_deleted > 0;

      if (importOptions.conflict_action === 'error' && hasConflicts) {
        addNotification('error', 'Conflicts detected. Import will fail. Choose a different conflict action.');
      } else if (importOptions.conflict_action === 'replace' && hasDeletions) {
        const totalDeleted = (result.zones_deleted || 0) + (result.records_deleted || 0) + (result.configs_deleted || 0);
        addNotification('warning', `${totalDeleted} items will be deleted`);
      } else if (hasUpdates) {
        const totalUpdated = (result.zones_updated || 0) + (result.records_updated || 0) + (result.configs_updated || 0);
        addNotification('info', `${totalUpdated} items will be updated`);
      } else {
        addNotification('info', 'Dry run completed successfully');
      }
    } catch (err) {
      addNotification('error', `Dry run failed\n${err.message}`);
      setWorkflowStep('file_selected');
    }
  };

  /**
   * Handle proceed from dry run preview
   */
  const handleProceedFromPreview = () => {
    if (importOptions.conflict_action === 'replace') {
      setWorkflowStep('confirmation');
    } else {
      performActualImport();
    }
  };

  /**
   * Handle cancel from preview
   */
  const handleCancelFromPreview = () => {
    setWorkflowStep('file_selected');
    setDryRunResults(null);
  };

  /**
   * Handle import confirmation (for overwrite mode)
   */
  const handleConfirmImport = () => {
    if (confirmationText !== CONFIRMATION_TEXT) {
      addNotification('error', 'Confirmation text does not match');
      return;
    }

    performActualImport();
  };

  /**
   * Handle cancel from confirmation
   */
  const handleCancelFromConfirmation = () => {
    setWorkflowStep('dry_run_preview');
    setConfirmationText('');
  };

  /**
   * Perform actual import
   */
  const performActualImport = async () => {
    setWorkflowStep('importing');

    try {
      const result = await backupService.import(
        importFile.data,
        importType,
        importOptions // No dry_run flag
      );

      setImportResults(result);
      setWorkflowStep('results');

      // Notification based on outcome
      if (result.errors && result.errors.length > 0) {
        addNotification('warning', `Import completed with ${result.errors.length} errors`);
      } else {
        addNotification('success', 'Import completed successfully');
      }
    } catch (err) {
      setImportResults({ error: err.message });
      setWorkflowStep('results');
      addNotification('error', `Import failed\n${err.message}`);
    }
  };

  /**
   * Reset workflow to start new import
   */
  const resetWorkflow = () => {
    setWorkflowStep('idle');
    setImportFile(null);
    setImportType(null);
    setDryRunResults(null);
    setImportResults(null);
    setConfirmationText('');
    setImportOptions({
      conflict_action: 'error',
      preserve_uuids: false,
      details: true,
    });
  };

  /**
   * Download JSON data as file
   */
  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Handle export
   */
  const handleExport = async (exportType) => {
    setExportLoading(true);

    try {
      const response = await backupService.export(exportType);

      // Extract filename from Content-Disposition header or generate
      const disposition = response.headers['content-disposition'];
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] ||
                      `bind-backup-${exportType}-${new Date().toISOString()}.json`;

      // Download file
      downloadJSON(response.data, filename);

      addNotification('success', `${exportType} backup downloaded`);
    } catch (err) {
      addNotification('error', `Export failed\n${err.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  return {
    // Export state
    exportLoading,
    handleExport,

    // Import file state
    importFile,
    importType,
    handleFileSelect,

    // Import options
    importOptions,
    setImportOptions,

    // Workflow state
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
  };
}
