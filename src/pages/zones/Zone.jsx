/**
 * Zone detail page - Refactored to use useZoneData hook
 * All business logic extracted to custom hook
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import { Frame } from '../../components/layout';
import { RecordAccordionTable } from '../../components/tables/RecordTable';
import { SpinningCog, PaginationControls, PageHeading, SectionLabel } from '../../components/ui';
import { useZoneData } from './useZoneData';
import { getUserFriendlyError } from '../../utils/errorHandlers';

function Zone() {
  const { zone: zoneId } = useParams();

  const {
    zoneData,
    recordsData,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refresh,
    setRefresh,
    pagination,
    currentPage,
    handlePageChange,
  } = useZoneData(zoneId);

  const breadcrumbs = [
    { label: 'zones', path: '/zones' },
    { label: zoneData?.name || '...', path: null },
  ];

  // Loading state for zone data
  if (loading[0]) {
    return (
      <Frame location="zones" breadcrumbs={[{ label: 'zones', path: '/zones' }]}>
        <div className="flex items-center justify-center h-screen">
          {SpinningCog()}
        </div>
      </Frame>
    );
  }

  // Error state for zone data
  if (error[0]) {
    return (
      <Frame location="zones" breadcrumbs={[{ label: 'zones', path: '/zones' }]}>
        <div className="flex flex-col items-center justify-center h-screen dark:text-gray-300">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error loading zone</p>
          <p className="text-sm">{getUserFriendlyError(error[0])}</p>
        </div>
      </Frame>
    );
  }

  // Success state
  return (
    <Frame location="zones" breadcrumbs={breadcrumbs}>
      <div>
        <p className="text-2xl font-black tracking-tight dark:text-gray-300 transition-smooth">
          ZONE
        </p>
        <PageHeading className="text-[80px] pb-4 text-wrap overflow-scroll">
          {zoneData?.name}
        </PageHeading>
      </div>

      <div className="flex-wrap sm:gap-4 mt-12 min-w-[340px]">
        <SectionLabel>ZONE RECORDS:</SectionLabel>

        {loading[1] ? (
          <div className="flex justify-center">{SpinningCog()}</div>
        ) : error[1] ? (
          <div className="flex flex-col items-center justify-center pt-8 dark:text-gray-300">
            <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error loading records</p>
            <p className="text-sm">{getUserFriendlyError(error[1])}</p>
          </div>
        ) : (
          <>
            <RecordAccordionTable
              rows={recordsData?.records || []}
              key={`${zoneId}-${currentPage}`}
              zoneId={zoneId}
              refresh={refresh}
              setRefresh={setRefresh}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            {pagination && (
              <div className="flex justify-center pt-4">
                <PaginationControls
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Frame>
  );
}

export default Zone;
