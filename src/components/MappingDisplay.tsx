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

function MappingDisplay(props: MappingDisplayProps): JSX.Element {
  const { nativePropertyWithMapping, hubspotProperties } = props;
  const { property, mapping } = nativePropertyWithMapping;
  const { name, label, type, object, archivable, readOnlyDefinition, readOnlyValue } = property;
  let { hubspotName } = mapping || {};
  const { direction, id, hubspotLabel } = mapping || {};
  const hubspotProperty: Property = {
    name: hubspotName,
    label: hubspotLabel,
    type,
    object,
    archivable,
    readOnlyDefinition,
    readOnlyValue
  };

  const [value, setValue] = useState<Property | null>(
    hubspotProperty.name ? hubspotProperty : null
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [syncDirection, setSyncDirection] = useState<Direction>(
    direction || Direction.toHubSpot
  );

  function usePrevious(value: Mapping | null): Mapping | null | undefined {
    const ref = useRef<Mapping | null>();
    useEffect(() => {
      ref.current = value;
    }),
    [value];
    return ref.current;
  }

  const previousMapping = usePrevious(mapping);
  async function deleteMapping(mappingId: number | undefined):Promise<void> {
    if (mappingId == undefined) {
      console.error("Mapping ID is undefined");
    }
    //TODO fix this as part of deleteMappings Fix
    const response = await fetch(`/api/mappings/${mappingId}`, {
      method: "DELETE",
      mode: "cors",
    });
    try {
      const parsedResponse = (await response.json()) as Mapping;
      console.log("parsed response+=",parsedResponse);
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function saveMapping(): Promise<void | boolean> {
      console.log("hubspot property in effect", value);

      if (!value?.name) {
        return false;
      }

      const updatedMapping = {
        id: id,
        nativeName: name,
        hubspotName: value?.name,
        hubspotLabel: value?.label,
        object: object,
        direction: syncDirection,
      };

      console.log("updatedMapping", updatedMapping);

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
        console.log("data in saveMapping+=",data);
      } catch (error) {
        console.error("Error while saving mapping:", error);
      }
    }
    saveMapping()
      .catch(err => console.error(err));

  }, [value, syncDirection]);

  const handleDirectionChange = (event: SelectChangeEvent):void => {
    console.log(event.target.value);
    setSyncDirection(event.target.value as Direction);
  };

  const handleMappingChange = async (
    event: React.SyntheticEvent,
    value: Property | null
  ): Promise<void> => {
    if (value) {
      console.log("value was truthy");
      hubspotName ? (hubspotName = value.name) : null;
      setValue(value);
    } else {
      const previousValue = previousMapping;
      console.log(previousValue, "previousValue");
      await deleteMapping(previousMapping?.id);
      setValue(value);
    }
  };
  // console.log(hubspotProperty, "hubspotProperty ==");
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
          disabled={readOnlyValue} // Probably a better way to do this but naming convention works since the customer can't change that
        />
      </Grid>
    </Grid>
  );
}

export default MappingDisplay;
