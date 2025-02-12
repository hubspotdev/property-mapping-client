# Property Mappings Client

A React-based web application designed to handle and map company and contact properties, working in conjunction with an Express.js backend server.

## Table of Contents
- [What this project does](#what-this-project-does)
- [Why is this project useful](#why-is-this-project-useful)
- [Components](#components)
- [Setup](#setup)
- [Features](#features)
- [Testing](#testing)
- [Dependencies](#dependencies)
- [Where to get help](#where-to-get-help)
- [Who maintains and contributes to this project](#who-maintains-and-contributes-to-this-project)
- [License](#license)

## What this project does:
This project is a React-based web application designed to handle and map company and contact properties. It works together with a server built using Express.js, please refer to the [Express.js application repository](https://github.com/hubspotdev/property-mapping-server).

## Why is this project useful:
This project simplifies the process of property mapping for companies and contacts.

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

## Setup

1. **Prerequisites**
   - Start the [Express.js server](https://github.com/hubspotdev/property-mapping-server) first

2 **In the project directory, follow these steps:**
Clone the repository
Install the dependencies: npm install
Start the application: npm start
Open http://localhost:3000 to view the app in your browser. The page will reload if you make edits, and you will also see any lint errors in the console.

## Testing
bash
Run tests
npm test
Generate test coverage report
npm run test:coverage


## Dependencies

### Core
- [Material UI](https://mui.com/) - UI component library
- React
- Additional dependencies (list to be expanded based on package.json)

## Where to get help?

If you encounter any bugs or issues, please report them by opening a GitHub issue. For feedback or suggestions for new code examples, we encourage you to use this [form](https://survey.hsforms.com/1RT0f09LSTHuflzNtMbr2jA96it).

## Who maintains and contributes to this project

Various teams at HubSpot that focus on developer experience and app marketplace quality maintain and contribute to this project. In particular, this project was made possible by @therealdadams, @rahmona-henry, @zman81988, @natalijabujevic0708, and @zradford

License: MIT
