import React, { useState } from 'react';

import './App.css';

import { Grid, Box, Snackbar, ThemeProvider } from '@mui/material';

import TabContainer from './components/Tabs';
import Header from './components/Header';

import MappingContainer from './components/MappingContainer';
import { theme } from './theme';
import { SupportedObjectTypes } from './utils';

function App(): JSX.Element {
  const [displaySnackBar, setDisplaySnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={12} columns={12}>
          <Header></Header>
          <Grid id="sideBarContainer" xs={2} item>
            <p>Side Bar Content here</p>
          </Grid>
          <Grid id="bodyContainer" xs={8} item>
            <Snackbar
              open={displaySnackBar}
              message={snackbarMessage}
              autoHideDuration={3000}
              onClose={() => setDisplaySnackBar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
            <TabContainer objects={['Contact', 'Company']}>
              <MappingContainer
                objectType={SupportedObjectTypes.contacts}
                setDisplaySnackBar={setDisplaySnackBar}
                setSnackbarMessage={setSnackbarMessage}
              />
              <MappingContainer
                objectType={SupportedObjectTypes.companies}
                setDisplaySnackBar={setDisplaySnackBar}
                setSnackbarMessage={setSnackbarMessage}
              />
            </TabContainer>
          </Grid>
          <Grid id="footerContainer" xs={12} item className="App-footer">
            <p> Footer Content here</p>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
