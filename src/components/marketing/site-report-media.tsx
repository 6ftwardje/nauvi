"use client";

import Image from "next/image";
import { Maximize2, Pause, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import s from "./site-report-media.module.css";

function formatTime(seconds: number) {
  const wholeSeconds = Math.floor(seconds);
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, "0")}`;
}

export function AudioMessagePlayer({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  function updateDuration(element: HTMLAudioElement) {
    setDuration(Number.isFinite(element.duration) ? element.duration : 0);
  }

  useEffect(() => {
    if (audio.current) updateDuration(audio.current);
  }, []);

  async function togglePlayback() {
    const element = audio.current;
    if (!element) return;
    if (!element.paused) {
      element.pause();
      return;
    }

    try {
      await element.play();
      setHasError(false);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setHasError(true);
    }
  }

  const position = Math.min(currentTime, duration);

  return (
    <>
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onDurationChange={event => updateDuration(event.currentTarget)}
        onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setHasError(true)}
      />
      <div className={s.player} role="group" aria-label="Spraakbericht afspelen">
        <button type="button" className={s.play} onClick={togglePlayback} aria-label={playing ? "Pauzeer spraakbericht" : "Speel spraakbericht af"}>
          {playing ? <Pause size={18} fill="currentColor" aria-hidden="true" /> : <Play size={18} fill="currentColor" aria-hidden="true" />}
        </button>
        <div className={s.timeline}>
          <div className={s.track} aria-hidden="true"><span style={{ width: `${duration ? position / duration * 100 : 0}%` }} /></div>
          <input
            className={s.seek}
            type="range"
            min={0}
            max={duration || 1}
            step="any"
            value={position}
            disabled={!duration}
            aria-label="Positie in het spraakbericht"
            aria-valuetext={`${formatTime(position)} van ${formatTime(duration)}`}
            onChange={event => {
              const element = audio.current;
              if (!element) return;
              element.currentTime = event.currentTarget.valueAsNumber;
              setCurrentTime(element.currentTime);
            }}
          />
        </div>
        <span className={s.time} aria-hidden="true">{formatTime(position)} / {duration ? formatTime(duration) : "–:–"}</span>
      </div>
      {hasError && <p role="status"><a href={src}>Open het spraakbericht</a></p>}
      <noscript><a href={src}>Open het spraakbericht</a></noscript>
    </>
  );
}

type ProjectPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export function ProjectPhotoGrid({ photos }: { photos: ProjectPhoto[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = useState<ProjectPhoto | null>(null);

  return (
    <>
      <div className={s.photos}>
        {photos.map(photo => (
          <figure id={photo.id} key={photo.id} tabIndex={-1}>
            <button type="button" className={s.photoButton} aria-label={`Vergroot ${photo.caption.toLowerCase()}`} onClick={event => {
              trigger.current = event.currentTarget;
              setSelected(photo);
              dialog.current?.showModal();
            }}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 45vw, (max-width: 1260px) 25vw, 300px" />
              <span className={s.expand}><Maximize2 size={15} aria-hidden="true" /></span>
            </button>
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className={s.dialog}
        aria-label="Werffoto bekijken"
        onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
        onClose={() => {
          setSelected(null);
          trigger.current?.focus();
        }}
      >
        <div className={s.dialogContent}>
          <button type="button" className={s.close} aria-label="Sluit foto" onClick={() => dialog.current?.close()}>
            <X size={20} aria-hidden="true" />
          </button>
          {selected && (
            <figure>
              <Image src={selected.src} alt={selected.alt} width={selected.width} height={selected.height} sizes="(max-width: 960px) 94vw, 900px" loading="eager" />
              <figcaption>{selected.caption}</figcaption>
            </figure>
          )}
        </div>
      </dialog>
    </>
  );
}
