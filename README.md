# Property Mappings Client

A React-based web application designed to handle and map company and contact properties, working in conjunction with an Express.js backend server.

## Table of Contents
- [What this project does](#what-this-project-does)
- [Why is this project useful](#why-is-this-project-useful)
- [Getting started with the project](#getting-started-with-the-project)
- [Components](#components)
  - [MappingDisplay Component](#mappingdisplay-component)
  - [DirectionSelection Component](#directionselection-component)
  - [PropertyEditor Component](#propertyeditor-component)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)
  - [Core](#core)
  - [Development](#development)
- [Where to get help](#where-to-get-help)
- [Who maintains and contributes to this project](#who-maintains-and-contributes-to-this-project)
- [License](#license)

## What this project does
This project is a React-based web application designed to handle and map company and contact properties. It works together with a server built using Express.js, refer to the [Express.js application repository](https://github.com/hubspotdev/property-mapping-server).

## Why is this project useful
This project simplifies the process of property mapping for companies and contacts.

## Getting started with the project

1. **Prerequisites**
   - Install [Docker](https://www.docker.com/get-started/) on your local environment
   - Start the [Express.js server](https://github.com/hubspotdev/property-mapping-server/tree/containerization) first

2. **Setup Steps**
   - Clone the repository
   - Start the application:
   ```bash
   docker-compose up --build
   ```
   - Open `http://localhost:3002` to view the app in your browser

3. **Development Features**
   - Live code updates are enabled through Docker volume mounting
   - The application will automatically reload when you make changes
   - Any lint errors will appear in the console
   - API requests are automatically proxied to the backend service
   - The application runs on port 3002 by default

## Components

### MappingDisplay Component
- Handles saving mappings via POST requests
- Manages mapping deletion through DELETE requests
- Automatically updates when changes occur to selected properties or sync directions

### DirectionSelection Component
- Controls data synchronization direction selection
- Supports multiple sync directions: toHubSpot, toNative, and biDirectional

### PropertyEditor Component
- Enables creation of new properties
- Manages property attributes including label, type, and uniqueness

## Available Scripts

### Docker Commands
- `docker-compose up --build` - Build and start the application in development mode
- `docker-compose down` - Stop the application
- `docker-compose logs -f` - Watch logs in real-time

### Application Commands
These commands can be run inside the Docker container using `docker-compose exec client`:
- `docker-compose exec client npm test` - Run tests
- `docker-compose exec client npm run test:watch` - Run tests in watch mode
- `docker-compose exec client npm run test:coverage` - Generate test coverage report

## Dependencies

### Core
- @babel/plugin-proposal-private-property-in-object (^7.21.11) - Babel plugin for private properties
- @emotion/react (^11.13.3) - CSS-in-JS library
- @emotion/styled (^11.13.0) - Styled components
- @mui/icons-material (^6.1.6) - Material UI icons
- @mui/material (^6.1.6) - Material UI components
- react (^18.3.1) - UI library
- react-dom (^18.3.1) - React DOM renderer
- react-scripts (^5.0.1) - Create React App scripts
- web-vitals (^4.2.4) - Web performance metrics
- http-proxy-middleware (^3.0.3) - HTTP proxy middleware
- @types/node (^22.8.7) - Node.js type definitions
- @types/react (^18.3.12) - React type definitions
- @types/react-dom (^18.3.1) - React DOM type definitions
- eslint-config-prettier (^9.1.0) - Prettier ESLint configuration

### Development
- @testing-library/jest-dom (^6.6.3) - DOM testing utilities
- @testing-library/react (^16.2.0) - React testing utilities
- @testing-library/user-event (^14.5.2) - User event simulation
- @types/jest (^29.5.11) - Jest type definitions
- @types/jsdom (^21.1.7) - JSDOM type definitions
- jest (^29.7.0) - Testing framework
- jest-environment-jsdom (^29.7.0) - JSDOM test environment
- jsdom (^26.0.0) - DOM implementation
- ts-jest (^29.2.5) - TypeScript testing support

## Where to get help?

If you encounter any bugs or issues, please report them by opening a GitHub issue. For feedback or suggestions for new code examples, we encourage you to use this [form](https://survey.hsforms.com/1RT0f09LSTHuflzNtMbr2jA96it).

## Who maintains and contributes to this project

Various teams at HubSpot that focus on developer experience and app marketplace quality maintain and contribute to this project. In particular, this project was made possible by @therealdadams, @rahmona-henry, @zman81988, @natalijabujevic0708, and @zradford

## License

MIT
