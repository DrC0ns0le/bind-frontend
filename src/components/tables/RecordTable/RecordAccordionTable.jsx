/**
 * Record accordion table - Refactored to use hooks and service layer
 * Displays DNS records in an accordion format with search and actions
 */
import React, { useState, useEffect } from 'react';
import { Accordion, AccordionTitle, AccordionContent, TableHeader } from '../../layout';
import { IconButton, RefreshIcon, PlusIcon, TextInput } from '../../ui';
import { useIsLargeScreen } from '../../../hooks/useWindowResize';
import { useRecordForm } from './useRecordForm';
import { RecordForm } from './RecordForm';
import { getRecordStatusClassName } from '../../../utils/formatters';
import { DNS_DEFAULTS } from '../../../config/constants';

export function RecordAccordionTable(props) {
  const [allRecords, setAllRecords] = useState(props.rows);
  const isLargeScreen = useIsLargeScreen();

  const { refresh, setRefresh, zoneId, searchQuery, setSearchQuery } = props;

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
      {/* Search and actions */}
      <div className="flex flex-row p-2 pb-3">
        <div className="flex flex-row w-[30%] items-center">
          <label
            htmlFor="host"
            className="z-10 relative left-3 text-sm w-0 dark:text-gray-400"
          >
            Search:
          </label>
          <TextInput
            name="host"
            id="host"
            value={searchQuery}
            className="z-0 pl-[64px] pr-2"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <IconButton
          className="ml-auto mx-4 bg-primary text-white hover:bg-primary-hover shadow-gb2 hover:shadow-gba2"
          onClick={() => setRefresh(Math.floor(Date.now() / 1000))}
        >
          <RefreshIcon additionalClass="scale-75" />
        </IconButton>
        <IconButton
          className="bg-primary text-white hover:bg-primary-hover shadow-gb2 hover:shadow-gba2"
          onClick={addNewRecord}
        >
          <PlusIcon additionalClass="scale-75" />
        </IconButton>
      </div>

      {/* Table header */}
      {isLargeScreen ? (
        <TableHeader showChevronSpace>
          {Object.entries(headers).map(([header, className]) => (
            <div
              key={header}
              className={`${className} font-semibold font-mono tracking-tight text-md dark:text-gray-300`}
            >
              {header}
            </div>
          ))}
        </TableHeader>
      ) : (
        <TableHeader>Zone Records</TableHeader>
      )}

      {/* Accordion rows */}
      <div className="border-x border-b border-gray-200 dark:border-dark-border rounded-b-lg overflow-hidden">
        {allRecords?.map((record) => (
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
        ))}
      </div>
    </div>
  );
}
