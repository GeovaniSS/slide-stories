import { Slide } from "./components/Slide";

export interface Slides {
  id: string;
  src: string;
  type: 'img' | 'video'
}

export function App() {
  const slides: Slides[] = [
    {
      id: '1', 
      src: "/img1.jpg",
      type: 'img',
    }, 
    {
      id: '2',
      src: "/img2.jpg",
      type: 'img',
    },
    {
      id: '3',
      src: "/img3.jpg",
      type: 'img',
    },
    {
      id: '4',
      src: "/img4.jpg",
      type: 'img',
    },
    {
      id: '5',
      src: "/video.mp4",
      type: 'video',
    }
  ]

  return (
    <div>
      <Slide slides={slides} />
    </div>
  )
}

