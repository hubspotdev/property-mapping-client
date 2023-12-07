import React, { Children, useState } from "react";

import {
  Grid,
  Box,
  SimplePaletteColorOptions,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

function TabContainer(props: {
  objects: String[];

  children: React.ReactNode[];
}) {
  const { objects, children } = props;
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label="property mapping tabs"
        >
          {objects.map((object, index) => {
            return <Tab key={index} label={object} {...a11yProps(index)} />;
          })}
        </Tabs>
      </Box>
      <>
        {children.map((child: React.ReactNode, index: number) => {
          return (
            <TabPanel key={index} value={activeTab} index={index}>
              {child}
            </TabPanel>
          );
        })}
      </>
    </Box>
  );
}
export default TabContainer;
