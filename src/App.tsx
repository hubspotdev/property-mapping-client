import React, { useEffect, useState } from 'react';

import './App.css';

import { Grid, Box } from '@mui/material';
import MappingDisplay from './components/MappingDisplay'


interface Property { name?: string; label?: string; type?: string; }
interface Mapping { name?: string, property: Property }

function App() {
  const [hubspotContactProperties, setHubSpotContactProperties] = useState<Property[]>([]);
  const [hubspotCompanyProperties, setHubSpotCompanyProperties] = useState<Property[]>([]);
  const [nativeProperties, setNativeProperties] = useState<Property[]>([])
  const [mappings, setMappings] = useState<{}>({})

  useEffect(() => {
    async function getHubspotProperties() {
      const response = await fetch("/api/hubspot-properties")
      const properties = await response.json()

      const contactPropertyOptions = properties.contactProperties.map((property: Property) => {
        return { name: property.name, label: property.label }
      })
      setHubSpotContactProperties(contactPropertyOptions)
      const companyPropertyOptions = properties.companyProperties.map((property: Property) => {
        return { name: property.name, label: property.label }
      })
      setHubSpotCompanyProperties(companyPropertyOptions)
    }
    getHubspotProperties()
  }, [])

  useEffect(() => {
    async function getNativeProperties() {
      const response = await fetch("/api/native-properties")
      const properties = await response.json()
      const nativePropertyOptions = properties.map((property: Property) => {
        return { name: property.name, label: property.label, type: property.type }
      })
      setNativeProperties(nativePropertyOptions)
    }
    getNativeProperties()
  }, [])
  useEffect(() => {
    async function saveMappings() {
      const response = await fetch("/api/mappings", { method: "POST", body: JSON.stringify({ mappings }), headers: { "Content-Type": "application/json", "Accept": "application/json" }, mode: 'cors' })
      const parsedResponse = await response.json()
      //update Toast message
    }
    saveMappings()
  }, [mappings])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={12} columns={12} >
        <Grid id="headerContainer" xs={12} item className='App-header'>
          <Grid item> <p>Header content here</p></Grid>

        </Grid>
        <Grid id="sideBarContainer" xs={2} item>
          <p>Side Bar Content here</p>
        </Grid>
        <Grid id="bodyContainer" xs={8} item>
          {nativeProperties.length > 0 ? nativeProperties.map(property => {
            return <MappingDisplay hubspotContactProperties={hubspotContactProperties} nativeProperty={property} setMappings={setMappings} mappings={mappings} />

          }) : null}

        </Grid>
        <Grid id="footerContainer" xs={12} item className='App-footer'>
          <p> Footer Content here</p>

        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
