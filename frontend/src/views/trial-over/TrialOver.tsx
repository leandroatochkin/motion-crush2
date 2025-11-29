import React, { useDebugValue } from 'react'
import Dashboard from '../../components/Dashboard/Dashboard'
import { logout } from '../../store/slices/User'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { 
    Paper,
    Typography,
    Button
} from '@mui/material'

const TrialOver = () => {
const dispatch = useDispatch()
const navigate = useNavigate()

const handleLogout = () => {
    dispatch(logout())
    navigate('/')
}

  return (
    <Dashboard>
        <Paper
        sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 10
        }}
        >
            <Typography
            sx={{
                fontWeight: 'bold'
            }}
            >
                {`Te quedaste sin esquemas gratis :(. Para más información, escribime a ${import.meta.env.VITE_REACH_EMAIL}`}
            </Typography>
            <Button
            color='error'
            onClick={handleLogout}
            variant='contained'
            >
                Salir
            </Button>
        </Paper>
    </Dashboard>
  )
}

export default TrialOver