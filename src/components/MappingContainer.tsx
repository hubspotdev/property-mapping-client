import { useEffect, useState,  Dispatch, SetStateAction  } from "react";
import { CircularProgress } from "@mui/material";
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
import { MappingHeader } from "./MappingHeaders";

function MappingContainer(props: {
  objectType: SupportedObjectTypes
  setDisplaySnackBar: Dispatch<SetStateAction<boolean>>;
  setSnackbarMessage: Dispatch<SetStateAction<string>>;
}):JSX.Element {
  const {objectType} = props;
  const [hubspotProperties, setHubSpotProperties] = useState<Property[]>([]);
  const [nativePropertiesWithMappings, setNativePropertiesWithMappings] =
    useState<PropertyWithMapping[]>();

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
    </>
  );
}

export default MappingContainer;
