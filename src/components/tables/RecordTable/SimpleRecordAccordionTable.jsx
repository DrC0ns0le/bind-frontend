/**
 * Simple Record Accordion Table - Read-only view
 * Used in Apply page for displaying staging records
 * Memoized to prevent unnecessary re-renders
 */
import React from 'react';
import { Accordion, AccordionTitle, AccordionContent, TableHeader } from '../../layout';
import { useIsLargeScreen } from '../../../hooks/useWindowResize';
import { getRecordStatusClassName } from '../../../utils/formatters';

export const SimpleRecordAccordionTable = React.memo(function SimpleRecordAccordionTable({ rows }) {
  const isLargeScreen = useIsLargeScreen();

  const headers = {
    Type: 'w-1/12',
    Host: 'w-4/12',
    Content: 'w-5/12',
    TTL: 'w-1/12',
  };

  return (
    <div className="flex flex-col">
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
        {rows?.map((record) => (
          <Accordion
            className={getRecordStatusClassName(record)}
            key={record.uuid}
            id={`record-${record.uuid}`}
          >
            <AccordionTitle>
              {/* Title content - responsive layout */}
              {isLargeScreen ? (
                // Desktop: Show all fields in row
                Object.entries(headers).map(([header, className]) => (
                  <div
                    key={`${record.uuid}-${header}`}
                    className={`font-mono ${className}`}
                  >
                    {record[header.toLowerCase()]}
                  </div>
                ))
              ) : (
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
              )}
            </AccordionTitle>
            <AccordionContent>
              {/* Read-only record details */}
              <div className="px-3 py-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-semibold dark:text-gray-400">Type:</span>
                    <span className="ml-2 dark:text-gray-300">{record.type}</span>
                  </div>
                  <div>
                    <span className="font-semibold dark:text-gray-400">TTL:</span>
                    <span className="ml-2 dark:text-gray-300">{record.ttl}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold dark:text-gray-400">Host:</span>
                    <span className="ml-2 dark:text-gray-300">{record.host}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold dark:text-gray-400">Content:</span>
                    <span className="ml-2 dark:text-gray-300 break-all">{record.content}</span>
                  </div>
                  <div className="col-span-2 text-xs text-gray-500 dark:text-gray-500">
                    UUID: {record.uuid}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </Accordion>
        ))}
      </div>
    </div>
  );
});
