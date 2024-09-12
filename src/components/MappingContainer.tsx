import { useEffect, useState,  Dispatch, SetStateAction  } from "react";
import { CircularProgress } from "@mui/material";
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
import { MappingHeader } from './MappingHeaders';

function MappingContainer(props: {
  objectType: SupportedObjectTypes
  setDisplaySnackBar: Function;
  setSnackbarMessage: Function;
}):JSX.Element {
  const { objectType} = props;



  const [shouldShowPropertyEditor, setShouldShowPropertyEditor] = useState(false)

  const [hubspotProperties, setHubSpotProperties] = useState<Property[]>([]);
  const [nativePropertiesWithMappings, setNativePropertiesWithMappings] =
    useState<PropertyWithMapping[]>();

  const onNewPropertyClick = () =>{
    setShouldShowPropertyEditor(!shouldShowPropertyEditor)
  }

  useEffect(() => {
    async function getNativePropertiesWithMappings(): Promise<void> {
      try {
        const response = await fetch("/api/native-properties-with-mappings");
        if (!response.ok) {
          throw new Error(`Failed to fetch data! Status: ${response.status}`);
        }
        const nativePropertiesWithMappings = (await response.json()) as PropertyWithMapping[];

        setNativePropertiesWithMappings(nativePropertiesWithMappings);
      } catch (error) {
        console.error("Error fetching native properties with mappings:", error);
      }
    }

    getNativePropertiesWithMappings()
      .catch(err => console.error(err));

  }, []);

  useEffect(() => {
    async function checkHubspotProperties():Promise<void> {
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

    checkHubspotProperties()
      .catch(err => console.error(err));

  }, []);
  const filterPropertiesByObjectType = (
    nativePropertiesWithMappings: PropertyWithMapping[]
  ):PropertyWithMapping[] => {
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
      <Button onClick={onNewPropertyClick} variant='contained'> {shouldShowPropertyEditor ? "Add Property" : "Cancel"}</Button>
      <Drawer PaperProps={{elevation:3}} anchor="right" open={shouldShowPropertyEditor} onClose={onNewPropertyClick}>    <Grid container spacing={12} columns={12}> <Grid item ><PropertyEditor onNewPropertyCreate={setShouldShowPropertyEditor} setNativePropertiesWithMappings={setNativePropertiesWithMappings} nativePropertiesWithMappings={nativePropertiesWithMappings} /></Grid> </Grid></Drawer>
    </>

  );
}

export default MappingContainer;
