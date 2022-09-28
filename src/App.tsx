import React, { useEffect, useState, useRef } from "react";

import "./App.css";

import { Grid, Box, Snackbar, createTheme, ThemeProvider } from "@mui/material";
import MappingDisplay from "./components/MappingDisplay";
import BasicTabs from "./components/Tabs";
import {
  getHubSpotProperties,
  getCompanyProperties,
  getContactProperties,
  shapeProperties,
  makeMappingUnique,
  Property,
  Mapping,
} from "./utils";
import MappingContainer from "./components/MappingContainer";

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          "&.MuiAutocomplete-option": {
            justifyContent: "space-between",
          },
        },
      },
    },
  },
});

function App() {
  const [displaySnackBar, setDisplaySnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={12} columns={12}>
          <Grid id="headerContainer" xs={12} item className="App-header">
            <Grid item>
              {" "}
              <p>Header content here</p>
            </Grid>
          </Grid>
          <Grid id="sideBarContainer" xs={2} item>
            <p>Side Bar Content here</p>
          </Grid>
          <Grid id="bodyContainer" xs={8} item>
            <Snackbar
              open={displaySnackBar}
              message={snackbarMessage}
              autoHideDuration={3000}
              onClose={() => setDisplaySnackBar(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            />
            <BasicTabs objects={["Contact", "Company"]}>
              <MappingContainer
                objectType="Contact"
                setDisplaySnackBar={setDisplaySnackBar}
                setSnackbarMessage={setSnackbarMessage}
              />
              <MappingContainer
                objectType="Company"
                setDisplaySnackBar={setDisplaySnackBar}
                setSnackbarMessage={setSnackbarMessage}
              />
            </BasicTabs>
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
