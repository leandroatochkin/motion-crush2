import PropTypes from 'prop-types';
import { 
  RotateExtraLeft, 
  RotateExtraRight, 
  RotateLeft, 
  RotateRight, 
  ZoomIn, 
  ZoomOut, 
  Trash, 
  Hoist, 
  Mirror,
  GridIcon,
  OffIcon 
} from "../../assets/icons";
import ExpandHeight from "../../assets/icons/ExpandHeight";
import ExpandWidth from "../../assets/icons/ExpandWidth";
import ReduceHeight from "../../assets/icons/ReduceHeight";
import ReduceWidth from "../../assets/icons/ReduceWidth";
import { 
  Box, 
  Button,
  Tooltip,
  Typography
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../../store/store'
import { logout } from '../../store/slices/User';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '../../utils/hooks/hooks';


const EditPanel = ({  handleRemoveAsset, selectedAsset, setSelectedAssets, handleActivateGrid  }) => {


    const theme = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isMobile = useMobile()

    const styles = {
       editPanelContainer: 
       { 
          display: "flex", 
          flexDirection: !isMobile ? "column" : 'row', 
          width: !isMobile ? 'auto' : '100vw', 
          height: !isMobile ? '100dvh' : '8vh', 
          background: theme.colors.background,
          gap: '10px',
          borderLeft: `1px solid ${theme.colors.border}`,
          borderRight:  `1px solid ${theme.colors.border}`,
          overflowX: !isMobile ? 'none' : 'scroll',
          overflowY: 'hidden',

          },
        assetPreview: 
        {
            p: 0.5,
            m: 1,
            background: selectedAsset.src ? theme.colors.backgroundSecondary : theme.colors.errorBg,
            borderRadius: 4,
            height: !isMobile ? 'auto' : '40px',
            width: !isMobile ? 'auto' : '40px'
        },
        logoutButtonContainer:
        {
          display: !isMobile ? 'flex' : 'inline-block',
          flexDirection: 'column',
          justifyContent: !isMobile ? 'end' : 'center',
          p: 1
        },
        logoutButton:
        {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: isMobile ? '100%' : '30px',
            mt: !isMobile ? 10 : 0
          }
    }

    const handleLogout = () => {
      dispatch(logout())
      navigate('/')
    }

    const handleRotateLeft = () => { 
      setSelectedAssets(prevAssets =>
        prevAssets.map((asset, index) =>
          index === selectedAsset.index 
            ? { ...asset, rotation: asset.rotation - 15 }
            : asset
        )
      )
  }


  const handleRotateRight = () => {
    setSelectedAssets(prevAssets =>
      prevAssets.map((asset, index) =>
        index === selectedAsset.index 
          ? { ...asset, rotation: asset.rotation + 15 }
          : asset
      )
    )
  }

  const handleRotateExtraLeft = () => {
    setSelectedAssets(prevAssets =>
        prevAssets.map((asset, index) =>
          index === selectedAsset.index 
            ? { ...asset, rotation: asset.rotation - 45 }
            : asset
        )
      )
  };
  const handleRotateExtraRight = () => {
    setSelectedAssets(prevAssets =>
      prevAssets.map((asset, index) =>
        index === selectedAsset.index 
          ? { ...asset, rotation: asset.rotation + 45 }
          : asset
      )
    )
  }
  const handleBringToFront = () => {
    setSelectedAssets(prevAssets =>
      prevAssets.map((asset, index) =>
        index === selectedAsset.index 
          ? { ...asset, zIndex: asset.zIndex + 1 }
          : asset
      )
    )
  };
  const handleEnlarge = () => {
    setSelectedAssets(prevAssets =>
      prevAssets.map((asset, index) =>
        index === selectedAsset.index 
          ? { ...asset, width: asset.width + 10, height: asset.height + 10 }
          : asset
      )
    )
  };
  const handleReduce = () => {
    setSelectedAssets(prevAssets =>
      prevAssets.map((asset, index) =>
        index === selectedAsset.index 
          ? { ...asset, width: asset.width - 10, height: asset.height - 10 }
          : asset
      )
    )
  };
  const handleMirror = () => {
    setSelectedAssets(prevAssets =>
      prevAssets.map((asset, index) =>
        index === selectedAsset.index 
          ? { ...asset, mirrorDeg: asset.mirrorDeg + 180 }
          : asset
      )
    )
  };
  const handleReduceWidth = () => {
    setSelectedAssets(prevAssets =>
      prevAssets.map((asset, index) =>
        index === selectedAsset.index 
          ? { ...asset, width: asset.width - 10 }
          : asset
      )
    )
  };
  const handleAugmentWidth = () => {
    setSelectedAssets(prevAssets =>
      prevAssets.map((asset, index) =>
        index === selectedAsset.index 
          ? { ...asset, width: asset.width + 10 }
          : asset
      )
    )
  };
  const handleReduceHeight = () => {
    setSelectedAssets(prevAssets =>
      prevAssets.map((asset, index) =>
        index === selectedAsset.index 
          ? { ...asset, height: asset.height - 10 }
          : asset
      )
    )
  };
  const handleAugmentHeight = () => {
    setSelectedAssets(prevAssets =>
      prevAssets.map((asset, index) =>
        index === selectedAsset.index 
          ? { ...asset, height: asset.height + 10 }
          : asset
      )
    )
  };

  const buttons = [
  { icon: <RotateLeft />,        onClick: handleRotateLeft,       title: 'rotar a la izquierda'},
  { icon: <RotateRight />,       onClick: handleRotateRight,      title: 'rotar a la derecha'},
  { icon: <RotateExtraLeft />,   onClick: handleRotateExtraLeft,  title: 'rotar extra a la izquierda'},
  { icon: <RotateExtraRight />,  onClick: handleRotateExtraRight, title: 'rotar extra a la izquierda'},
  { icon: <Hoist />,             onClick: handleBringToFront,     title: 'mover al frente'},
  { icon: <ZoomIn />,            onClick: handleEnlarge,          title: 'agrandar'},
  { icon: <ZoomOut />,           onClick: handleReduce,           title: 'achicar'},
  { icon: <Mirror />,            onClick: handleMirror,           title: 'espejar'},
  { icon: <ExpandHeight />,      onClick: handleAugmentHeight,    title: 'agrandar en eje Y'},
  { icon: <ReduceHeight />,      onClick: handleReduceHeight,     title: 'achicar en eje Y'},
  { icon: <ExpandWidth />,       onClick: handleAugmentWidth,     title: 'agrandar en eje X'},
  { icon: <ReduceWidth />,       onClick: handleReduceWidth,      title: 'achicar en eje X'},
  { 
    icon: <Trash />, 
    onClick: () => handleRemoveAsset(selectedAsset.index) 
  },
  { icon: <GridIcon />,       onClick: ()=>handleActivateGrid(),         title: 'activar grilla'},
];



  return (
    <Box 
      sx={styles.editPanelContainer}>
      {
        !isMobile &&
        <Box
        sx={styles.assetPreview}
      >
        <img 
          src={`${selectedAsset.src}` || '/none.png'} 
          style={{ 
            height: !isMobile ? "100px" : '30px', 
            width: !isMobile ? "100px" : '30px', 
            aspectRatio: 'auto' }} 
          alt="Selected Asset" 
          />
      </Box>
      }
      {buttons.map((btn, i) => (
          <Tooltip
          key={i}
          title={btn.title}
          placement='left'
          >
            <Button
            
            onClick={btn.onClick}
            onTouchStart={btn.onClick}
          
          >
            {btn.icon}
          </Button>
          </Tooltip>
        ))}
        {/* <Box
        sx={styles.logoutButtonContainer}
        >
          <Button
          color='error'
          onClick={handleLogout}
          variant='contained'
          sx={styles.logoutButton}
          >
           {
            !isMobile ? 'Salir' :  <OffIcon />
           }
          </Button>
         
        </Box> */}
    </Box>
  );
};

EditPanel.propTypes = {
  currentTextElement: PropTypes.object,
  setCurrentTextElement: PropTypes.func,
  handleRemoveAsset: PropTypes.func.isRequired,
  handleActivateGrid: PropTypes.func.isRequired,
  selectedAsset: PropTypes.object.isRequired,
  setSelectedAssets: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
};

export default EditPanel;
