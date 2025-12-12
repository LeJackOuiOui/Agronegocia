import React, { useState } from "react";
import "./Carousel.css";

function Carousel({ images }) {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((index - 1 + images.length) % images.length);
  };

  const next = () => {
    setIndex((index + 1) % images.length);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        key={index}
        src={images[index].src}
        alt=""
        className="carousel-image"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Texto verde oscuro con borde negro y animación */}
      <div
        className="animated-text"
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#00AA00",
          fontSize: "36px",
          fontWeight: "bold",
          textShadow: 
            "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, -2px 0px 0 #000, 2px 0px 0 #000, 0px -2px 0 #000, 0px 2px 0 #000",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {images[index].text}
      </div>

      {/* Botón Izquierdo */}
      <button
        onClick={prev}
        style={{
          position: "absolute",
          top: "50%",
          left: "30px",
          transform: "translateY(-50%)",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          border: "none",
          fontSize: "30px",
          cursor: "pointer",
        }}
      >
        ❮
      </button>

      {/* Botón Derecho */}
      <button
        onClick={next}
        style={{
          position: "absolute",
          top: "50%",
          right: "30px",
          transform: "translateY(-50%)",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          border: "none",
          fontSize: "30px",
          cursor: "pointer",
        }}
      >
        ❯
      </button>
    </div>
  );
}

export default Carousel;
