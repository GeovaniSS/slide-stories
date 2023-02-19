import { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Slides } from '../App';
import { useTimeout } from '../hooks/useTimeout';

interface SlideProps {
  slides: Slides[];
}

interface SlideContentProps {
  position: number;
}

interface ThumbProps {
  active: boolean;
  paused: boolean;
  duration: number;
}

const SlideContainer = styled.section`
  display: grid;
  max-width: 380px;
  margin: 20px auto;
  overflow: hidden;
`;

const SlideContent = styled.div<SlideContentProps>`
  display: flex;
  box-shadow: 0 4px 20px 2px rgba(0, 0, 0, 0.4);
  transform: translateX(${({ position }) => position + 'px'});
  transition: transform 0.3s ease;
  grid-area: 1/1;
`;

const SlideImage = styled.img`
  border-radius: 5px;
  display: block;
  max-width: 100%;
`;

const SlideVideo = styled.video`
  border-radius: 5px;
  display: block;
  max-width: 100%;
`;

const SlideNav = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto 1fr;

  width: 100%;
  grid-area: 1/1;
  z-index: 1;
`;

const SlideThumb = styled.div`
  display: flex;
  grid-column: 1/3;
`;

const Thumb = styled.span<ThumbProps>`
  flex: 1;
  display: block;
  overflow: hidden;
  height: 3px;
  margin: 5px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.4);

  ${({ active, paused, duration }) =>
    active &&
    css`
      &::after {
        content: '';
        display: block;
        height: inherit;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.9);
        transform: translateX(-100%);
        animation: thumb forwards linear;
        animation-duration: ${duration}ms;
        animation-play-state: ${paused ? 'paused' : 'running'};
      }
      @keyframes thumb {
        to {
          transform: initial;
        }
      }
    `}
`;

const SlideButton = styled.button`
  cursor: pointer;
  opacity: 0;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;

export function Slide({ slides }: SlideProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [slidePosition, setSlidePosition] = useState(0);
  const [slideDuration, setSlideDuration] = useState(5000);
  const [slidePaused, setSlidePaused] = useState(false);

  const slideRef = useRef<HTMLElement>(null!);
  const contentRef = useRef<HTMLDivElement>(null!);
  const timeoutRef = useRef<number | null>(null);
  const pausedTimeoutRef = useRef<number | null>(null);

  const slideTimeout = useTimeout();
  const pausedTimeout = useTimeout();

  function resetVideo(video: HTMLVideoElement) {
    video.pause();
    video.currentTime = 0;
  }

  function show(index: number) {
    setSlideIndex(index);
    localStorage.setItem('activeSlide', String(index));
    if (slideRef.current instanceof HTMLVideoElement) {
      resetVideo(slideRef.current);
    }
  }

  function nextSlide() {
    if (slidePaused) return;
    if (slideIndex < slides.length - 1) show(slideIndex + 1);
  }

  function previousSlide() {
    if (slidePaused) return;
    if (slideIndex > 0) show(slideIndex - 1);
  }

  function pauseSlide() {
    pausedTimeoutRef.current = pausedTimeout.start(() => {
      slideTimeout.pause();
      setSlidePaused(true);
      if (slideRef.current instanceof HTMLVideoElement)
        slideRef.current.pause();
    }, 300);
  }

  function resumeSlide() {
    if (pausedTimeoutRef.current) pausedTimeout.clear();
    if (slidePaused) {
      setSlidePaused(false);
      slideTimeout.resume();
      if (slideRef.current instanceof HTMLVideoElement) slideRef.current.play();
    }
  }

  useEffect(() => {
    const activeSlide = Number(localStorage.getItem('activeSlide'));
    show(activeSlide);
  }, []);

  // Animation Position
  useEffect(() => {
    const { width } = contentRef.current.getBoundingClientRect();
    setSlidePosition(-(width * slideIndex));
  }, [slideIndex]);

  // Auto Slide / Video
  useEffect(() => {
    function autoSlide(time: number) {
      if (timeoutRef.current) slideTimeout.clear();
      timeoutRef.current = slideTimeout.start(() => nextSlide(), time);
    }

    function autoVideo(video: HTMLVideoElement) {
      let firstPlay = true;
      video.muted = true;
      video.play();
      video.addEventListener('playing', () => {
        if (firstPlay) {
          setSlideDuration(video.duration * 1000);
          autoSlide(slideDuration);
        }
        firstPlay = false;
      });
    }

    if (slideRef.current instanceof HTMLVideoElement) {
      autoVideo(slideRef.current);
    } else {
      setSlideDuration(5000);
      autoSlide(slideDuration);
    }
  }, [slideIndex]);

  useEffect(() => {
    if (document.body.classList.contains('paused')) {
      document.body.classList.remove('paused');
    } else {
      document.body.classList.add('paused');
    }
  }, [slidePaused]);

  return (
    <SlideContainer>
      <SlideContent position={slidePosition} ref={contentRef}>
        {slides.map(({ id, src, type }, index) => {
          if (type === 'img')
            return (
              <SlideImage
                key={id}
                src={src}
                // @ts-ignore
                ref={index === slideIndex ? slideRef : null}
              />
            );
          if (type === 'video')
            return (
              <SlideVideo
                key={id}
                src={src}
                // @ts-ignore
                ref={index === slideIndex ? slideRef : null}
              />
            );
        })}
      </SlideContent>
      <SlideNav onPointerDown={pauseSlide} onPointerUp={resumeSlide}>
        <SlideThumb>
          {slides.map((slide, index) => (
            <Thumb
              key={slide.id}
              active={slideIndex === index}
              paused={slidePaused}
              duration={slideDuration}
            />
          ))}
        </SlideThumb>
        <SlideButton onPointerUp={previousSlide}>Slide Anterior</SlideButton>
        <SlideButton onPointerUp={nextSlide}>Próximo Slide</SlideButton>
      </SlideNav>
    </SlideContainer>
  );
}
