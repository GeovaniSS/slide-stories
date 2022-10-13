import React from "react";
import { Slide } from "./components/Slide";

export function App() {
  const slides = [
    {
      id: 1, 
      img: "/img1.jpg",
      alt: "Girafa 1"
    }, 
    {
      id: 2,
      img: "/img2.jpg",
      alt: "Girafa 2"
    },
    {
      id: 3,
      img: "/img3.jpg",
      alt: "Girafa 3"
    },
    {
      id: 4,
      img: "/img4.jpg",
      alt: "Girafa 4"
    }
  ]

  return (
    <div>
      <Slide 
        slides={slides} 
      />
    </div>
  )
}

