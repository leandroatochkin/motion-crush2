import React, { useEffect, useState, useRef } from "react";
import Canvas from "../../components/Canvas/Canvas";
import Asset from "../../components/Asset/Asset";
import TextAsset from "../../components/Asset/TextAsset";
import {
  animals_3d,
  animals_aerial,
  bikes_aerial,
  busses_aerial,
  cars_aerial,
  events_aerial,
  signals_aerial,
  streets_aerial,
  trucks_aerial,
  arrows_aerial,
  people_aerial
} from '../../utils/data';
import Searchbar from "../../components/inputs/Searchbar";
import { TopView, Isometric, Help } from "../../assets/icons";
import HelpModal from "../../components/HelpModal/HelpModal";
import EditPanel from "../../components/EditPanel/EditPanel";
import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from '../../store/store'
import ImageEditorModal from "../../components/ImgEditor/ImgEditor";
import { useMobile } from "../../utils/hooks/hooks";
import { supabase } from "../../auth/supabase";




// Categories
const categories_3d = {
  animals: { name: "Animales", data: animals_3d },
};

const categories_aerial = {
  animals: { name: "Animales", data: animals_aerial },
  bikes: { name: "Bicicletas & Motos", data: bikes_aerial },
  arrows: { name: "Flechas", data: arrows_aerial },
  busses: { name: "Colectivos", data: busses_aerial },
  cars: { name: "Autos", data: cars_aerial },
  events: { name: "Eventos", data: events_aerial },
  people: { name: "Personas", data: people_aerial },
  signals: { name: "Señalización", data: signals_aerial },
  streets: { name: "Calles & Rutas", data: streets_aerial },
  trucks: { name: "Camiones", data: trucks_aerial },
};



