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

import style from './Main.module.css';

import { TopView, Isometric, Help } from "../../assets/icons";
import HelpModal from "../../components/HelpModal/HelpModal";
import EditPanel from "../../components/EditPanel/EditPanel";
import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from '../../store/store'
import ImageEditorModal from "../../components/ImgEditor/ImgEditor";


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

  const [currentElement, setCurrentElement] = useState({
    index: null,
    src: ""
  });

  const [clearAssetPanel, setClearAssetPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openEditor, setOpenEditor] = useState<boolean>(false)
  const [visibleGrid, setVisibleGrid] = useState(false);

  const loggedIn = true;
  const theme = useSelector((state: RootState) => state.theme);

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

  if (!loggedIn) {
    return (
      <div className={style.appContainer}>
        <h1 style={{ color: "black" }}>Por favor loguearse</h1>
      </div>
    );
  }

  return (
    <>
      {openModal && <HelpModal onClose={() => setOpenModal(false)} open={openModal}/>}
      {openEditor && <ImageEditorModal open={openEditor} onClose={()=>setOpenEditor(false)} onSave={(img) => {
          handleAddAsset(img);
          setOpenEditor(false);
        }}/>}
      <div className={style.appContainer}>
        {/* Canvas */}
        <div className={style.canvasContainer}>
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
        </div>

        {/* Editor panel */}
        <EditPanel
          setSelectedAssets={setAssets}
          selectedAsset={currentElement}
          handleRemoveAsset={handleRemoveAsset}
          handleActivateGrid={handleActivateGrid}
        />

        {/* Sidebar */}
        <div className={style.sidebar}>
          <div className={style.selectContainer}>
            <FormControl fullWidth>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                sx={{
                  m: 1,
                  borderRadius: 4,
                  background: theme.colors.backgroundSecondary
                }}
              >
                {Object.entries(fullCategories).map(([key, { name }]) => (
                  <MenuItem key={key} value={key}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className={style.btnContainer}>
              <Button onClick={() => setCurrentView(categories_aerial)} className={style.btn}>
                <TopView />
              </Button>
              <Button onClick={() => setCurrentView(categories_3d)} className={style.btn}>
                <Isometric />
              </Button>
              <Button onClick={() => setOpenModal(true)} className={style.btn}>
                <Help />
              </Button>

              <Button
                onClick={() => setTextAssets(prev => [...prev, {}])}
                className={style.btn}
              >
                ➕ Texto
              </Button>
              <Button
                onClick={() => setOpenEditor(true)}
                className={style.btn}
              >
                ➕ Texto
              </Button>
            </div>
          </div>

          {/* Assets list */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridGap: '10px',
              gridAutoRows: 'min-content',
              height:' 90%',
              width: '90%',
              borderRadius: '8px',
              mt: '5%',
              mb: '5%',
              overflowY: 'auto',
              scrollbarWidth: 'none',
            }}
            >
            {fullCategories[selectedCategory]?.data?.map((src: string, index: number) => (
              <Box
                key={index}
                onClick={() => addNewAsset(src)}
                sx={{
                  backgroundSize: 'cover',
                  width: 'auto',
                  height: '150px',
                  cursor: 'pointer',
                  backgroundImage: `url(${src})`,
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderRadius: 4,
                  transition: 'scale 0.2s ease-in',
                  '&:hover': {
                    scale: 1.05
                  }
                }}
              ></Box>
            ))}
          </Box>
        </div>
      </div>
    </>
  );
};

export default Main;
