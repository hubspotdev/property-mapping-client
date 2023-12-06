import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          "&.MuiAutocomplete-option": {
            justifyContent: "space-between",
          },
        },
      },
    },
  },
});
