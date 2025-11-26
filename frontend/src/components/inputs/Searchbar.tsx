import React, { useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'

interface SearchbarProps {
  assets: string[];
  onSearchChange: (value: string) => void;
  onSelectAsset: (src: string) => void;
  fullWidth: boolean
}

const Searchbar: React.FC<SearchbarProps> = ({ assets, onSearchChange, onSelectAsset, fullWidth }) => {

  return (
    <Autocomplete
    fullWidth={fullWidth}
    disablePortal
    options={assets}
    sx={{ width: 300 }}
    renderInput={(params) => <TextField {...params} label="Buscar..." />}
    onInputChange={(e, value) => onSearchChange(value)}
    onChange={(e, value) => {
        if (value) onSelectAsset(value);
    }}
/>
  )
}

export default Searchbar
