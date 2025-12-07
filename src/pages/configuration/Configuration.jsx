import React from "react";
import { useNavigate } from "react-router-dom";
import Frame from "../../components/layout/Frame";
import { PageHeading, Subheading, BigButton1 } from "../../components/ui";

function Configuration() {
  const navigate = useNavigate();

  const configOptions = [
    {
      id: 'backup',
      label: 'Backup & Restore',
      description: 'Export and import DNS configuration backups',
      path: '/configuration/backup'
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Configure application settings and preferences',
      path: null // Coming soon
    }
  ];

  const handleClick = (optionId) => {
    const option = configOptions.find(opt => opt.id === optionId);
    if (option?.path) {
      navigate(option.path);
    }
  };

  return (
    <Frame location="configuration">
      <div>
        <PageHeading>Configuration</PageHeading>
        <Subheading>Select a configuration option:</Subheading>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-center md:items-stretch gap-4 mt-12">
        {configOptions.map((option) => (
          <BigButton1
            key={option.id}
            option={option.id}
            value={option.label}
            description={option.description}
            onClick={handleClick}
            alignLeft={true}
          />
        ))}
      </div>
    </Frame>
  );
}

export default Configuration;
