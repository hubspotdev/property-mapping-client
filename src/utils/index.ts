import { Propane } from "@mui/icons-material";

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
  return `${name}${property.name}${object}${label}`;
};

export {
  getHubSpotProperties,
  getCompanyProperties,
  getContactProperties,
  shapeProperties,
  makeMappingUnique,
};
export type { Mapping, Property };
