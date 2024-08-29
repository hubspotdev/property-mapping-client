import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
} from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps): JSX.Element {
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
  objects: string[];
  children: React.ReactNode[];
}):JSX.Element {
  const { objects, children } = props;
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
  };

  interface A11yProps {
    id: string;
    'aria-controls': string;
  }

  function a11yProps(index: number):A11yProps {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
