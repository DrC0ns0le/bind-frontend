/**
 * Apply page - Refactored to use useApplyWorkflow hook
 * All business logic extracted to custom hook
 */
import React from 'react';
import { Frame } from '../../components/layout';
import { SimpleRecordAccordionTable } from '../../components/tables/RecordTable';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { SpinningCog, PrimaryButton, PageHeading, Subheading, SectionLabel } from '../../components/ui';
import { useApplyWorkflow } from './useApplyWorkflow';
import { useTheme } from '../../contexts/ThemeContext';

function Apply() {
  const {
    data,
    loading,
    error,
    isLargeScreen,
    handleApply,
    handleDeploy,
    refresh,
    setRefresh,
  } = useApplyWorkflow();

  const { isDarkMode } = useTheme();

  // Loading state
  if (loading[0]) {
    return (
      <Frame location="apply">
        <PageHeading>Apply</PageHeading>
        <Subheading>Loading...</Subheading>
        <div className="flex items-center justify-center h-1/2">
          {SpinningCog()}
        </div>
      </Frame>
    );
  }

  // Error state
  if (error[0]) {
    return (
      <Frame location="apply">
        <div className="flex items-center justify-center h-screen">
          <p>Error: {error[0].message}</p>
        </div>
      </Frame>
    );
  }

  // Determine subheading text
  const getSubheading = () => {
    if (data[0].records !== null) {
      const count = data[0].records.length;
      return `There's ${count} ${count === 1 ? 'record' : 'records'} in staging pending to be applied.`;
    }
    if (data[2]) return 'Ready to deploy the new configuration.';
    if (loading[2]) return 'Committing changes, please wait...';
    if (loading[3]) return 'Applying changes, please wait...';
    if (error[3]) return 'Failed to apply changes.';
    return 'All changes have been applied.';
  };

  return (
    <Frame location="apply">
      <div className="overflow-visible">
        <PageHeading>Apply</PageHeading>
        <Subheading>{getSubheading()}</Subheading>
      </div>

      <div className="flex-wrap gap-4 mt-12 min-w-[340px]">
        {/* Staging Records Section */}
        {loading[1] ? (
          <div className="flex justify-center h-1/2">{SpinningCog()}</div>
        ) : data[0].records !== null ? (
          <>
            <SectionLabel>RECORDS:</SectionLabel>
            <SimpleRecordAccordionTable
              rows={data[0].records}
              key="apply"
              refresh={refresh}
              setRefresh={setRefresh}
            />
            <div className="flex flex-row place-content-end">
              <PrimaryButton
                type="submit"
                className="mt-8 mr-2 place-self-end"
                onClick={(e) => {
                  e.preventDefault();
                  handleApply();
                }}
              >
                Apply
              </PrimaryButton>
            </div>

            {/* Preview Section */}
            <div className="flex flex-col place-content-end">
              <SectionLabel>PREVIEW:</SectionLabel>
              {Object.entries(data[1].before).map((file, content) => (
                <React.Fragment key={file[0]}>
                  <p className="font-mono text-xs md:text-sm tracking-tighter font-black pb-4 pl-2 text-primary break-words">
                    {file[0]}
                  </p>
                  <DiffEditor
                    theme={isDarkMode ? "vs-dark" : "vs-light"}
                    height="400px"
                    language="json"
                    original={data[1].before[file[0]]}
                    modified={data[1].after[file[0]]}
                    options={{
                      readOnly: true,
                      renderSideBySide: isLargeScreen,
                    }}
                  />
                  <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
                </React.Fragment>
              ))}
            </div>
          </>
        ) : null}

        {/* Deployment Section */}
        {loading[2] ? (
          <div className="flex justify-center h-1/2">{SpinningCog()}</div>
        ) : data[2] ? (
          <div>
            <div className="flex flex-row place-content-end">
              <PrimaryButton
                type="submit"
                className="mt-8 mr-2 place-self-end"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeploy();
                }}
              >
                Deploy
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {/* Deployment Outcome Section */}
        {loading[3] ? (
          <div className="flex justify-center h-1/2">{SpinningCog()}</div>
        ) : data[3] ? (
          <>
            <SectionLabel>Deployment Outcome:</SectionLabel>
            <Editor
              theme={isDarkMode ? "vs-dark" : "vs-light"}
              height="400px"
              language="json"
              value={data[3]}
              options={{
                readOnly: true,
              }}
            />
          </>
        ) : null}
      </div>
    </Frame>
  );
}

export default Apply;
