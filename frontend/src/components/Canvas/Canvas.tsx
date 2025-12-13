import React, { useRef, useEffect } from "react";
import { toJpeg } from "html-to-image";
import { Download, ClearPanel, Eraser } from "../../assets/icons";
import style from "./Canvas.module.css";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../../store/store'
import { 
  Box, 
  Button, 
  Paper, 
  Tooltip, 
  Typography,
  Chip,
  Menu,
  MenuItem
 } from "@mui/material";
import { notify } from "../../lib/notifications/notify";
import { useCreateSketchMutation } from "../../api/sketchApi";
import { updateUsage } from "../../store/slices/User";
import { useMobile } from "../../utils/hooks/hooks";
import UpgradeArrow from "../../assets/icons/UpgradeArrow";
import { useNavigate } from "react-router-dom";
import { logout } from '../../store/slices/User';
import CancelSubscriptionModal from "../CancelSubscription/CancelSubscription";
import DeleteAccountModal from "../DeleteAccount/DeleteAccount";


const Canvas = ({ children, handleClearPanel, handleClearCanva, grid }) => {
  const [openDialogs, setOpenDialogs] = React.useState({
    plans: false,
    deleteAccount: false
  })

  const canvasRef = useRef(null);
  const watermarkRef = useRef(null);
  const dispatch = useDispatch()

  const theme = useSelector((state: RootState) => state.theme);
  const user = useSelector((state: RootState) => state.user);
  const remaining = useSelector((state: RootState) => state.user?.usage?.remaining) || 0;
  const [createSketch] = useCreateSketchMutation()

  const isMobile = useMobile()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
        dispatch(logout())
        navigate('/')
      }

  const handleClose = () => {
       setAnchorEl(null);
  }

  const handleMenu = (menu: string) => {
    setAnchorEl(null);
    switch(menu){
      case 'cancel':
        setOpenDialogs(prev => ({ ...prev, plans: true }));
        break;
      case 'plans':
        navigate('/plans');
        break;
      case 'account':
        setOpenDialogs(prev => ({ ...prev, deleteAccount: true }));
        break;
      case 'logout':
        handleLogout()
        break;
    }
  };


  
  
  const handleUpgradePlan = () => navigate('/plans')

const handleMakeSketch = async () => {
  const res = await createSketch({ userId: user.id }).unwrap();

  dispatch(updateUsage({
    used: res.used,
    limit: res.limit,
    remaining: res.remaining
  }));
};
   
  const bgSec = theme.colors.backgroundSecondary

  const handleScreenshot = () => {
    const downloadTitle = prompt('Introduzca el nombre de la imagen')
    if (canvasRef.current) {
      // Temporarily show the watermark for screenshot
      if (watermarkRef.current) {
        watermarkRef.current.style.display = "block";
      }

      toJpeg(canvasRef.current, { quality: 0.95, backgroundColor: "#ffffff" })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${downloadTitle}.jpg`;
          link.click();
          handleMakeSketch()
        })
        .catch((e)=>{
          console.error(e)
          notify("Error al capturar imagen", "error")
        })
        .finally(() => {
          // Hide the watermark after screenshot
          
          if(!isMobile){
            notify("Imagen capturada", "success")
          }
          else {
            notify(`Imagen capturada, te quedan ${remaining} gratis!`, `${remaining < 4 ? 'error' : 'success'}`)
          }
          if (watermarkRef.current) {
            watermarkRef.current.style.display = "none";
          }
        });
    }
  };

  const topButtons = [
  {
    icon: <Download />,
    title: 'capturar',
    onClick: handleScreenshot,
    style: { color: "black", background: "transparent" }
  },
  // {
  //   icon: <ClearPanel />,
  //   title: 'Capturar',
  //   onClick: handleClearPanel,
  //   style: { color: "black", background: "transparent" }
  // },
  {
    icon: <Eraser />,
    title: 'borrar todo',
    onClick: handleClearCanva,
    style: { color: "black", background: "transparent" }
  }
];

  const gridStyle = `linear-gradient(0deg, transparent 24%, ${bgSec} 25%, ${bgSec} 26%, transparent 27%,transparent 74%, ${bgSec} 75%, ${bgSec} 76%, transparent 77%,transparent),
        linear-gradient(90deg, transparent 24%, ${bgSec} 25%, ${bgSec} 26%, transparent 27%,transparent 74%, ${bgSec} 75%, ${bgSec} 76%, transparent 77%,transparent)
        `

  const OptionsMenu = () => {
    return (
      <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        menu
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={()=>handleMenu('cancel')}>Cancelar plan</MenuItem>
        <MenuItem onClick={()=>handleMenu('plan')}>Mejorar lan</MenuItem>
        <MenuItem onClick={()=>handleMenu('account')}>Eliminar cuenta</MenuItem>
        <MenuItem onClick={()=>handleMenu('logout')}>Salir</MenuItem>
      </Menu>
      </>
    )
  }      

  return (
    <>
    {openDialogs.plans && <CancelSubscriptionModal open={openDialogs.plans} onClose={()=>setOpenDialogs(prev => ({ ...prev, plans: false }))} />}
    {openDialogs.deleteAccount && <DeleteAccountModal open={openDialogs.deleteAccount} onClose={()=>setOpenDialogs(prev => ({ ...prev, deleteAccount: false }))} />}
    <Box 
      sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'column',
      }}   
    >
      <Paper
        sx={{
          display: "flex",
          gap: "10px",
          background: theme.colors.background,
          width: '100%',
          borderRadius: 0,
          height: '6%',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: isMobile ? 2 : 'auto'
        }}
        
      >
          <Box>
            <OptionsMenu />
            {topButtons.map((btn, i) => (
            <Tooltip
              key={i}
              title={btn.title}
            >
              <Button    
                onClick={btn.onClick}
                onTouchStart={btn.onClick}
                style={btn.style}
              >
              {btn.icon}
            </Button>
            </Tooltip>
          ))}
          </Box>

          {
            (!isMobile || user.plan !== 'pro') ? 
            <Chip
          color={remaining < 4 ? 'error' : 'success'}
          label={`Te quedan ${remaining} esquemas en la capa gratuita`}
          />
          :
          null
          }
              
          <Box
          sx={{
            height: '100%',
            width: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          >
            {
              user.plan === 'free' || user.plan === 'premium' &&
              <Tooltip
              title='mejorar plan'
              >
                <Button
                onClick={handleUpgradePlan}
                >
                  <UpgradeArrow />
                </Button>
              </Tooltip>
            }
            
            <img src="/logo.png" alt="motion-crush logo" 
            style={{
                height: '80px'
            }}/>
          </Box>
      </Paper>
      <Paper 
          ref={canvasRef}
          className="canvas-area" 
          sx={{
          background: grid ? gridStyle : '',
          backgroundSize: grid ? '40px 40px' : '',
          height: '90%',
          width: '95%',
          mb: 2,
          position: 'relative'
        }}>
          {/* {children} */}
         {React.Children.map(children, child =>
            React.cloneElement(child, { 
              boundsRef: canvasRef
            })
          )}
        {/* Watermark */}
        <div
          ref={watermarkRef}
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "red",
            pointerEvents: "none",
            display: "none",
            zIndex: '999999' // Hidden during normal rendering
          }}
        >
          {`Motion-Crush 2.0`}
        </div>
      </Paper>
    </Box>
    </>
  );
};

export default Canvas;

