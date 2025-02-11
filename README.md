# Property Mappings Client

## What this project does:

This project is a React-based web application designed to handle and map company and contact properties. It works together with a server built using Express.js, please refer to the [Express.js application repository](https://github.com/hubspotdev/property-mapping-server).

## Why is this project useful:
This project simplifies the process of property mapping for companies and contacts.

## How it works:
The application features several React components that facilitate data management and synchronization between the frontend and backend systems, key components include:

**1. MappingDisplay Component**:

**Saving a Mapping (POST request)**: Utilizes the saveMapping function to send new or updated mapping data to the server. It automatically constructs and sends this data whenever there are changes to the selected property or sync direction, ensuring updates are persistent.


**Deleting a Mapping (DELETE request)**: The deleteMapping function is responsible for removing mappings by sending a DELETE request targeting specific IDs. This is triggered when mappings are manually cleared, enabling dynamic data management.


**2. DirectionSelection Component**:

This component provides a user-friendly control for selecting data synchronization directions between systems, allowing users to choose between toHubSpot, toNative, and biDirectional directions.

**3. PropertyEditor Component**:

Facilitates the creation of new properties with specific attributes like label, type, and uniqueness.

## Getting started with the project:


1. **Start the server first.** Although the application can technically run without this initial step, starting the [server](https://github.com/hubspotdev/property-mapping-server) beforehand ensures a smoother and more seamless setup.

2. In the project directory, follow these steps:
- Clone the repository
- Install the dependencies: `npm install`
- Start the application:
   ``npm start``
- Open [http://localhost:3000](http://localhost:3000) to view the app in your browser. The page will reload if you make edits, and you will also see any lint errors in the console.

## What's included

- Styling using [material UI](https://mui.com/) library
- Components to handle both company and contact property mappings
- Support for required mappings
- Success/error message displays
- Loader graphics while fetching data

## Testing:
To execute the tests, use the following command `npm test`.
To check the test coverage report use `npm run test:coverage`.

## Where to get help?

If you encounter any bugs or issues, please report them by opening a GitHub issue. For feedback or suggestions for new code examples, we encourage you to use this [form](https://survey.hsforms.com/1RT0f09LSTHuflzNtMbr2jA96it).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
