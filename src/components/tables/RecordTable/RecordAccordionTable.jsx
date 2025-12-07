/**
 * Record accordion table - Refactored to use hooks and service layer
 * Displays DNS records in an accordion format with search and actions
 */
import React, { useState, useEffect } from 'react';
import { Accordion, AccordionTitle, AccordionContent, TableHeader } from '../../layout';
import { IconButton, RefreshIcon, PlusIcon, SearchIcon, TextInput, SpinningCog } from '../../ui';
import { useIsLargeScreen } from '../../../hooks/useWindowResize';
import { useRecordForm } from './useRecordForm';
import { RecordForm } from './RecordForm';
import { getRecordStatusClassName } from '../../../utils/formatters';
import { DNS_DEFAULTS } from '../../../config/constants';

// Separated controls component
function RecordTableControls({ searchQuery, setSearchQuery, onRefresh, onAddNew }) {
  return (
    <div className="flex flex-row p-2 pb-3 gap-4">
      <div className="relative min-w-[200px] flex-shrink-0">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
          <SearchIcon additionalClass="w-5 h-5" />
        </div>
        <TextInput
          name="host"
          id="host"
          value={searchQuery}
          className="w-full pl-10 pr-2 focus:pl-10"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <IconButton
        className="ml-auto btn-dark"
        onClick={onRefresh}
      >
        <RefreshIcon additionalClass="scale-75" />
      </IconButton>
      <IconButton
        className="btn-dark"
        onClick={onAddNew}
      >
        <PlusIcon additionalClass="scale-75" />
      </IconButton>
    </div>
  );
}

export function RecordAccordionTable(props) {
  const [allRecords, setAllRecords] = useState(props.rows);
  const isLargeScreen = useIsLargeScreen();

  const { setRefresh, zoneId, searchQuery, setSearchQuery, loading } = props;

  const {
    selectedType,
    updateSelectedType,
    initializeSelectedTypes,
    handleSubmit,
    handleDelete,
  } = useRecordForm(zoneId, () => {
    setRefresh(Math.floor(Date.now() / 1000));
    setAllRecords(props.rows);
  });

  // Initialize selected types when rows change
  useEffect(() => {
    if (props.rows) {
      initializeSelectedTypes(props.rows);
      setAllRecords(props.rows);
    }
  }, [props.rows]);

  const headers = {
    Type: 'w-1/12',
    Host: 'w-4/12',
    Content: 'w-5/12',
    TTL: 'w-1/12',
  };

  const addNewRecord = () => {
    const newRecord = {
      uuid: 'new',
      type: 'A',
      host: '',
      content: '',
      deleted_at: 0,
      staging: true,
      add_ptr: false,
      ttl: DNS_DEFAULTS.TTL,
    };

    setAllRecords(prev => [newRecord, ...prev]);
    updateSelectedType('new', 'A');
  };

  return (
    <div className="flex flex-col">
      {/* Search and actions - always visible */}
      <RecordTableControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRefresh={() => setRefresh(Math.floor(Date.now() / 1000))}
        onAddNew={addNewRecord}
      />

      {/* Table header - always visible */}
      {isLargeScreen ? (
        <TableHeader showChevronSpace>
          {Object.entries(headers).map(([header, className]) => (
            <div
              key={header}
              className={`${className} font-semibold font-mono tracking-tight text-md text-primary`}
            >
              {header}
            </div>
          ))}
        </TableHeader>
      ) : (
        <TableHeader>Zone Records</TableHeader>
      )}

      {/* Table content - show loading or content */}
      <div className="surface-elevated border-x border-b border-gray-200 dark:border-dark-border rounded-b-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <SpinningCog />
          </div>
        ) : (
          allRecords?.map((record) => (
            <Accordion
              className={getRecordStatusClassName(record)}
              key={record.uuid}
              id={`record-${record.uuid}`}
            >
              <AccordionTitle>
                {/* Title content - responsive layout */}
                {isLargeScreen && record.uuid !== 'new' ? (
                  // Desktop: Show all fields in row
                  Object.entries(headers).map(([header, className]) => (
                    <div
                      key={`${record.uuid}-${header}`}
                      className={`font-mono ${className}`}
                    >
                      {record[header.toLowerCase()]}
                    </div>
                  ))
                ) : record.uuid !== 'new' ? (
                  // Mobile: Show fields in column with labels
                  Object.entries(headers).map(([header, _]) => (
                    <div className="flex flex-row" key={`${record.uuid}-${header}`}>
                      <div className="font-mono min-w-20 text-left pr-2 tracking-tighter">
                        {header + ':'}
                      </div>
                      <div className="font-mono text-wrap break-all tracking-tight">
                        {record[header.toLowerCase()]}
                      </div>
                    </div>
                  ))
                ) : (
                  // New record
                  <p>New Record</p>
                )}
              </AccordionTitle>
              <AccordionContent>
                <RecordForm
                  record={record}
                  selectedType={selectedType[record.uuid]}
                  onTypeChange={(type) => updateSelectedType(record.uuid, type)}
                  onSubmit={(e) => handleSubmit(e, record)}
                  onDelete={() => handleDelete(record.uuid)}
                />
              </AccordionContent>
            </Accordion>
          ))
        )}
      </div>
    </div>
  );
}
