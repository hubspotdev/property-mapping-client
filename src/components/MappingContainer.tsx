import { ErrorOutline, Password } from "@mui/icons-material";
import React, { useEffect, useState, useRef } from "react";
import {
  getHubSpotProperties,
  getCompanyProperties,
  getContactProperties,
  shapeProperties,
  makeMappingUnique,
  Property,
  Mapping,
  getMappingNameFromDifferenceArray,
  displayErrorMessage,
  PROPERTY_TYPE_COMPATIBILITY,
} from "../utils";
import MappingDisplay from "./MappingDisplay";

function MappingContainer(props: {
  objectType: "Contact" | "Company";
  setDisplaySnackBar: Function;
  setSnackbarMessage: Function;
}) {
  const [hubspotProperties, setHubSpotProperties] = useState<Property[]>([]);
  const [nativeProperties, setNativeProperties] = useState<Property[]>([]);

  const requiredMappings: Mapping[] = [
    {
      name: "example_required",
      property: {
        name: "example_required",
        label: "Example Required",
        object: "Contact",
        type: "text",
      },
    },
  ];

  const [mappings, setMappings] = useState<Mapping[]>(requiredMappings);

  const { objectType, setDisplaySnackBar, setSnackbarMessage } = props;

  function usePrevious(value: Mapping[] | undefined) {
    const ref = useRef<Mapping[]>();

    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const previousMappings = usePrevious(mappings);

  const findDifferences = (
    previousMappings: Mapping[],
    currentMappings: Mapping[]
  ) => {
    console.log("previous mappings", previousMappings);
    console.log("current mappings", currentMappings);
    // const previousMappingsStrings = previousMappings.map((previousMapping) =>
    //   makeMappingUnique(previousMapping)
    // );
    // const currentMappingsStrings = currentMappings.map((currentMapping) =>
    //   makeMappingUnique(currentMapping)
    // );
    const previousMappingIds = previousMappings.map((previousMapping) => {
      return previousMapping.id;
    });
    const currentMappingIds = currentMappings.map((currentMapping) => {
      return currentMapping.id;
    });

    return previousMappingIds.filter((previousMapping) => {
      return !currentMappingIds.includes(previousMapping);
    });
  };
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
      setDisplaySnackBar(true);
      try {
        const parsedResponse = await response.json();

        setSnackbarMessage("Mappings Saved Succesfully");
      } catch (error) {
        const errorMessage = displayErrorMessage(error);

        setDisplaySnackBar(errorMessage);
      }
    }
    //Add in object type
    async function deleteMapping(mappingId: number | undefined) {
      if (mappingId == undefined) {
        setDisplaySnackBar("No mapping ID, unable to delete");
      }
      const response = await fetch(`/api/mappings/${mappingId}`, {
        method: "DELETE",
        mode: "cors",
      });
      try {
        const parsedResponse = await response.json();
        console.log(parsedResponse);
      } catch (error) {
        const errorMessage = displayErrorMessage(error);

        setDisplaySnackBar(errorMessage);
      }
    }
    if (!previousMappings || !mappings) {
      console.log("no previous mappings");
    } else if (previousMappings.length > mappings.length) {
      const difference = findDifferences(previousMappings, mappings);
      console.log("difference", difference);
      //const mappingNameToDelete = getMappingNameFromDifferenceArray(difference);
      deleteMapping(difference[0]);
    } else {
      console.log("mapping mapping added");
      saveMappings();
    }
    //saveMappings();
  }, [mappings]);

  useEffect(() => {
    async function getMappings() {
      const response = await fetch("/api/mappings");
      const mappings = await response.json();
      console.log("mappings in effect", mappings);
      setMappings([...requiredMappings, ...mappings]);
    }
    getMappings();
  }, []);

  useEffect(() => {
    async function getNativeProperties() {
      const response = await fetch("/api/native-properties");
      const properties = await response.json();

      const nativeProperties = properties.filter((property: Property) => {
        return property.object === objectType;
      });
      setNativeProperties(nativeProperties);
    }
    getNativeProperties();
  }, []);

  useEffect(() => {
    async function getHubspotProperties() {
      const hubspotProperties = await getHubSpotProperties();
      switch (objectType) {
        case "Contact":
          setHubSpotProperties(
            shapeProperties(getContactProperties(hubspotProperties))
          );
          break;
        case "Company":
          setHubSpotProperties(
            shapeProperties(getCompanyProperties(hubspotProperties))
          );
          break;
        default:
          console.log("unknown object type");
      }
    }

    getHubspotProperties();
  }, []);

  const filterHubSpotPropertiesByType = (
    nativeProperty: Property,
    hubspotProperties: Property[]
  ) => {
    const allowedType =
      PROPERTY_TYPE_COMPATIBILITY[
        nativeProperty.type as keyof typeof PROPERTY_TYPE_COMPATIBILITY
      ];
    return hubspotProperties.filter(
      (hubspotProperty) => hubspotProperty.type == allowedType
    );
  };

  if (!mappings) {
    return null;
  }

  return (
    <div className="contact-property-mappings-wrapper">
      {nativeProperties.map((property, index) => {
        const filteredHubSpotProperties = filterHubSpotPropertiesByType(
          property,
          hubspotProperties
        );
        return (
          <MappingDisplay
            key={index}
            hubspotProperties={filteredHubSpotProperties}
            nativeProperty={property}
            objectType={objectType}
            mappings={mappings}
            setMappings={setMappings}
          />
        );
      })}
    </div>
  );
}

export default MappingContainer;
