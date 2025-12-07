import React from "react";
import Frame from "../../components/layout/Frame";
import { PageHeading, Subheading } from "../../components/ui/Typography";
import BackupRestoreSection from "../../components/backup/BackupRestoreSection";

function BackupRestore() {
  const breadcrumbs = [
    { label: "configuration", path: "/configuration" },
    { label: "backup" }
  ];

  return (
    <Frame location="configuration" breadcrumbs={breadcrumbs}>
      <div>
        <PageHeading>Backup & Restore</PageHeading>
        <Subheading>Export and import DNS configuration backups</Subheading>
      </div>

      <div className="border border-border rounded-lg p-6 bg-card mt-12">
        <BackupRestoreSection />
      </div>
    </Frame>
  );
}

export default BackupRestore;
