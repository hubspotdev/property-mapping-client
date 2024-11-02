import {
  Autocomplete,
  TextField,
  Grid,
  Typography,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { Property, Mapping, Direction, PropertyWithMapping, MaybeProperty } from "../utils";
import { DirectionSelection } from "./DirectionSelection";
import { OptionDisplay } from "./OptionDisplay";

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

const validateProperty = (maybeProperty:MaybeProperty) =>{
  if(!maybeProperty.label){
    throw new Error("Missing the required attirubte 'label'")
  }
  if(!maybeProperty.name){
    throw new Error("Missing the required attirubte 'name'")
  }
  if(!maybeProperty.modificationMetadata){
    throw new Error("Missing the required attirubte 'modificationMetaData'")
  }
  return maybeProperty as Property

}

function MappingDisplay(props: MappingDisplayProps): JSX.Element |null {
  const { nativePropertyWithMapping, hubspotProperties } = props;
  const { property, mapping } = nativePropertyWithMapping;
  const { name, label, type, object } = property;

  let { hubspotName } = mapping || {};
  const { direction, id, hubspotLabel, modificationMetadata } = mapping || {};
  const maybeProperty: MaybeProperty = {
    name: hubspotName,
    label: hubspotLabel,
    type,
    object,
    modificationMetadata
  };
  const hubspotProperty = validateProperty(maybeProperty)

  const [value, setValue] = useState<Property | null>(
    hubspotProperty?.name ? hubspotProperty : null
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [syncDirection, setSyncDirection] = useState<Direction>(
    mapping?.direction || Direction.toHubSpot
  );

  const [latestMapping, setLatestMapping] = useState<Mapping | null>(mapping?mapping : null);
  async function deleteMapping(mappingId: number | undefined):Promise<void> {

    if (mappingId == undefined) {
      console.error("Mapping ID is undefined");
    }
    try {
    //TODO fix this as part of deleteMappings Fix
    const response = await fetch(`/api/mappings/${mappingId}`, {
      method: "DELETE",
      mode: "cors",
    });

      const parsedResponse = (await response.json()) as Mapping;
      console.log('Deleted mapping', parsedResponse)
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function saveMapping(): Promise<void | boolean> {
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
        modificationMetadata: value.modificationMetadata
      };

      try {
        const response = await fetch("/api/mappings", {
          method: "POST",
          body: JSON.stringify(updatedMapping),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as Mapping;
        console.log('Saved mapping', data)
        setLatestMapping(data)
      } catch (error) {
        console.error("Error while saving mapping:", error);
      }
    }
    saveMapping()
      .catch(err => console.error(err));

  }, [value, syncDirection]);

  const handleDirectionChange = (event: SelectChangeEvent): void => {
    if (!mapping && !value) {
      setSyncDirection(event.target.value as Direction);
      return;
    }

    const { value: eventValue } = event.target;
    if (value && value.modificationMetadata.readOnlyValue && eventValue !== Direction.toNative) {
      console.warn('Cannot map to a read only property');
      return;
    }
    setSyncDirection(eventValue as Direction);
  };

  const handleMappingChange = async (
    event: React.SyntheticEvent,
    value: Property | null
  ): Promise<void> => {
    if (value) {

      hubspotName ? (hubspotName = value.name) : null;

      setValue(value);
    } else {
      await deleteMapping(latestMapping?.id);
      setValue(value);
    }
  };
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
          getOptionDisabled={(option) => option.modificationMetadata.readOnlyValue && syncDirection !== Direction.toNative}
          onChange={ handleMappingChange}
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
          disabled={property.modificationMetadata.readOnlyValue && syncDirection !== Direction.toHubSpot}
        />
      </Grid>
    </Grid>
  );
}

export default MappingDisplay;
