import { AutocompleteRenderOptionState } from "@mui/material";
import { HTMLAttributes } from "react";
import { Property } from "../utils";

export const OptionDisplay = (
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
