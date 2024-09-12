import {
  Autocomplete,
  TextField,
  Grid,
  Typography,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect, useRef } from "react";
import { Property, Mapping, Direction, PropertyWithMapping } from "../utils";
import { DirectionSelection } from './DirectionSelection';
import { OptionDisplay } from './OptionDisplay';

interface MappingDisplayProps {
  nativePropertyWithMapping: PropertyWithMapping;
  hubspotProperties: Property[];
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

function MappingDisplay(props: MappingDisplayProps): JSX.Element |null {
  const { nativePropertyWithMapping, hubspotProperties } = props;
  const { property, mapping } = nativePropertyWithMapping;
  const { name, label, type, object } = property;


  //let {  direction, hubspotName, id, hubspotLabel } = mapping ;

  const hubspotProperty: Property | null = mapping ?  {
    name: mapping.hubspotName,
    label: mapping.hubspotLabel,
    type,
    object,
  }:null;

  const [value, setValue] = useState<Property | null>(
    hubspotProperty?.name ? hubspotProperty : null
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [syncDirection, setSyncDirection] = useState<Direction>(
    mapping?.direction || Direction.toHubSpot
  );

  function usePrevious(value: Mapping | null| undefined) {
    const ref = useRef<Mapping | null>();

    useEffect(() => {
      ref.current = value;
    }),
      [value];
    return ref.current;
  }

  const previousMapping = usePrevious(mapping);
  async function deleteMapping(mappingId: number | undefined) {
    if (mappingId == undefined) {
    }
    const response = await fetch(`/api/mappings/${mappingId}`, {
      method: "DELETE",
      mode: "cors",
    });
    try {
      const parsedResponse = await response.json();
      console.log(parsedResponse);
    } catch (error) {}
  }
  useEffect(() => {
    async function saveMapping() {
      console.log("hubspot propety in effect", value);
      if (!value?.name) {
        return false;
      }
      const updatedMapping = {
        id: mapping?.id,
        nativeName: name,
        hubspotName: value?.name,
        hubspotLabel: value?.label,
        object: object,
        direction: syncDirection,
      };
      console.log("updatedMapping", updatedMapping);

      const response = await fetch("/api/mappings", {
        method: "POST",
        body: JSON.stringify(updatedMapping),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(await response.json());
    }
    saveMapping();
  }, [value, syncDirection]);

  const handleDirectionChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setSyncDirection(event.target.value as Direction);
  };
  const handleMappingChange = (
    event: React.SyntheticEvent,
    value: Property | null
  ) => {
    console.log(event, value);

    if (value) {
      console.log("value was truthy");
      mapping?.hubspotName ? (mapping.hubspotName = value.name) : null;
      setValue(value);
    } else {
      const previousValue = previousMapping;
      console.log(previousValue);
      deleteMapping(previousMapping?.id);
      setValue(value);
    }
  };
  console.log(hubspotProperty, "hubspotProperty");
  return (
    <Grid container item spacing={6} rowSpacing={12} columnSpacing={12}>
      <Grid item xs={4}>
        <Item>
          <Typography variant="body1">{label}</Typography>
        </Item>
      </Grid>
      <Grid item xs={2}>

        {DirectionSelection(label, handleDirectionChange, syncDirection)}
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          className={`hubspot${object}Property`}
          options={hubspotProperties}
          onChange={handleMappingChange}
          renderInput={(params) => {
            return (
              <TextField {...params} label={`HubSpot ${object} Properties`} />
            );
          }}
          renderOption={OptionDisplay}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          value={value}
          isOptionEqualToValue={(option, value) => {
            return option.name === value.name;
          }}
          disabled={name.endsWith("required") ? true : false} // Probably a better way to do this but naming convention works since the customer can't change that
        />
      </Grid>
    </Grid>
  );
}

export default MappingDisplay;


