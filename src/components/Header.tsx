import { Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';

function Header(): JSX.Element {
  const [installUrl, setInstallUrl] = useState('');
  useEffect(() => {
    async function getInstallUrl():Promise<void> {
      const response = await fetch('/api/install');
      const url = await response.text();
      setInstallUrl(url);
    }
    getInstallUrl()
      .catch(err => console.error(err));
  }, []);

  return(
    <>
      <Grid id="headerContainer" xs={12} item className="App-header">
        <Grid item xs={5}>{''}</Grid>
        <Grid item xs={5}>Header Content Here</Grid>
        <Grid item xs={2}>
          <Button variant='contained'  href={installUrl}>Install</Button>
        </Grid>
      </Grid>
    </>
  );
}

export default Header;
