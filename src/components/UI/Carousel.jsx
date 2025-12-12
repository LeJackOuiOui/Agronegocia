import React, { useState } from "react";
import "../styles/Carousel.css";

export default function Carousel({ images }) {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((index - 1 + images.length) % images.length);
  };

  const next = () => {
    setIndex((index + 1) % images.length);
  };

  return (
    <div className="carousel">
      <img
        key={index}
        src={images[index].src}
        alt=""
        className="carousel-image"
      />

      {/* Texto verde oscuro con borde negro y animación */}
      <div className="animated-text">{images[index].text}</div>

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
