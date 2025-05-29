import { useEffect, useState } from "react";
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

type MappingContainerProps = {
  objectType: SupportedObjectTypes;
  setDisplaySnackBar: (open: boolean) => void;
  setSnackbarMessage: (msg: string) => void;
};

function MappingContainer(props: MappingContainerProps): JSX.Element {
  const { objectType } = props;

  const [shouldShowPropertyEditor, setShouldShowPropertyEditor] = useState(false);

  const [hubspotProperties, setHubSpotProperties] = useState<Property[]>([]);
  const [nativePropertiesWithMappings, setNativePropertiesWithMappings] = useState<PropertyWithMapping[]>();

  const onNewPropertyClick = () => {
    setShouldShowPropertyEditor(!shouldShowPropertyEditor);
  };

  // Fetch native properties with mappings on mount
  useEffect(() => {
    async function getNativePropertiesWithMappings(): Promise<void> {
      try {
        const response = await fetch("/api/native-properties-with-mappings");
        if (!response.ok) {
          throw new Error(`Failed to fetch data! Status: ${response.status}`);
        }
        // Only call .json() ONCE and use the value!
        const data = (await response.json()) as PropertyWithMapping[];
        console.log('About to update nativePropertiesWithMappings to', data);
        setNativePropertiesWithMappings(data);
      } catch (error) {
        console.error("Error fetching native properties with mappings:", error);
      }
    }

    getNativePropertiesWithMappings().catch(err => console.error(err));
  }, []);

  // Fetch and shape HubSpot properties on mount/objectType change
  useEffect(() => {
    async function checkHubspotProperties(): Promise<void> {
      const hubspotPropertiesRaw = await getHubSpotProperties();
      console.log('hubspotProperties', hubspotPropertiesRaw);

      switch (objectType) {
        case SupportedObjectTypes.contacts:
          setHubSpotProperties(
            shapeProperties(getContactProperties(hubspotPropertiesRaw), "Contact")
          );
          break;
        case SupportedObjectTypes.companies:
          setHubSpotProperties(
            shapeProperties(getCompanyProperties(hubspotPropertiesRaw), "Company")
          );
          break;
        default:
          console.log("unknown object type");
      }
    }

    checkHubspotProperties().catch(err => console.error(err));
  }, [objectType]);

  // Helper to filter native properties
  const filterPropertiesByObjectType = (
    nativePropertiesWithMappings: PropertyWithMapping[]
  ): PropertyWithMapping[] =>
    nativePropertiesWithMappings.filter(
      (item: PropertyWithMapping) => item.property.object === objectType
    );

  return !nativePropertiesWithMappings ? (
    <CircularProgress data-testid="loading-spinner" />
  ) : (
    <>
      <MappingHeader />
      {filterPropertiesByObjectType(nativePropertiesWithMappings).map(nativePropertyWithMapping => (
        <MappingDisplay
          key={nativePropertyWithMapping.property.name}
          nativePropertyWithMapping={nativePropertyWithMapping}
          hubspotProperties={hubspotProperties}
        />
      ))}
      <Button onClick={onNewPropertyClick} variant='contained'>
        {shouldShowPropertyEditor ? "Cancel" : "Add Property"}
      </Button>
      <Drawer
        PaperProps={{ elevation: 3 }}
        anchor="right"
        open={shouldShowPropertyEditor}
        onClose={onNewPropertyClick}
      >
        <Grid container spacing={2}>
          <Grid item>
            <PropertyEditor
              onNewPropertyCreate={() => setShouldShowPropertyEditor(false)}
              setNativePropertiesWithMappings={setNativePropertiesWithMappings}
              nativePropertiesWithMappings={nativePropertiesWithMappings}
            />
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
}

export default MappingContainer;
