import React, { useEffect, useState } from 'react';

import './App.css';
import { styled } from '@mui/material/styles';
import { Autocomplete, TextField, Grid, Container, Box, Button, Typography, Paper } from '@mui/material';
interface Property { name?: string; label?: string; type?: string; }
interface Mapping { name?: string, property: Property }

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Mapping(props: { nativeProperty: Property, hubspotContactProperties: Property[], setMappings: Function, mappings: {} }): JSX.Element {
  const { nativeProperty, hubspotContactProperties, setMappings, mappings } = props
  const name = nativeProperty.name || 'name'
  return (
    <Grid container item spacing={6} rowSpacing={12} columnSpacing={12}>
      <Grid item xs={4} >
        <Item>
          <Typography variant='body1'>{nativeProperty.label}</Typography>
        </Item>
      </Grid>
      <Grid item xs={4} >


        <Autocomplete disablePortal className="hubspotContactPropeties" options={hubspotContactProperties} onChange={(event, value, reason) => { setMappings((mappings: Mapping[]) => { return { ...mappings, [name]: value } }) }} renderInput={(params) => <TextField {...params} label="HubSpot Contact Properties" />} />



      </Grid>
    </Grid >
  )
}

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
            return <Mapping hubspotContactProperties={hubspotContactProperties} nativeProperty={property} setMappings={setMappings} mappings={mappings} />

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
