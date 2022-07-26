import React, { useEffect, useState } from "react";

import "./App.css";

import { Grid, Box, Snackbar, createTheme, ThemeProvider } from "@mui/material";
import MappingDisplay from "./components/MappingDisplay";
import BasicTabs from "./components/Tabs";

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

interface Property {
  name: string;
  label: string;
  type: string;
  object: string;
}
interface Mapping {
  name: string;
  property: Property;
}

function App() {
  const [hubspotContactProperties, setHubSpotContactProperties] = useState<
    Property[]
  >([]);
  const [hubspotCompanyProperties, setHubSpotCompanyProperties] = useState<
    Property[]
  >([]);
  const [nativeContactProperties, setNativeContactProperties] = useState<
    Property[]
  >([]);
  const [nativeCompanyProperties, setNativeCompanyProperties] = useState<
    Property[]
  >([]);
  const [mappings, setMappings] = useState<Mapping[]>([
    {
      name: "",
      property: {
        name: "",
        label: "",
        type: "",
        object: "Contact",
      },
    },
  ]);

  const [displaySnackBar, setDisplaySnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    async function getHubspotProperties() {
      const response = await fetch("/api/hubspot-properties");
      const properties = await response.json();
      console.log("properties from api", properties);
      const contactPropertyOptions: Property[] =
        properties.contactProperties.map((property: Property) => {
          return { name: property.name, label: property.label };
        });

      setHubSpotContactProperties(contactPropertyOptions);
      const companyPropertyOptions = properties.companyProperties.map(
        (property: Property) => {
          return { name: property.name, label: property.label };
        }
      );
      setHubSpotCompanyProperties(companyPropertyOptions);
    }
    getHubspotProperties();
  }, []);

  useEffect(() => {
    async function getNativeProperties() {
      const response = await fetch("/api/native-properties");
      const properties = await response.json();

      const nativeContactProperties = properties.filter(
        (property: Property) => {
          return property.object === "Contact";
        }
      );
      setNativeContactProperties(nativeContactProperties);

      const nativeCompanyProperties = properties.filter(
        (property: Property) => {
          return property.object === "Company";
        }
      );
      setNativeCompanyProperties(nativeCompanyProperties);
    }
    getNativeProperties();
  }, []);
  useEffect(() => {
    async function saveMappings() {
      const response = await fetch("/api/mappings", {
        method: "POST",
        body: JSON.stringify(mappings),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      });
      try {
        const parsedResponse = await response.json();
        setDisplaySnackBar(true);
        setSnackbarMessage("Mapping saved successfully");
      } catch (error) {
        setDisplaySnackBar(true);
        setSnackbarMessage("There was an issue saving your mapping");
      }
    }
    saveMappings();
  }, [mappings]);

  useEffect(() => {
    async function getMappings() {
      const response = await fetch("/api/mappings");
      const mappings = await response.json();
      console.log("mappings in effect", mappings);
      setMappings(mappings);
    }
    getMappings();
  }, []);

  const renderContactProperties = () => {
    console.log(
      "hubspotContactProperties in render",
      hubspotContactProperties.length
    );
    const contactPropertiesMappings = nativeContactProperties.map(
      (property, index) => {
        console.log("rendering contact properties, mappings:", mappings);
        const getMappingForProperty = () => {};
        // const mappingForProperty = mappings.name == property.name;
        return (
          <MappingDisplay
            key={index}
            hubspotProperties={hubspotContactProperties}
            nativeProperty={property}
            setMappings={setMappings}
            objectType="Contact"
            mappings={mappings}
          />
        );
      }
    );

    return (
      <div className="contact-property-mappings-wrapper">
        <> {contactPropertiesMappings} </>
      </div>
    );
  };

  const renderCompanyProperties = () => {
    const companyPropertiesMappings = nativeCompanyProperties.map(
      (property, index) => {
        return (
          <MappingDisplay
            key={index}
            hubspotProperties={hubspotCompanyProperties}
            nativeProperty={property}
            setMappings={setMappings}
            objectType="Company"
            mappings={mappings}
          />
        );
      }
    );

    return (
      <div className="contact-property-mappings-wrapper">
        <> {companyPropertiesMappings} </>
      </div>
    );
  };

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
            />

            <BasicTabs
              objects={["Contact", "Company"]}
              tabContent={[
                renderContactProperties(),
                renderCompanyProperties(),
              ]}
            />
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
