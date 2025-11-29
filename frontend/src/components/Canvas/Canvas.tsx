import React, { useRef, useEffect } from "react";
import { toJpeg } from "html-to-image";
import { Download, ClearPanel, Eraser } from "../../assets/icons";
import style from "./Canvas.module.css";
import { useSelector } from "react-redux";
import type { RootState } from '../../store/store'
import { 
  Box, 
  Button, 
  Paper, 
  Tooltip, 
  Typography,
  Chip,
 } from "@mui/material";
import { notify } from "../../lib/notifications/notify";
import { useCreateSketchMutation } from "../../api/sketchApi";
import { useDispatch } from "react-redux";
import { updateUsage } from "../../store/slices/User";


const Canvas = ({ children, handleClearPanel, handleClearCanva, grid }) => {
  const canvasRef = useRef(null);
  const watermarkRef = useRef(null);
  const dispatch = useDispatch()

  const theme = useSelector((state: RootState) => state.theme);
  const user = useSelector((state: RootState) => state.user);
  const remaining = useSelector((state: RootState) => state.user?.usage?.remaining) || 0;


  const [createSketch] = useCreateSketchMutation()



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
          
          notify("Imagen capturada", "success")
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

  return (
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
          alignItems: 'center'
        }}
        
      >
          <Box>
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

          <Chip
          color={remaining < 4 ? 'error' : 'success'}
          label={`Te quedan ${remaining} esquemas en la capa gratuita`}
          />
              
          <Box
          sx={{
            height: '100%',
            width: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          >
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
  );
};

export default Canvas;

