import {
  Autocomplete,
  TextField,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

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
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function MappingDisplay(props: MappingDisplayProps): JSX.Element {
  const { nativeProperty, hubspotProperties, setMappings, objectType } = props;
  const name = nativeProperty.name || "name";
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
            setMappings((mappings: Mapping[]) => {
              return { ...mappings, [name]: value };
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label={`HubSpot ${objectType} Properties`} />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default MappingDisplay;
