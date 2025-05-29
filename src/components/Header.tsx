import { Button, Grid } from "@mui/material";
import { useState } from "react";


function Header(): JSX.Element {
  //Added new State to hold HubSpot properties after API call
  const [hubSpotProperties, setHubSpotProperties] = useState(null);

  //Function to get HubSpot properties when button is clicked
  const fetchHubSpotProperties = async () => {
    try {
      //Makes a GET request to /api/hubspot-properties-skip-cache
      const response = await fetch("/api/hubspot-properties-skip-cache");
      //Checks if the response is ok
      if (!response.ok) {
        throw new Error("There was an error");
      }
      //Parses JSON response
      const properties = await response.json();
      //State is updated with properties
      setHubSpotProperties(properties);
      console.log(properties);
      //Displays an error if there is an issue with fetching properties
    } catch (error) {
      console.log("There was an error fetching HubSpot properties:", error);
    }
  };

  return(
    <>
      <Grid id="headerContainer" xs={12} item className="App-header">
        <Grid item xs={5}>{""}</Grid>
        <Grid item xs={5}>Header Content Here</Grid>
        <Grid item xs={2}>
          <Button variant='contained' onClick={fetchHubSpotProperties} style={{ marginLeft: '10px'}}>
            Fetch HubSpot Properties
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default Header;
