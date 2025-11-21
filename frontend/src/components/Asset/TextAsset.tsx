import React, { useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
import style from "./TextAsset.module.css";
import { RotateExtraLeft, RotateExtraRight, RotateLeft, RotateRight, ZoomIn, ZoomOut, Trash, Hoist } from "../../assets/icons";
import Edit from "../../assets/icons/Edit";
import { Button, TextField } from "@mui/material";


interface TextAssetProps {
  clear: boolean;
  handleRemoveAsset: () => void;
  boundsRef?: React.RefObject<HTMLDivElement>; 
}


export default function TextAsset({ clear, handleRemoveAsset, boundsRef }: TextAssetProps){
  const nodeRef = useRef(null);

  const [text, setText] = useState("Doble click para editar");
  const [isEditing, setIsEditing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zIndex, setZIndex] = useState(1);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [mirrorDeg, setMirrorDeg] = useState(0);
  const [visible, setVisible] = useState(false);
  const [cursor, setCursor] = useState("grab");
  const [textColor, setTextColor] = useState("black");
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    if (clear) setVisible(false);
  }, [clear]);

  const buttons = [
    { name: "Edit", onClick: () => setIsEditing(true), icon: <Edit /> },
    { name: "RotateLeft", onClick: () => setRotation((p) => p - 15), icon: <RotateLeft /> },
    { name: "RotateRight", onClick: () => setRotation((p) => p + 15), icon: <RotateRight /> },
    { name: "ExtraLeft", onClick: () => setRotation((p) => p - 45), icon: <RotateExtraLeft /> },
    { name: "ExtraRight", onClick: () => setRotation((p) => p + 45), icon: <RotateExtraRight /> },
    { name: "BringToFront", onClick: () => setZIndex((p) => p + 1), icon: <Hoist /> },
    { name: "EnlargeFont", onClick: () => setFontSize((p) => p + 2), icon: <ZoomIn /> },
    { name: "ReduceFont", onClick: () => setFontSize((p) => p - 2), icon: <ZoomOut /> },
    { name: "Remove", onClick: handleRemoveAsset, icon: <Trash /> },
    { name: "Black", onClick: () => setTextColor("black"), icon: "N", style: { background: "black", color: "white" } },
    { name: "White", onClick: () => setTextColor("white"), icon: "B", style: { background: "white", color: "black" } },
    { name: "Orange", onClick: () => setTextColor("orange"), icon: "Nr", style: { background: "orange", color: "black" } },
  ];

  // 🎯 FIX: Calculate proper draggable bounds
  const calcBounds = () => {
    if (!boundsRef?.current) return undefined;

    const parent = boundsRef.current.getBoundingClientRect();
    const box = nodeRef.current?.getBoundingClientRect();

    if (!box) return undefined;

    return {
      left: 0,
      top: 0,
      right: parent.width - box.width,
      bottom: parent.height - box.height,
    };
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds={calcBounds()}
      onDrag={() => {}} // Makes Draggable recalc bounds dynamically
    >
      <div
        ref={nodeRef}
        style={{
          position: "absolute",
          zIndex,
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "grab",
          color: textColor,
        }}
        onDoubleClick={() => setIsEditing(true)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {isEditing ? (
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <span
            style={{
              color: textColor,
              fontSize: `${fontSize}px`,
              transform: `rotateZ(${rotation}deg)`,
              userSelect: "none",
            }}
          >
            {text}
          </span>
        )}

        {visible && (
          <div className={style.assetPanel}>
            {buttons.map((btn) => (
              <Button
                key={btn.name}
                onClick={btn.onClick}
                onTouchStart={btn.onClick}
                style={btn.style}
              >
                {btn.icon}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Draggable>
  );
};


