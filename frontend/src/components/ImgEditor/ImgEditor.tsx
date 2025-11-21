import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Slider,
  Stack,
  CircularProgress,
  Box,
  Divider
} from "@mui/material";
import Trash from "../../assets/icons/Trash";
import { removeBackground } from "@imgly/background-removal";
import { notify } from "../../lib/notifications/notify";
import { ClockLoader } from 'react-spinners'
import { useAsync } from "../../utils/hooks/hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (img: string) => void;
}

const ImageEditorModal: React.FC<Props> = ({ open, onClose, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [widthPercent, setWidthPercent] = useState<number>(100);
  const [heightPercent, setHeightPercent] = useState<number>(100);


  const MAX_FILE_SIZE_KB = import.meta.env.VITE_MAX_IMAGE_UPLOADSIZE_KB;

  const resetState = () => {
    setImgSrc(null);
    setWidthPercent(100);
    setHeightPercent(100);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const fileSizeKB = file.size / 1024;

  if (fileSizeKB > MAX_FILE_SIZE_KB) {
    notify(`La imagen supera el máximo permitido (${MAX_FILE_SIZE_KB}KB)`, "error");
    return;
  }

  const url = URL.createObjectURL(file);
  setImgSrc(url);
};

  const { run, loading, error, result } = useAsync(removeBackground);

  const handleRemoveBackground = async () => {
  const { data, error } = await run(imgSrc);

  if (error) {
    notify("Error al quitar fondo", "error");
    return;
  }

  const url = URL.createObjectURL(data!);
  setImgSrc(url);
  notify("Fondo quitado con éxito", "success");
};

  const handleSave = () => {
    if (!imgSrc) return;

    const img = new Image();
    img.src = imgSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = img.width * (widthPercent / 100);
      canvas.height = img.height * (heightPercent / 100);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const base64 = canvas.toDataURL("image/png");
      onSave(base64);
    };
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Añadir PNG</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          {/* File input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png"
            hidden
            onChange={handleFileChange}
          />

          <Button 
            variant="outlined" 
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            Subir imagen PNG
          </Button>

   
          {imgSrc && (
            <Box sx={{ position: "relative", width: "100%" }}>
             
                <img
                    src={imgSrc}
                    alt="preview"
                    style={{
                    maxWidth: "100%",
                    display: "block",
                    transform: `scale(${widthPercent / 100}, ${heightPercent / 100})`,
                    transformOrigin: "top left"
                    }}
                />

         
                {loading && (
                    <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backdropFilter: "blur(4px)",
                        background: "rgba(0,0,0,0.4)",
                        borderRadius: "4px",
                        zIndex: 10
                    }}
                    >
                    <ClockLoader color="#fff" />
                    </Box>
                )}
                </Box>

          )}

     
          {imgSrc && (
            <Button
              variant="outlined"
              color="error"
              onClick={resetState}
              startIcon={<Trash />}
              disabled={loading}
            >
              Borrar imagen
            </Button>
          )}

  
          {imgSrc && (
            <>
              <p>Ancho</p>
              <Slider
                value={widthPercent}
                onChange={(_, v) => setWidthPercent(v as number)}
                min={10}
                max={200}
                disabled={loading}
              />

              <p>Alto</p>
              <Slider
                value={heightPercent}
                onChange={(_, v) => setHeightPercent(v as number)}
                min={10}
                max={200}
                disabled={loading}
              />

              <Button
                variant="contained"
                onClick={handleRemoveBackground}
                disabled={loading}
              >
                {!loading ? "Remover fondo" : <CircularProgress size={22} color="info"/>}
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                disabled={loading}
              >
                Guardar en Mis elementos
              </Button>
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditorModal;
