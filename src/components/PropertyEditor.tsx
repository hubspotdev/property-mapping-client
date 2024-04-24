import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React, { useEffect, useState } from "react";

function PropertyEditor( ){
  const [type, setType] = useState("")
  const onChange = (event:SelectChangeEvent<string>) =>{
    setType(event.target.value)
  }

  return(
    <>
    <TextField id="property-label" label="Label" variant="standard" />
    <TextField id="property-name" label="Name" variant="standard" disabled />

    <FormControl fullWidth>
  <InputLabel id="property-type">Property Type</InputLabel>
  <Select
    labelId="property-type"
    id="property-type-select"
    value={type}
    label="Type"
    onChange={onChange}
  >
    <MenuItem value={"string"}>String</MenuItem>
    <MenuItem value={"number"}>Number</MenuItem>
    <MenuItem value={"option"}>Option</MenuItem>
  </Select>
</FormControl>
</>

  )

}

export default PropertyEditor
