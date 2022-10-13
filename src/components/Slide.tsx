import React from "react";
import styled, { css } from "styled-components";

const SlideContainer = styled.section`
  display: grid;
  max-width: 380px;
  margin: 20px auto;
  overflow: hidden;
`

interface SlideContentProps {
  position: number
}

const SlideContent = styled.div<SlideContentProps>`
  display: flex;
  box-shadow: 0 4px 20px 2px rgba(0, 0, 0, .4);
  transform: translateX(${({ position }) => position + "px"});
  transition: transform 0.3s ease;
  grid-area: 1/1;
`

const SlideImage = styled.img`
  border-radius: 5px;
  display: block;
  max-width: 100%;
`

const SlideNav = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;

  width: 100%;
  grid-area: 1/1;
  z-index: 1;
`

const SlideThumb = styled.div`
  display: flex;
  grid-column: 1/3;
`

interface ThumbProps {
  active: boolean
}

const Thumb = styled.span<ThumbProps>`
  flex: 1;
  display: block;
  overflow: hidden;
  height: 3px;
  margin: 5px;
  border-radius: 3px;
  background: rgba(0, 0, 0, .4);

  ${({ active }) => active && css`
    &::after{
    content: '';
    display: block;
    height: inherit;
    border-radius: 3px;
    background: rgba(255, 255, 255, .9);
    transform: translateX(-100%);
    animation: thumb 5s forwards linear;
    }
    @keyframes thumb {
      to {
        transform: initial;
      }
    }
  `}
`

const SlideButton = styled.button`
  cursor: pointer;
  opacity: 0;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

interface Slides {
  id: number
  img: string
  alt: string
}

interface SlideProps {
  slides: Slides[]
}

export function Slide({ slides }: SlideProps) {
  const [active, setActive] = React.useState(0)
  const [position, setPosition] = React.useState(0)

  const contentRef = React.useRef<HTMLDivElement>(null!)
  const intervalRef = React.useRef<number | null>(null)

  // Animation Position
  React.useEffect(() => {
    const { width } = contentRef.current.getBoundingClientRect()
    setPosition(-(width * active)) 
  }, [active])

  // Auto Slide
  React.useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setTimeout(() => nextSlide(), 5000)
  }, [active])

  function nextSlide() {
    if (active < slides.length - 1) {
      setActive(active + 1)
    } 
  }

  function previousSlide() {
    if (active > 0) {
      setActive(active - 1)
    }
  }

  return (
    <SlideContainer>
      <SlideContent position={position} ref={contentRef} >
        { slides.map((slide) => (
          <SlideImage 
            key={slide.id} 
            src={slide.img} 
            alt={slide.alt}
          />
        ))}
      </SlideContent>
      <SlideNav>
        <SlideThumb>
          { slides.map((slide, index) => (
            <Thumb key={slide.id} active={active === index}/>
          ))}
        </SlideThumb>
        <SlideButton onClick={previousSlide} />
        <SlideButton onClick={nextSlide} />
      </SlideNav>
    </SlideContainer>
  )
}
