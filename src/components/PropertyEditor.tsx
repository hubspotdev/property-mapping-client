
import { AppBar, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Box, Select, SelectChangeEvent, TextField, ToggleButton, Typography, Menu , Checkbox, Button, Alert, Collapse} from '@mui/material';
import { styled } from '@mui/material/styles';
import {Property, PropertyWithMapping, SupportedObjectTypes} from '../utils'
import React, { ChangeEvent, useEffect, useState } from "react";


const FormField = styled(Box)(({theme}) =>({
  padding: theme.spacing(2)

}))

const objectTypeArray:string[] = []
  for (const objectType in SupportedObjectTypes) {
    console.log(SupportedObjectTypes)
      objectTypeArray.push(objectType)
      }


const capitalizeFirstLetter = (string:string) =>{
  return string.charAt(0).toUpperCase()  + string.slice(1)
}


function PropertyEditor(props:{onNewPropertyCreate: React.Dispatch<React.SetStateAction<boolean>>, setNativePropertiesWithMappings: React.Dispatch<React.SetStateAction<PropertyWithMapping[]|undefined>>, nativePropertiesWithMappings:PropertyWithMapping[]} ){

  const {onNewPropertyCreate, setNativePropertiesWithMappings, nativePropertiesWithMappings } = props
  const [propertyLabel, setPropertyLabel] = useState("")
  const [propertyName, setPropertyName] = useState("")
  const onLabelChange = (event:ChangeEvent<HTMLInputElement> )=>{
    setPropertyLabel(event.target.value)
    const dbSafeString = event.target.value.replace(/[^A-Z0-9]/ig, "_")
    setPropertyName(dbSafeString)
  }

  const [propertyType, setPropertyType] = useState("")
  const onPropertyTypeChange = (event:SelectChangeEvent<string>) =>{
    setPropertyType(event.target.value)
  }
  const [objectType, setObjectType] = useState("")
  const onObjectTypeChange = (event:SelectChangeEvent<string>) =>{
    setObjectType(event.target.value)
  }

  const [enforcesUniquness, setEnforceUniquness] = useState(false)
  const onUniqunessChange =( event:ChangeEvent<HTMLInputElement>) =>{
    setEnforceUniquness(event.target.checked)
  }

  const [hasErrors, setHasErrors] = useState(false)

const createNewProperty = async (body:any) =>{
  console.log('body',body)
  const response = await fetch("/api/native-properties/",{body:JSON.stringify(body), method:"POST",        headers: {
    "Content-Type": "application/json",
  },})
  return response
}

  const handleNewPropertyCreateRequest = async () =>{
    if(!propertyLabel|| !propertyName || !propertyType || !objectType){
      setHasErrors(true)
    }
    const propertyInfo ={
      propertyLabel, propertyName, propertyType, objectType, enforcesUniquness
    }
    const createNewPropertyResponse = await createNewProperty(propertyInfo)
    if(createNewPropertyResponse.status == 200){
      const newPropertyWithMapping:PropertyWithMapping = {
        property:{name:propertyName, label:propertyLabel, type:propertyType, object:objectType, unique:enforcesUniquness},

      }
      setNativePropertiesWithMappings([...nativePropertiesWithMappings,newPropertyWithMapping])
      onNewPropertyCreate(false)
    }
    console.log(createNewPropertyResponse)

  }

  return(
    <>
  <Grid item xs={12} spacing={2} >
    <AppBar position='static' sx={{padding:2}}><Typography variant='h4'> Create New Property </Typography> </AppBar>
    </Grid>
    <Grid item xs={12} >
      <Grid item xs={12}>
        <FormField>
    <TextField id="property-label" label="Label" variant="standard" onChange={onLabelChange} value={propertyLabel} />
    </FormField>
    </Grid>
    <Grid item xs={12}>
      <FormField>
    <TextField id="property-name" label="Name" variant="standard" disabled value={propertyName}/>
    </FormField>
    </Grid>
    </Grid>
    <Grid item>
    <FormField>
    <FormControl fullWidth>
  <InputLabel id="property-type">Property Type</InputLabel>
  <Select
    labelId="property-type"
    id="property-type-select"
    value={propertyType}
    label="Type"
    onChange={onPropertyTypeChange}
  >
    <MenuItem value={"string"}>String</MenuItem>
    <MenuItem value={"number"}>Number</MenuItem>
    <MenuItem value={"option"}>Option</MenuItem>
  </Select>
</FormControl>
</FormField>
</Grid>
<Grid item>
    <FormField>
    <FormControl fullWidth>
  <InputLabel id="ojbect-type">Object Type</InputLabel>
  <Select
    labelId="object-type"
    id="object-type-select"
    value={objectType}
    label="Type"
    onChange={onObjectTypeChange}
  >
 {objectTypeArray.map((objectType ) => {return  <MenuItem value={objectType}> {capitalizeFirstLetter(objectType)}</MenuItem>})}
  </Select>
</FormControl>
</FormField>
</Grid>
<FormField>
<FormGroup>
  <FormControlLabel control={<Checkbox checked={enforcesUniquness} onChange={onUniqunessChange}/> } label="Enforce Uniquness"/>
</FormGroup>
</FormField>
<Grid item spacing={2}>
<Button variant='contained' onClick={handleNewPropertyCreateRequest}> Submit</Button>
</Grid>
<Collapse in={hasErrors}>
<Alert severity="error" >We are missing information needed to create the property</Alert>
</Collapse>
</>

  )

}

export default PropertyEditor
