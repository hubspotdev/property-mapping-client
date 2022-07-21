import React, { useEffect, useState } from "react";

import "./App.css";

import { Grid, Box, Snackbar, createTheme, ThemeProvider } from "@mui/material";
import MappingDisplay from "./components/MappingDisplay";
import BasicTabs from "./components/Tabs";

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          justifyContent: "space-between",
        },
      },
    },
  },
});

interface Property {
  name?: string;
  label?: string;
  type?: string;
  object?: string;
}
interface Mapping {
  name?: string;
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
  const [mappings, setMappings] = useState<Mapping>({
    name: "name",
    property: {},
  });

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
      console.log("options", contactPropertyOptions.length);
      console.log("contactProperties", hubspotContactProperties.length);
      setHubSpotContactProperties(contactPropertyOptions);
      console.log("contactProperties", hubspotContactProperties.length);
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
    const mappingsPayload: Mapping[] = new Array();
    for (const [nativePropertyName, hubspotPropertyInfo] of Object.entries(
      mappings
    )) {
      mappingsPayload.push({
        name: nativePropertyName,
        property: hubspotPropertyInfo,
      });
    }

    async function saveMappings() {
      const response = await fetch("/api/mappings", {
        method: "POST",
        body: JSON.stringify({ mappingsPayload }),
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

  const renderContactProperties = () => {
    console.log(
      "hubspotContactProperties in render",
      hubspotContactProperties.length
    );
    const contactPropertiesMappings = nativeContactProperties.map(
      (property, index) => {
        const getMappingForProperty = () => {};
        const mappingForProperty = mappings.name == property.name;
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
