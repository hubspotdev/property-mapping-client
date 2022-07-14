import React, { useEffect, useState } from "react";

import "./App.css";

import { Grid, Box, SimplePaletteColorOptions } from "@mui/material";
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
  const [nativeProperties, setNativeProperties] = useState<Property[]>([]);
  const [mappings, setMappings] = useState<{}>({});

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
      const nativePropertyOptions = properties.map((property: Property) => {
        return {
          name: property.name,
          label: property.label,
          type: property.type,
          object: property.object,
        };
      });
      setNativeProperties(nativePropertyOptions);
    }
    getNativeProperties();
  }, []);
  useEffect(() => {
    async function saveMappings() {
      const response = await fetch("/api/mappings", {
        method: "POST",
        body: JSON.stringify({ mappings }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      });
      const parsedResponse = await response.json();
      //update Toast message
    }
    saveMappings();
  }, [mappings]);

  const renderContactProperties = () => {
    const contactProperties =
      nativeProperties.length > 0
        ? nativeProperties.filter((property) => {
            return property.object === "Contact";
          })
        : null;

    console.log(contactProperties);

    const contactPropertiesMappings = contactProperties
      ? contactProperties.map((property) => {
          return (
            <MappingDisplay
              hubspotProperties={hubspotContactProperties}
              nativeProperty={property}
              setMappings={setMappings}
              mappings={mappings}
              objectType="Contact"
            />
          );
        })
      : null;
    console.log(contactPropertiesMappings);
    return (
      <div className="contact-property-mappings-wrapper">
        <> {contactPropertiesMappings} </>
      </div>
    );
  };

  const renderCompanyProperties = () => {
    const companyProperties =
      nativeProperties.length > 0
        ? nativeProperties.filter((property) => {
            return property.object === "Company";
          })
        : null;

    console.log(companyProperties);

    const companyPropertiesMappings = companyProperties
      ? companyProperties.map((property) => {
          return (
            <MappingDisplay
              hubspotProperties={hubspotCompanyProperties}
              nativeProperty={property}
              setMappings={setMappings}
              mappings={mappings}
              objectType="Company"
            />
          );
        })
      : null;
    console.log(companyPropertiesMappings);
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
