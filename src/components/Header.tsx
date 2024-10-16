import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";

function Header(): JSX.Element {
  const [installUrl, setInstallUrl] = useState("");
  const [hubSpotProperties, setHubSpotProperties] = useState(null); //State to hold HubSpot properties after API call

  useEffect(() => {
    async function getInstallUrl():Promise<void> {
      const response = await fetch("/api/install");
      const url = await response.text();
      setInstallUrl(url);
    }
    getInstallUrl()
      .catch(err => console.error(err));
  }, []);


  //Function to get HubSpot properties when button is clicked
  const fetchHubSpotProperties  = async () => {
    try { 
      const response = await fetch("/api/hubspot-properties-skip-cache");
      if (!response.ok) {
       throw new Error ("There was an error");
    }
    const properties = await response.json();
//State is updated with properties
    setHubSpotProperties(properties); 
    console.log(properties);
  } catch (error) {
    console.log("There was an error fetching HubSpot properties:" error);
  }
  };

  return(
    <>
      <Grid id="headerContainer" xs={12} item className="App-header">
        <Grid item xs={5}>{""}</Grid>
        <Grid item xs={5}>Header Content Here</Grid>
        <Grid item xs={2}>
          <Button variant='contained'  href={installUrl}>Install</Button>
          <Button variant='contained' onClick={fetchHubSpotProperties} style={{ marginLeft: '10px'}}>
           Fetch HubSpot Properties 
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default Header;
