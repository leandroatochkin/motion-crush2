import React from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useMobile } from '../../utils/hooks/hooks';

interface SearchbarProps {
  assets: string[];
  onSearchChange: (value: string) => void;
  onSelectAsset: (src: string) => void;
  fullWidth: boolean
}

const Searchbar: React.FC<SearchbarProps> = ({ assets, onSearchChange, onSelectAsset, fullWidth }) => {

  const isMobile = useMobile()

  return (
    <Autocomplete
      fullWidth={fullWidth}
      disablePortal={false} // needed so popper can flip
      options={assets}
      slotProps={{
        popper: {
          placement: isMobile ? "top-start" : "bottom-start"
        }
      }}
      renderInput={(params) => <TextField {...params} label="Buscar..." />}
      onInputChange={(e, value) => onSearchChange(value)}
      onChange={(e, value) => {
        if (value) onSelectAsset(value);
      }}
    />
  )
}

export default Searchbar
