interface Property {
  name: string;
  label: string;
  type: string;
  object: string;
  unique?: boolean;
}

interface PropertisesResponse {
  contactProperties: any;
  companyProperties: any;
}

interface Mapping {
  nativeName: string;
  hubspotLabel?: any;
  hubspotName: string;
  id: number;
  object: Object;
  direction: Direction;
  customerId: string;
}

interface PropertyWithMapping {
  property: Property;
  mapping?: Mapping;
}
enum Direction {
  toHubSpot = "toHubSpot",
  toNative = "toNative",
  biDirectional = "biDirectional",
}

enum SupportedObjectTypes {
  contacts = "Contact",
  companies = "Company"
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

const shapeProperties = (properties: Property[], object: string) => {
  return properties.map((property) => {
    return {
      name: property.name,
      label: property.label,
      type: property.type,
      object: object,
    };
  });
};

// const makeMappingUnique = (mapping: Mapping) => {
//   const { nativeName, hubspotProperty } = mapping;
//   const { label, object, type } = hubspotProperty;
//   return `${nativeName};${hubspotProperty.name};${object};${label}`;
// };

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

const PROPERTY_TYPE_COMPATIBILITY = {
  //Pulled from list of property types https://developers.hubspot.com/docs/api/crm/properties
  String: "string",
  Number: "number",
  Option: "enumeration",
};

export {
  getHubSpotProperties,
  getCompanyProperties,
  getContactProperties,
  shapeProperties,
  //makeMappingUnique,
  getMappingNameFromDifferenceArray,
  displayErrorMessage,
  PROPERTY_TYPE_COMPATIBILITY,
  Direction,
  SupportedObjectTypes
};
export type { Mapping, Property, PropertyWithMapping };
