import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import { Direction } from '../utils';

export function DirectionSelection(label: string, handleDirectionChange: (event: SelectChangeEvent) => void, syncDirection: Direction): JSX.Element {
  return <FormControl sx={{ width: 100 }}>
    <InputLabel id={`sync-direction-${label}`}>
      {' '}
      Sync Direction
    </InputLabel>
    <Select
      labelId={`sync-direction-${label}`}
      onChange={handleDirectionChange}
      value={syncDirection}
    >
      <MenuItem value={'toHubSpot'}>
        <EastIcon />
      </MenuItem>
      <MenuItem value={'toNative'}>
        <WestIcon />
      </MenuItem>
      <MenuItem value={'biDirectional'}>
        <MultipleStopIcon />
      </MenuItem>
    </Select>
  </FormControl>;
}