const Main = () => {
  const [assets, setAssets] = useState([]);
  const [customAssets, setCustomAssets] = useState<string[]>([]);
  const [textAssets, setTextAssets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("animals");
  const [currentView, setCurrentView] = useState<Record<string, { name: string; data: any }>>(categories_aerial);
  const [selectedSearchAsset, setSelectedSearchAsset] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('')

  const [currentElement, setCurrentElement] = useState({
    index: null,
    src: ""
  });

  const [clearAssetPanel, setClearAssetPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openEditor, setOpenEditor] = useState<boolean>(false)
  const [visibleGrid, setVisibleGrid] = useState(false);

   

  const theme = useSelector((state: RootState) => state.theme);
  const user = useSelector((state: RootState) => state.user);

  

  const isMobile = useMobile()

React.useEffect(() => {
  supabase.auth.getSession().then((res) => {
    console.log("DRAW PAGE SESSION:", res);
  });

  supabase.auth.onAuthStateChange((event, session) => {
    console.log("DRAW AUTH CHANGE:", event, session);
  });
}, []);

console.log("URL RIGHT NOW:", window.location.href);
console.log("HASH:", window.location.hash);

  const styles = {
    appContainer:
          {
            display: 'flex',
            flexDirection: !isMobile ? 'row' : 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100dvh',
            overflow: 'hidden',
            backgroundColor: 'whitesmoke',
          },
    canvas:
          {
            width: !isMobile ? '70%' : '99%',
            height: !isMobile ? '100vh' : '70vh'
          },
    sidebar: 
          {
              display: 'flex',
              flexDirection: 'column',
              height: !isMobile ? '100vh' : '40vh',
              overflowY: 'scroll',
              scrollbarWidth: 'none',
              width: !isMobile ? '25%' : '100vw',
              alignItems: 'center'
          },
    sidebarTop:
          {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
          },
    select:
          {
                m: 1,
                borderRadius: 4,
                background: theme.colors.backgroundSecondary
          },
    button:
          {
            width: '20%'
          },
    assetSelection: {
          display: !isMobile ? 'grid' : 'flex',
          flexDirection: 'row',
          overflowX: isMobile ? 'auto' : 'hidden',
          overflowY: isMobile ? 'hidden' : 'auto',

          // Desktop grid only
          gridTemplateColumns: !isMobile ? 'repeat(2, 1fr)' : 'none',
          gridGap: !isMobile ? '10px' : '0',
          gridAutoRows: !isMobile ? 'min-content' : 'none',

          gap: isMobile ? '10px' : undefined, // spacing between flex items

          height: !isMobile ? '90%' : 'auto',
          width: '90%',
          paddingBottom: isMobile ? '10px' : '0',

          whiteSpace: isMobile ? 'nowrap' : 'normal',   // keeps items inline
          scrollbarWidth: 'none',
          mt: 2
},
    selectedSearchAsset:
           {
                  backgroundSize: 'cover',
                  height: !isMobile ? '150px' : '50px',
                  cursor: 'pointer',
                  backgroundImage: `url(${selectedSearchAsset})`,
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderRadius: 4,
                  mb: 2,
                  transition: 'scale 0.2s ease-in',
                  '&:hover': { scale: 1.05 }
                }
  }
  
          

  // ---------------------------------------------
  // HANDLERS
  // ---------------------------------------------

  const userImagesCategory = {
  userImages: { name: "Imágenes de usuario", data: customAssets }
};

const fullCategories = {
  ...currentView,
  ...(customAssets.length > 0 ? userImagesCategory : {})
};

const allAssets = Object.values(fullCategories)
  .flatMap(category => category.data)

  const handleRemoveAsset = (index: number) => {
    setAssets(prev => prev.filter((_, i) => i !== index));
  };

   const handleAddAsset = (img: string) => {
    setCustomAssets(prev => [...prev, img]);
  };

  const handleRemoveTextAsset = (index: number) => {
    setTextAssets(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearPanel = () => {
    setClearAssetPanel(true);
    setTimeout(() => setClearAssetPanel(false), 50);
  };

  const handleClearCanva = () => {
    if (confirm("¿Está seguro que quiere borrar todo?")) {
      setAssets([]);
      setTextAssets([]);
    }
  };

  const handleCategoryChange = (e: any) => {
  const selected = e.target.value;
  if (fullCategories[selected]) {
    setSelectedCategory(selected);
  }
};

  const handleActivateGrid = () => {
    setVisibleGrid(prev => !prev);
  };

  const addNewAsset = (src: string) => {
    setAssets(prev => [
      ...prev,
      {
        src,
        rotation: 0,
        width: 300,
        height: 200,
        mirrorDeg: 0,
        zIndex: 1,
      }
    ]);
  };

  const canvasRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------


  return (
    <>
      {openModal && <HelpModal onClose={() => setOpenModal(false)} open={openModal}/>}
      {openEditor && <ImageEditorModal open={openEditor} onClose={()=>setOpenEditor(false)} onSave={(img) => {
          handleAddAsset(img);
          setOpenEditor(false);
        }}/>}
      <Box 
          sx={styles.appContainer}
          >
        {/* Canvas */}
        <Box 
        sx={styles.canvas}
        >
          <Canvas
            handleClearPanel={handleClearPanel}
            handleClearCanva={handleClearCanva}
            grid={visibleGrid}
          >
            {assets.map((asset, index) => (
              <Asset
                key={index}
                id={index}
                src={asset.src}
                rotation={asset.rotation}
                height={asset.height}
                width={asset.width}
                mirrorDeg={asset.mirrorDeg}
                zIndex={asset.zIndex}
                clear={clearAssetPanel}
                handleRemoveAsset={() => handleRemoveAsset(index)}
                onSelect={() =>
                  setCurrentElement({ index, src: asset.src })
                }
                style={{}}
                boundsRef={canvasRef}
              />
            ))}

            {textAssets.map((_, index) => (
              <TextAsset
                key={index}
                clear={clearAssetPanel}
                handleRemoveAsset={() => handleRemoveTextAsset(index)}
              />
            ))}
          </Canvas>
        </Box>

        {/* Editor panel */}
        <EditPanel
          setSelectedAssets={setAssets}
          selectedAsset={currentElement}
          handleRemoveAsset={handleRemoveAsset}
          handleActivateGrid={handleActivateGrid}
        />

        {/* Sidebar */}
        <Box 
        sx={styles.sidebar}
        >
          <Box 
          sx={styles.sidebarTop}
          >
            <FormControl fullWidth>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                sx={styles.select}
              >
                {Object.entries(fullCategories).map(([key, { name }]) => (
                  <MenuItem key={key} value={key}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box 
            sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  marginTop: '2%'
            }}>
              <Button onClick={() => setCurrentView(categories_aerial)} 
              sx={styles.button}>
                <TopView />
              </Button>
              <Button onClick={() => setCurrentView(categories_3d)} 
                  sx={styles.button}>
                
                <Isometric />
              </Button>
              <Button onClick={() => setOpenModal(true)}   sx={styles.button}>
                <Help />
              </Button>

              <Button
                onClick={() => setTextAssets(prev => [...prev, {}])}
                  sx={styles.button}>
                ➕ Texto
              </Button>
              <Button
                onClick={() => setOpenEditor(true)}
                  sx={styles.button}>
                ➕ Imagen
              </Button>
            </Box>
          </Box>

          {/* Assets list */}
          <Searchbar
            assets={allAssets}
            onSearchChange={setSearch}
            onSelectAsset={(src) => setSelectedSearchAsset(src)}
            fullWidth={true}
          />
          <Box
            sx={styles.assetSelection}
            >
            {selectedSearchAsset && (
              <>
              <Box
                onClick={() => addNewAsset(selectedSearchAsset)}
                sx={styles.selectedSearchAsset}
              />
              <Button
              onClick={()=>setSelectedSearchAsset(null)}
              >
                borrar
              </Button>
              </>
            )}  
            {!selectedSearchAsset && fullCategories[selectedCategory]?.data?.map((src: string, index: number) => (
              <Box
                key={index}
                onClick={() => addNewAsset(src)}
                sx={{
                  backgroundSize: 'cover',
                  width: !isMobile ? 'auto' : '50px',
                  height: !isMobile ? '150px' : '50px',
                  cursor: 'pointer',
                  backgroundImage: `url(${src})`,
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderRadius: 4,
                  transition: 'scale 0.2s ease-in',
                  '&:hover': {
                    scale: 1.05
                  },
                }}
              ></Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Main;
