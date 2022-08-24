import React, { useEffect, useState, useRef } from "react";
import {
  getHubSpotProperties,
  getCompanyProperties,
  getContactProperties,
  shapeProperties,
  makeMappingUnique,
  Property,
  Mapping,
} from "../utils";
import MappingDisplay from "./MappingDisplay";

function MappingContainer(props: { objectType: "Contact" | "Company" }) {
  const [hubspotProperties, setHubSpotProperties] = useState<Property[]>([]);
  const [nativeProperties, setNativeProperties] = useState<Property[]>([]);

  const [mappings, setMappings] = useState<Mapping[]>();
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
    currentmappings: Mapping[]
  ) => {
    previousMappings.filter((previousMapping) =>
      currentmappings.some((currentMapping) => {
        makeMappingUnique(currentMapping) == makeMappingUnique(previousMapping);
      })
    );
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
      try {
        const parsedResponse = await response.json();
      } catch (error) {}
    }

    if (!previousMappings || !mappings) {
      console.log("no previous mappings");
    } else if (previousMappings.length > mappings.length) {
      const difference = findDifferences(previousMappings, mappings);
      console.log("difference", difference);
    }
    saveMappings();
  }, [mappings]);

  useEffect(() => {
    async function getMappings() {
      const response = await fetch("/api/mappings");
      const mappings = await response.json();
      console.log("mappings in effect", mappings);
      setMappings(mappings);
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

  const { objectType } = props;

  if (!mappings) {
    return null;
  }

  return (
    <div className="contact-property-mappings-wrapper">
      {nativeProperties.map((property, index) => {
        return (
          <MappingDisplay
            key={index}
            hubspotProperties={hubspotProperties}
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
