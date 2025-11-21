import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";

interface AssetProps {
  src: any;
  handleRemoveAsset: any;
  id: any;
  clear: any;
  rotation: any;
  height: any;
  width: any;
  mirrorDeg: any;
  zIndex: any;
  style: any;
  boundsRef?: any;   // ← optional
  onSelect: any;
}

const Asset: React.FC<AssetProps> = ({ 
  src, 
  handleRemoveAsset, 
  id,
  clear,
  rotation,
  height,
  width,
  mirrorDeg,
  zIndex,
  style,
  boundsRef,
  onSelect

}) => {
const [cursor, setCursor] = useState("grab");
const [visible, setVisible] = useState<boolean>(true)
useEffect(()=>{
  if (clear === true) {
  setVisible(false);
}

},[clear]);





  return (

    <Draggable bounds=".canvas-area">
    <div
    style={{
      position: "absolute",
      cursor,
      zIndex,
      width: `${width}px`,
      height: `${height}px`
    }}
    onClick={() => {
      setCursor("grabbing");
      onSelect?.(id);
    }}
  >
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          ...style,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
      <img
        src={src}
        style={{
          pointerEvents: "none",
          transform: `rotateZ(${rotation}deg) rotateY(${mirrorDeg}deg)`,
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
    </div>
  </div>
    </Draggable>
  );
};

export default Asset;
