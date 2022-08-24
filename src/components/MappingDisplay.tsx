import {
  Autocomplete,
  TextField,
  Grid,
  Typography,
  Paper,
  AutocompleteRenderOptionState,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { HTMLAttributes, useState, useEffect } from "react";
import { Property, Mapping } from "../utils";

interface MappingDisplayProps {
  nativeProperty: Property;
  hubspotProperties: Property[];
  setMappings: Function;
  objectType: String;
  mappings: Mapping[];
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const OptionDisplay = (
  props: HTMLAttributes<HTMLLIElement>,
  option: Property,
  state: AutocompleteRenderOptionState
): JSX.Element => {
  return (
    <li {...props} key={option.name}>
      {" "}
      {option.label}
      <span className="option-name">
        {" "}
        {"    "} {option.name}
      </span>{" "}
    </li>
  );
};

const defaultProperty = {
  name: "",
  label: "",
  type: "",
};

function MappingDisplay(props: MappingDisplayProps): JSX.Element {
  const {
    nativeProperty,
    hubspotProperties,
    setMappings,
    objectType,
    mappings,
  } = props;
  const nativePropertyName = nativeProperty.name || "name";

  const [value, setValue] = useState<Property | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const calculateNewMappings = (
    mappings: Mapping[],
    value: Property | null
  ): Mapping[] => {
    const index = mappings.findIndex((mapping) => {
      return mapping.name == nativePropertyName;
    });
    console.log(index);
    if (index === -1 && value != null) {
      return [...mappings, { name: nativePropertyName, property: value }];
    } else if (value == null) {
      const newMappings = [...mappings];
      newMappings.splice(index);
      return newMappings;
    } else {
      const newMappings = [...mappings];
      newMappings[index] = { name: nativePropertyName, property: value };
      return newMappings;
    }
  };

  const handleChange = (
    event: React.SyntheticEvent,
    value: Property | null
  ) => {
    const newMappings = calculateNewMappings(mappings, value);
    setMappings(newMappings);

    if (value != null) {
      setValue(value);
      setInputValue(value.name);
    }
  };

  useEffect(() => {
    const matchingMapping = mappings.find((mapping) => {
      return mapping.name == nativePropertyName;
    });
    if (matchingMapping != undefined) {
      setValue(matchingMapping.property);
      setInputValue(matchingMapping.name);
    }
  }, []);

  if (hubspotProperties.length == 0) {
    return <CircularProgress />;
  }
  return (
    <Grid container item spacing={6} rowSpacing={12} columnSpacing={12}>
      <Grid item xs={4}>
        <Item>
          <Typography variant="body1">{nativeProperty.label}</Typography>
        </Item>
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          className={`hubspot${objectType}Property`}
          options={hubspotProperties}
          onChange={handleChange}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label={`HubSpot ${objectType} Properties`}
              />
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
        />
      </Grid>
    </Grid>
  );
}

export default MappingDisplay;
