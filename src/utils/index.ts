import { PropertySignature } from 'typescript';

interface Property {
  name: string;
  label: string;
  type: string;
  object: string;
}

interface PropertiesResponse {
  contactProperties: any;
  companyProperties: any;
}

interface Mapping {
  nativeName: string;
  //testing hubspotLabel value type
  hubspotLabel: string;
  hubspotName: string;
  id: number;
  object: string;
  direction: Direction;
  customerId: string;
}

interface PropertyWithMapping {
  property: Property;
  mapping: Mapping;
}
enum Direction {
  toHubSpot = 'toHubSpot',
  toNative = 'toNative',
  biDirectional = 'biDirectional',
}

enum SupportedObjectTypes {
  contacts = 'Contact',
  companies = 'Company'
}

const getHubSpotProperties = async (): Promise<PropertiesResponse> => {
  const response = await fetch('/api/hubspot-properties');
  const properties = (await response.json()) as PropertiesResponse;
  return properties;
};

const getContactProperties = (hubspotProperties: PropertiesResponse): Property[] => {
  const contactProperties = (hubspotProperties.contactProperties) as Property[];
  return contactProperties;
};

const getCompanyProperties = (hubspotProperties: PropertiesResponse):Property[] => {
  const companyProperties = (hubspotProperties.companyProperties) as Property[];
  return companyProperties;
};

//object is defined as type string but in Mapping it is defined as type object
const shapeProperties = (properties: Property[], object: string): Property[] => {
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

const getMappingNameFromDifferenceArray = (mappingStrings: string[]):string => {
  const mappingString = mappingStrings[0]; // should only ever be one item in the array since this fires on click
  const valuesArray = mappingString.split(';');
  const mappingName = valuesArray[0];
  return mappingName;
};

const displayErrorMessage = (error: any):string => {
  if (error instanceof Error) {
    return `Something went wrong: ${error.message}`;
  }

  return `Something went wrong: ${String(error)}`;
};

const PROPERTY_TYPE_COMPATIBILITY = {
  //Pulled from list of property types https://developers.hubspot.com/docs/api/crm/properties
  String: 'string',
  Number: 'number',
  Option: 'enumeration',
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
