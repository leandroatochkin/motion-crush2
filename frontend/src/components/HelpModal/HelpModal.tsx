import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
  TopView,
  Isometric,
  Eraser,
  ClearPanel,
  Download,
  Hoist,
  Mirror,
  RotateExtraLeft,
  RotateExtraRight,
  RotateLeft,
  RotateRight,
  ZoomIn,
  ZoomOut,
  Trash,
} from "../../assets/icons";

import ExpandHeight from "../../assets/icons/ExpandHeight";
import ReduceHeight from "../../assets/icons/ReduceHeight";
import ExpandWidth from "../../assets/icons/ExpandWidth";
import ReduceWidth from "../../assets/icons/ReduceWidth";

const HelpModal = ({ open, onClose }) => {
  // ✔ Dynamic instructions
  const instructions = [
    "Elige una categoría del selector.",
    <>
      Elige la vista que deseas ver, 3D (<TopView />) o aérea (<Isometric />).
    </>,
    "Haz click en un elemento para que aparezca en la imagen final.",
    "Para mover los elementos, arrástralos. Para abrir el panel de acciones, posiciona el cursor encima.",
    <>
      Puede borrar todos los elementos con <Eraser />.
    </>,
    <>
      Puede cerrar todos los paneles con <ClearPanel />.
    </>,
    <>
      Para guardar la imagen usa el botón <Download />. Solo se guardan elementos dentro del recuadro blanco.
    </>,
  ];

  // ✔ Dynamic modification tools
  const tools = [
    { icon: <Hoist />, label: "Sube los elementos en el eje Z." },
    { icon: <Mirror />, label: "Refleja los elementos en el eje X." },
    { icon: <RotateExtraLeft />, label: "Rotar 45° a la izquierda." },
    { icon: <RotateExtraRight />, label: "Rotar 45° a la derecha." },
    { icon: <RotateLeft />, label: "Rotar 15° a la izquierda." },
    { icon: <RotateRight />, label: "Rotar 15° a la derecha." },
    { icon: <ZoomIn />, label: "Aumentar tamaño." },
    { icon: <ZoomOut />, label: "Reducir tamaño." },
    { icon: <ExpandHeight />, label: "Aumentar alto." },
    { icon: <ReduceHeight />, label: "Reducir alto." },
    { icon: <ExpandWidth />, label: "Aumentar ancho." },
    { icon: <ReduceWidth />, label: "Reducir ancho." },
    { icon: <Trash />, label: "Eliminar el elemento seleccionado." },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Instrucciones
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* -------- Instructions -------- */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Para usar la aplicación:
        </Typography>

        <Box component="ul" sx={{ pl: 3 }}>
          {instructions.map((item, idx) => (
            <Typography component="li" key={idx} sx={{ mb: 1 }}>
              {item}
            </Typography>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* -------- Tools -------- */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Opciones de modificación:
        </Typography>

        <Box component="ul" sx={{ pl: 3 }}>
          {tools.map((t, idx) => (
            <Typography
              key={idx}
              component="li"
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
            >
              <span>{t.icon}</span> {t.label}
            </Typography>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
          Aunque funciona en móviles, lo ideal es usar una computadora.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
