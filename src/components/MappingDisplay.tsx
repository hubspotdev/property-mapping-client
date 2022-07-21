import {
  Autocomplete,
  TextField,
  Grid,
  Typography,
  Paper,
  AutocompleteRenderOptionState,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { HTMLAttributes } from "react";

interface Property {
  name?: string;
  label?: string;
  type?: string;
}
interface Mapping {
  name?: string;
  property: Property;
}

interface MappingDisplayProps {
  nativeProperty: Property;
  hubspotProperties: Property[];
  setMappings: Function;
  objectType: String;
  mappings: Mapping;
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

function MappingDisplay(props: MappingDisplayProps): JSX.Element {
  const {
    nativeProperty,
    hubspotProperties,
    setMappings,
    objectType,
    mappings,
  } = props;
  const name = nativeProperty.name || "name";
  console.log(mappings);
  // const getInputVlaue = (): Property => {
  //   if ((mappings.name = name)) {
  //     return mappings.property;
  //   }
  // };

  return (
    <Grid container item spacing={6} rowSpacing={12} columnSpacing={12}>
      <Grid item xs={4}>
        <Item>
          <Typography variant="body1">{nativeProperty.label}</Typography>
        </Item>
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          disablePortal
          className={`hubspot${objectType}Property`}
          options={hubspotProperties}
          onChange={(event, value, reason) => {
            console.log("value", value);
            setMappings((mappings: Mapping) => {
              console.log(mappings, "mappings");
              return { ...mappings, name: name, property: value };
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label={`HubSpot ${objectType} Properties`} />
          )}
          renderOption={OptionDisplay}
        />
      </Grid>
    </Grid>
  );
}

export default MappingDisplay;
