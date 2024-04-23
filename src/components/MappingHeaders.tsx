import React from "react";
import { Grid, Typography } from "@mui/material";

export function MappingHeader() {
  return <Grid container item spacing={6} rowSpacing={12} columnSpacing={12}>
    <Grid item xs={4}>

      <Typography variant="h5" gutterBottom>Native Properties</Typography>

    </Grid>
    <Grid item xs={3}>
      <Typography variant="h5" gutterBottom> Sync Direction</Typography>
    </Grid>
    <Grid item xs={4}>
      <Typography variant="h5" gutterBottom> HubSpot Properties</Typography>
    </Grid>
  </Grid>;
}
