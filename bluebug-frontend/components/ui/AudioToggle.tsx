"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export function AudioToggle({ onAnalyserReady }: { onAnalyserReady?: (analyser: AnalyserNode | null) => void }) {
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  const toggle = useCallback(async () => {
    if (playing) {
      sourceRef.current?.stop();
      setPlaying(false);
      onAnalyserReady?.(null);
      if (typeof window !== "undefined") {
        (window as any).__audioAnalyser = null;
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
        analyserRef.current.connect(audioCtxRef.current.destination);
      }

      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }

      if (!bufferRef.current) {
        const response = await fetch("/ambient.mp3");
        if (!response.ok) {
          throw new Error("Audio file not found");
        }
        const arrayBuffer = await response.arrayBuffer();
        bufferRef.current = await audioCtxRef.current.decodeAudioData(arrayBuffer);
      }

      const source = audioCtxRef.current.createBufferSource();
      source.buffer = bufferRef.current;
      source.loop = true;
      source.connect(analyserRef.current!);
      source.start(0);
      sourceRef.current = source;
      setPlaying(true);
      onAnalyserReady?.(analyserRef.current);
      if (typeof window !== "undefined") {
        (window as any).__audioAnalyser = analyserRef.current;
      }
    } catch (e) {
      console.warn("Audio playback not available or failed:", e);
    }
  }, [playing, onAnalyserReady]);

  useEffect(() => {
    return () => {
      sourceRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <button
      onClick={toggle}
      className="audio-toggle"
      aria-label={playing ? "Mute ambient audio" : "Play ambient audio"}
      title={playing ? "Mute" : "Play ambient audio"}
    >
      {playing ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.3" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.3" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
