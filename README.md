![Containerization Available](https://img.shields.io/badge/Containerization-Available-blue)

> ⚠️ **For Docker users:**  
> Switch to the [`containerization`](https://github.com/hubspotdev/property-mapping-client/tree/containerization) branch for Docker setup and usage instructions.


# Property Mappings Client

A React-based web application designed to handle and map company and contact properties, working in conjunction with an Express.js backend server.

## Table of Contents
- [What this project does](#what-this-project-does)
- [Why is this project useful](#why-is-this-project-useful)
- [Getting started with the project](#getting-started-with-the-project)
  - [Setup](#setup)
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

## What this project does:
This project is a React-based web application designed to handle and map company and contact properties. It works together with a server built using Express.js, refer to the [Express.js application repository](https://github.com/hubspotdev/property-mapping-server).

## Why is this project useful:
This project simplifies the process of property mapping for companies and contacts.

## Getting started with the project:

### Setup:

1. **Prerequisites**
   - Start the [Express.js server](https://github.com/hubspotdev/property-mapping-server) first

2 **In the project directory, follow these steps:**
- Clone the repository
- Install the dependencies with `npm install`
- Start the application with `npm start`
- Open `http://localhost:3000` to view the app in your browser. The page will reload if you make edits, and you will also see any lint errors in the console.

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
- `npm start` - Start the development server using react-scripts
- `npm run build` - Create a production build of the application
- `npm test` - Run tests using Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Dependencies

### Core
- @babel/core - Babel compiler core
- @emotion/react - CSS-in-JS library
- @emotion/styled - Styled components
- @mui/icons-material - Material UI icons
- @mui/material - Material UI components
- react - UI library
- react-dom - React DOM renderer
- react-scripts - Create React App scripts
- web-vitals - Web performance metrics
- http-proxy-middleware - HTTP proxy middleware
- @types/node - Node.js type definitions
- @types/react - React type definitions
- @types/react-dom - React DOM type definitions
- eslint-config-prettier - Prettier ESLint configuration

### Development
- @testing-library/jest-dom - DOM testing utilities
- @testing-library/react - React testing utilities
- @testing-library/user-event - User event simulation
- @types/jest - Jest type definitions
- @types/jsdom - JSDOM type definitions
- jest - Testing framework
- jest-environment-jsdom - JSDOM test environment
- jsdom - DOM implementation
- ts-jest - TypeScript testing support


## Where to get help?

If you encounter any bugs or issues, please report them by opening a GitHub issue. For feedback or suggestions for new code examples, we encourage you to use this [form](https://survey.hsforms.com/1RT0f09LSTHuflzNtMbr2jA96it).

## Who maintains and contributes to this project

Various teams at HubSpot that focus on developer experience and app marketplace quality maintain and contribute to this project. In particular, this project was made possible by @therealdadams, @rahmona-henry, @zman81988, @natalijabujevic0708, and @zradford

## License

MIT
