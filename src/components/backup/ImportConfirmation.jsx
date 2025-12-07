import React from 'react';
import { SectionLabel } from '../ui/Typography';
import { PrimaryButton, DangerButton } from '../ui/Buttons';
import { Alert } from '../ui/InlineAlert';
import { TextInput } from '../ui/FormInputs';

/**
 * Import confirmation component
 * Requires user to type confirmation text when overwrite mode is enabled
 */
function ImportConfirmation({
  confirmationText,
  onConfirmationTextChange,
  onConfirm,
  onCancel,
  requiredText
}) {
  const isTextValid = confirmationText === requiredText;

  return (
    <div className="space-y-4">
      <SectionLabel>CONFIRM IMPORT</SectionLabel>

      {/* Warning alert */}
      <Alert type="error">
        <div className="space-y-2">
          <div className="font-bold text-lg">⚠️ Warning: ALL Data Will Be Deleted</div>
          <div className="text-sm">
            You have selected <span className="font-bold">Replace All Data</span>.
            This will DELETE all existing zones, records, and configurations, then restore ONLY the data from the backup file.
          </div>
          <div className="text-sm font-bold">
            Any zones/records/configs NOT in the backup will be permanently lost!
          </div>
          <div className="text-sm font-bold text-danger">
            This action cannot be undone!
          </div>
        </div>
      </Alert>

      {/* Confirmation input */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-primary">
          Type the following to confirm:
        </label>
        <div className="p-3 bg-surface rounded border border-border font-mono text-sm text-primary">
          {requiredText}
        </div>
        <TextInput
          type="text"
          value={confirmationText}
          onChange={(e) => onConfirmationTextChange(e.target.value)}
          placeholder="Type confirmation text here"
          className="w-full"
        />
        {confirmationText && !isTextValid && (
          <div className="text-sm text-danger">
            Confirmation text does not match
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <DangerButton onClick={onCancel} className="flex-1">
          Cancel
        </DangerButton>

        <PrimaryButton
          onClick={onConfirm}
          disabled={!isTextValid}
          className="flex-1"
        >
          Confirm Import
        </PrimaryButton>
      </div>
    </div>
  );
}

export default ImportConfirmation;
