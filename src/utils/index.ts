interface Property {
  name: string;
  label: string;
  type: string;
  object: string;
}

interface PropertisesResponse {
  contactProperties: any;
  companyProperties: any;
}

interface Mapping {
  name: string;
  property: Property;
  id?: number;
}

const getHubSpotProperties = async (): Promise<PropertisesResponse> => {
  const response = await fetch("/api/hubspot-properties");
  const properties = await response.json();
  return properties;
};

const getContactProperties = (hubspotProperties: PropertisesResponse) => {
  const contactProperties = hubspotProperties.contactProperties;
  return contactProperties;
};

const getCompanyProperties = (hubspotProperties: PropertisesResponse) => {
  const companyProperties = hubspotProperties.companyProperties;
  return companyProperties;
};

const shapeProperties = (properties: Property[]) => {
  return properties.map((property) => {
    return {
      name: property.name,
      label: property.label,
      type: property.type,
      object: property.object,
    };
  });
};

const makeMappingUnique = (mapping: Mapping) => {
  const { name, property } = mapping;
  const { label, object, type } = property;
  return `${name};${property.name};${object};${label}`;
};

const getMappingNameFromDifferenceArray = (mappingStrings: string[]) => {
  const mappingString = mappingStrings[0]; // should only ever be one item in the array since this fires on click
  const valuesArray = mappingString.split(";");
  const mappingName = valuesArray[0];
  return mappingName;
};

const displayErrorMessage = (error: any) => {
  if (error instanceof Error) {
    return `Something went wrong: ${error.message}`;
  }

  return `Something went wrong: ${String(error)}`;
};

export {
  getHubSpotProperties,
  getCompanyProperties,
  getContactProperties,
  shapeProperties,
  makeMappingUnique,
  getMappingNameFromDifferenceArray,
  displayErrorMessage,
};
export type { Mapping, Property };
