# Bind Frontend

This is simple frontend written in React for the BIND management service written in Go. The primary goal of this project is to provide a simple, clean and minimalist for mananging BIND DNS zones and records. 

Note: This project is still in development and is not yet ready for production use. I also don't really do frontend development so there's a lot of spaghetti code in here.

## Features

- DNS Zone Management
  - View all available DNS zones
  - Create, read, update, and delete DNS records for each zone
  - Accordion style interface
  - Fuzzy search within records
  - Visual color coding for DNS records, (ie, Green for new records, Red for deleted records, Gray for modified records)

- Staging & Deployment
  - Two stage deployment process, first commit changes to Git, then apply changes to the BIND server via Ansible playbook
  - View all records in staging
  - Review BIND configuration files changes with diff view before commit
  - Apply changes to the BIND server via Ansible playbook, and view deployment outcome
- Responsive design

## Todo

- Add pagination for zones list
- Add zone management functionality
  - Create zone from zones page
  - Delete zone from zones page
  - View & edit zone details within zone page(ie primary_ns, admin email, etc)
- Add tags management support for records
- Add filter support for records
- Add client-side validation for DNS records
- Add global configuration page(ie, default TTL, default NS, etc)
- Major refactor to clean up codebase(its a mess atm)
- General polish and cleanup
- Dark mode support
- Better documentation & screenshots :D

## Technologies Used

- React
- Vite
- Tailwind CSS
- Axios for API requests
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/bind-frontend.git
```

2. Navigate to the project directory:
```
cd bind-frontend
```

3. Install dependencies:
```
npm install
```

4. Start the development server:
```
npm run dev
```

## Building for Production

To create a production build:

```
npm run build
```

## Docker

This project includes a Dockerfile for containerization. To build and run the Docker image:

```
docker build -t bind-frontend .
docker run -p 80:80 bind-frontend
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request.

