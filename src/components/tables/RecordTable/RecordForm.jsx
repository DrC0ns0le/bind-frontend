/**
 * Record form component
 * Pure presentation of DNS record form fields
 * Memoized to prevent unnecessary re-renders
 */
import React, { useState, useEffect } from 'react';
import { Select, TextInput, NumberInput, TextArea, PrimaryButton, DangerButton } from '../../ui';
import { recordService } from '../../../api/services/recordService';
import { DNS_RECORD_TYPES } from '../../../config/constants';

export const RecordForm = React.memo(function RecordForm({
  record,
  selectedType,
  onTypeChange,
  onSubmit,
  onDelete,
}) {
  const [recordTypes, setRecordTypes] = useState(DNS_RECORD_TYPES);

  // Fetch supported record types from API on mount
  useEffect(() => {
    async function fetchRecordTypes() {
      const types = await recordService.getRecordTypes();
      setRecordTypes(types);
    }
    fetchRecordTypes();
  }, []);

  return (
    <form onSubmit={onSubmit} className="px-3">
      {/* First row: Type, Host, TTL */}
      <div className="flex flex-col md:flex-row p-2 gap-4">
        {/* Type select */}
        <div className="flex flex-col w-full md:w-[15%]">
          <label
            htmlFor={`${record.uuid}type`}
            className="p-1 text-sm pt-4 md:pt-1 text-secondary"
          >
            Type:
          </label>
          <Select
            value={selectedType}
            onChange={onTypeChange}
            options={recordTypes}
            displayValue={(type) => type}
            name={`${record.uuid}type`}
          />
        </div>

        {/* Host input */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor={`${record.uuid}host`}
            className="p-1 text-sm pt-4 md:pt-1 text-secondary"
          >
            Hostname:
          </label>
          <TextInput
            name={`${record.uuid}host`}
            id={`${record.uuid}host`}
            defaultValue={record.host}
            placeholder="ubuntu-prod-01.oci"
            required
          />
        </div>

        {/* TTL input */}
        <div className="flex flex-col w-full md:w-[15%]">
          <label
            htmlFor={`${record.uuid}ttl`}
            className="p-1 text-sm pt-4 md:pt-1 text-secondary"
          >
            TTL:
          </label>
          <NumberInput
            step="1"
            pattern="\d+"
            name={`${record.uuid}ttl`}
            id={`${record.uuid}ttl`}
            defaultValue={record.ttl}
            placeholder="3600"
            required
            className="w-full"
          />
        </div>
      </div>

      {/* Second row: Content */}
      <div className="flex flex-col p-2">
        <label
          htmlFor={`${record.uuid}content`}
          className="p-1 text-sm text-secondary"
        >
          Content:
        </label>
        <TextArea
          name={`${record.uuid}content`}
          id={`${record.uuid}content`}
          defaultValue={record.content}
          placeholder="89.0.142.86"
          required
          className="w-full h-[128px] md:h-auto min-h-9 resize-y"
        />
      </div>

      {/* PTR checkbox for A/AAAA records */}
      {(selectedType === 'A' || selectedType === 'AAAA') && (
        <div className="flex flex-row items-center pl-2">
          <input
            type="checkbox"
            name={`${record.uuid}add_ptr`}
            id={`${record.uuid}add_ptr`}
            defaultChecked={record.add_ptr}
            className="checkbox-base"
          />
          <label
            htmlFor={`${record.uuid}add_ptr`}
            className="p-1 text-sm text-secondary"
          >
            Add Reverse DNS (PTR)
          </label>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-row p-2 pb-3 place-content-between">
        <DangerButton type="button" onClick={onDelete}>
          Delete
        </DangerButton>
        <p className="pl-2 md:pb-1 self-end text-tertiary text-[12px] border-none grow">
          {record.uuid !== 'new' ? `UUID: ${record.uuid}` : ''}
        </p>
        <PrimaryButton type="submit" className="place-self-end">
          Submit
        </PrimaryButton>
      </div>
    </form>
  );
});
