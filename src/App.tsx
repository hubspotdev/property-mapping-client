import React, { useEffect, useState } from "react";

import "./App.css";

import { Grid, Box, Snackbar } from "@mui/material";
import MappingDisplay from "./components/MappingDisplay";
import BasicTabs from "./components/Tabs";

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
  const [mappings, setMappings] = useState<{}>({});

  const [displaySnackBar, setDisplaySnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    async function getHubspotProperties() {
      const response = await fetch("/api/hubspot-properties");
      const properties = await response.json();

      const contactPropertyOptions = properties.contactProperties.map(
        (property: Property) => {
          return { name: property.name, label: property.label };
        }
      );
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
    const mappingsPayload: { [x: string]: Property }[] = [];
    for (const [nativePropertyName, hubspotPropertyInfo] of Object.entries(
      mappings as Mapping[]
    )) {
      mappingsPayload.push({
        [nativePropertyName as string]: hubspotPropertyInfo as Property,
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
    const contactPropertiesMappings = nativeContactProperties.map(
      (property) => {
        return (
          <MappingDisplay
            hubspotProperties={hubspotContactProperties}
            nativeProperty={property}
            setMappings={setMappings}
            objectType="Contact"
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
      (property) => {
        return (
          <MappingDisplay
            hubspotProperties={hubspotCompanyProperties}
            nativeProperty={property}
            setMappings={setMappings}
            objectType="Company"
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
            tabContent={[renderContactProperties(), renderCompanyProperties()]}
          />
        </Grid>
        <Grid id="footerContainer" xs={12} item className="App-footer">
          <p> Footer Content here</p>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
