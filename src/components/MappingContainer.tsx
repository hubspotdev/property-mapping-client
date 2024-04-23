import React, { useEffect, useState } from "react";
import MappingDisplay from "./MappingDisplay";

import {
  getHubSpotProperties,
  getCompanyProperties,
  getContactProperties,
  shapeProperties,
  Property,
  PropertyWithMapping,
  SupportedObjectTypes,
} from "../utils";
import { Autocomplete, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { OptionDisplay } from './OptionDisplay';
function MappingContainer(props: {
  objectType: SupportedObjectTypes
  setDisplaySnackBar: Function;
  setSnackbarMessage: Function;
}) {
  const { objectType} = props;
  const [hubspotProperties, setHubSpotProperties] = useState<Property[]>([]);
  const [nativePropertiesWithMappings, setNativePropertiesWithMappings] =
    useState<PropertyWithMapping[]>();

  useEffect(() => {
    async function getNativePropertiesWithMappings() {
      const response = await fetch("/api/native-properties-with-mappings");
      const nativePropertiesWithMappings = await response.json();
      setNativePropertiesWithMappings(nativePropertiesWithMappings);
    }
    getNativePropertiesWithMappings();
  }, []);
  useEffect(() => {
    async function getHubspotProperties() {
      const hubspotProperties = await getHubSpotProperties();
      switch (objectType) {
        case SupportedObjectTypes.contacts:
          setHubSpotProperties(
            shapeProperties(getContactProperties(hubspotProperties), "Contact")
          );
          break;
        case SupportedObjectTypes.companies:
          setHubSpotProperties(
            shapeProperties(getCompanyProperties(hubspotProperties), "Company")
          );
          break;
        default:
          console.log("unknown object type");
      }
    }

    getHubspotProperties();
  }, []);
  console.log(nativePropertiesWithMappings);
  const filterPropertiesByObjectType = (
    nativePropertiesWithMappings: PropertyWithMapping[]
  ) => {
    return nativePropertiesWithMappings.filter(
      (nativePropertyWithMapping: PropertyWithMapping) => {
        return nativePropertyWithMapping.property.object == objectType;
      }
    );
  };

  return !nativePropertiesWithMappings ? (
    <CircularProgress />
  ) : (
    <>
     <Grid container item spacing={6} rowSpacing={12} columnSpacing={12}>
      <Grid item xs={4}>

          <Typography variant="h5" gutterBottom>Native Properties</Typography>

      </Grid>
      <Grid item xs={3}>
        <Typography variant="h5" gutterBottom> Sync Direction</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h5" gutterBottom> HubSpot Properties</Typography>
      </Grid>
    </Grid>
      {filterPropertiesByObjectType(nativePropertiesWithMappings).map(
        (nativePropertyWithMapping) => {
          return (
            <MappingDisplay
              key={nativePropertyWithMapping.property.name}
              nativePropertyWithMapping={nativePropertyWithMapping}
              hubspotProperties={hubspotProperties}
            />
          );
        }
      )}
    </>
  );
}
export default MappingContainer;
