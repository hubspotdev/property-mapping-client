import React, { useEffect, useState, useRef } from "react";
import MappingDisplay from "./MappingDisplay";

import {
  getHubSpotProperties,
  getCompanyProperties,
  getContactProperties,
  shapeProperties,
  Property,
  Mapping,
  getMappingNameFromDifferenceArray,
  displayErrorMessage,
  PROPERTY_TYPE_COMPATIBILITY,
  Direction,
  PropertyWithMapping,
} from "../utils";
import { CircularProgress } from "@mui/material";
function MappingContainer(props: {
  objectType: "Contact" | "Company";
  setDisplaySnackBar: Function;
  setSnackbarMessage: Function;
}) {
  const { objectType, setDisplaySnackBar, setSnackbarMessage } = props;
  const [hubspotProperties, setHubSpotProperties] = useState<Property[]>([]);
  const [nativeProperties, setNativeProperties] = useState<Property[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>();
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
        case "Contact":
          setHubSpotProperties(
            shapeProperties(getContactProperties(hubspotProperties), "Contact")
          );
          break;
        case "Company":
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
