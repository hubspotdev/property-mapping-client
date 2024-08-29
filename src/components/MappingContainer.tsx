import React, { useEffect, useState } from "react";
import MappingDisplay from "./MappingDisplay";
import PropertyEditor from './PropertyEditor';
import {
  getHubSpotProperties,
  getCompanyProperties,
  getContactProperties,
  shapeProperties,
  Property,
  PropertyWithMapping,
  SupportedObjectTypes,
} from "../utils";

import { Button, CircularProgress, Drawer, Grid } from "@mui/material";

function MappingContainer(props: {
  objectType: SupportedObjectTypes
  setDisplaySnackBar: Function;
  setSnackbarMessage: Function;
}) {
  const { objectType} = props;



  const [shouldShowPropertyEditor, setShouldShowPropertyEditor] = useState(false)
  const [hubspotProperties, setHubSpotProperties] = useState<Property[]>([]);
  const [nativePropertiesWithMappings, setNativePropertiesWithMappings] =
    useState<PropertyWithMapping[]>();

  const onNewPropertyClick = () =>{
    setShouldShowPropertyEditor(!shouldShowPropertyEditor)
  }

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
     <MappingHeader/>
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
      <Button onClick={onNewPropertyClick} variant='contained'> Add Property</Button>
      <Drawer PaperProps={{elevation:3}} anchor="right" open={shouldShowPropertyEditor} onClose={onNewPropertyClick}>    <Grid container spacing={12} columns={12}> <Grid item ><PropertyEditor onNewPropertyCreate={setShouldShowPropertyEditor} setNativePropertiesWithMappings={setNativePropertiesWithMappings} nativePropertiesWithMappings={nativePropertiesWithMappings} /></Grid> </Grid></Drawer>
    </>

  );
}
export default MappingContainer;

