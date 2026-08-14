import React, { useState, useEffect, useRef } from 'react';
import { Track } from '../types';
import { PLAYLIST_TRACKS, YOUTUBE_PLAYLIST_ID } from '../data/busData';
import { ambientBusAudio } from '../utils/audioSynthesizer';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Sliders,
  Radio,
  Sparkles,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface MusicPlayerProps {
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isMuted,
  setIsMuted,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(448); // default for Yun Hi Chala Chal
  const [volume, setVolume] = useState(80);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showAmbientMixer, setShowAmbientMixer] = useState(false);
  const [engineVol, setEngineVol] = useState(8);
  const [windVol, setWindVol] = useState(5);
  const [isExpanded, setIsExpanded] = useState(true);

  const currentTrack = PLAYLIST_TRACKS[currentTrackIndex] || PLAYLIST_TRACKS[0];
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync ambient audio on volume change
  useEffect(() => {
    if (isPlaying && !isMuted) {
      ambientBusAudio.start(engineVol / 100, windVol / 100);
    } else {
      ambientBusAudio.stop();
    }
  }, [isPlaying, isMuted, engineVol, windVol]);

  // Simulate progress playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= durationSec) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, durationSec]);

  useEffect(() => {
    setProgressPercent((currentTimeSec / durationSec) * 100);
  }, [currentTimeSec, durationSec]);

  // Play / Pause toggle
  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    // Send postMessage to YouTube Iframe if supported
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const message = nextState
        ? JSON.stringify({ event: 'command', func: 'playVideo', args: '' })
        : JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' });
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % PLAYLIST_TRACKS.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTimeSec(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIndex - 1 + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
    setCurrentTrackIndex(prevIdx);
    setCurrentTimeSec(0);
    setIsPlaying(true);
  };

  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTimeSec(0);
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercent = Math.max(0, Math.min(100, (clickX / width) * 100));
    setProgressPercent(newPercent);
    setCurrentTimeSec(Math.floor((newPercent / 100) * durationSec));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      {/* Hidden/Minimized Real YouTube Embed for authentic streaming audio */}
      <div className="hidden">
        <iframe
          ref={iframeRef}
          id="yt-roadways-audio-stream"
          width="320"
          height="180"
          src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${currentTrack.youtubeId}`}
          title="Roadways Safar Music Audio"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Playlist Drawer Modal */}
      {showPlaylist && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <h3 className="font-yatra text-lg text-amber-300">
                  रोडवेज़ कैसेट प्लेलिस्ट (Playlist)
                </h3>
              </div>
              <button
                onClick={() => setShowPlaylist(false)}
                className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg bg-neutral-800"
              >
                Close ✕
              </button>
            </div>

            <div className="overflow-y-auto my-3 space-y-1.5 pr-1">
              {PLAYLIST_TRACKS.map((track, idx) => {
                const isCurrent = idx === currentTrackIndex;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(idx)}
                    className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200'
                        : 'bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-neutral-500 w-5">
                        {isCurrent ? '▶' : `${idx + 1}`}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold truncate max-w-[220px]">
                          {track.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate max-w-[220px]">
                          {track.movie} • {track.artist}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-amber-400/80 border border-neutral-700">
                        {track.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>Source: YouTube Roadways Radio</span>
              <a
                href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}&list=${YOUTUBE_PLAYLIST_ID}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                Open on YouTube <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Ambient Sound Mixer Drawer */}
      {showAmbientMixer && (
        <div className="fixed bottom-24 right-3 left-3 sm:left-auto sm:right-8 z-40 max-w-sm sm:w-72 bg-neutral-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 shadow-2xl animate-fadeIn text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-800">
            <span className="font-bold text-amber-300 flex items-center gap-1.5 font-hindi text-xs sm:text-sm">
              <Sliders className="w-3.5 h-3.5 text-amber-400" /> हाईवे माहौल मिक्सर
            </span>
            <button
              onClick={() => setShowAmbientMixer(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Bus Engine Rumble */}
            <div>
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span className="font-hindi">बस इंजन की गूँज:</span>
                <span className="font-mono text-amber-400">{engineVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={engineVol}
                onChange={(e) => setEngineVol(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
              />
            </div>

            {/* Highway Wind Breeze */}
            <div>
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span className="font-hindi">खिड़की की ठंडी हवा:</span>
                <span className="font-mono text-sky-400">{windVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={windVol}
                onChange={(e) => setWindVol(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* FIXED GLASSMORPHISM BOTTOM MUSIC PLAYER */}
      <div
        id="roadways-glass-music-player"
        className="fixed bottom-2.5 sm:bottom-4 inset-x-2 sm:inset-x-6 z-40 max-w-5xl mx-auto backdrop-blur-2xl bg-neutral-950/90 border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] px-3 sm:px-5 py-2 sm:py-3 transition-all duration-300 hover:border-amber-500/50"
      >
        {/* Progress Bar (Clickable scrubber) */}
        <div
          id="player-progress-bar"
          onClick={handleSeek}
          className="group relative w-full h-1.5 bg-neutral-800/90 rounded-full cursor-pointer overflow-hidden mb-1.5 sm:mb-2.5"
          title="Click to seek"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Track Details & Nostalgic Cassette Art */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div
              onClick={() => setShowPlaylist(true)}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-neutral-950 font-bold shrink-0 shadow-lg cursor-pointer relative overflow-hidden group"
              title="View Cassette Playlist"
            >
              {/* Rotating Tape Reels */}
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-neutral-950 flex items-center justify-center ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '3s' }}
                >
                  <div className="w-1 h-1 bg-neutral-950 rounded-full" />
                </div>
                <div
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-neutral-950 flex items-center justify-center ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '3s' }}
                >
                  <div className="w-1 h-1 bg-neutral-950 rounded-full" />
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-sm font-sans">
                  {currentTrack.title}
                </span>
                <span className="hidden md:inline-block text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentTrack.year || 'Retro'}
                </span>
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-400 truncate font-sans">
                {currentTrack.movie} • <span className="text-neutral-500">{currentTrack.artist}</span>
              </div>
            </div>
          </div>

          {/* Center: Playback Controls & Time */}
          <div className="flex flex-col items-center gap-0.5 sm:gap-1 shrink-0">
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Previous */}
              <button
                id="player-prev-btn"
                onClick={handlePrev}
                className="p-1 sm:p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Previous Track"
              >
                <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Play / Pause Main Button */}
              <button
                id="player-play-pause-btn"
                onClick={togglePlay}
                className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/30 transition-all active:scale-95 cursor-pointer font-bold"
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />}
              </button>

              {/* Next */}
              <button
                id="player-next-btn"
                onClick={handleNext}
                className="p-1 sm:p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Next Track"
              >
                <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Time Stamp */}
            <div className="text-[9px] sm:text-[10px] text-neutral-400 font-mono flex items-center gap-1">
              <span>{formatTime(currentTimeSec)}</span>
              <span>/</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>

          {/* Right: Audio Visualizer, Playlist Drawer, Atmosphere Mixer & Volume */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 justify-end flex-1 shrink-0">
            {/* Animated Equalizer Wave Bars */}
            <div className="hidden xl:flex items-end gap-1 h-5 px-2 bg-neutral-900/80 rounded-lg border border-neutral-800">
              {[60, 100, 40, 80, 50, 90, 30].map((h, i) => (
                <div
                  key={i}
                  className={`w-0.5 bg-amber-400 rounded-full transition-all ${
                    isPlaying ? 'animate-pulse' : 'h-1 opacity-40'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, h * (isPlaying ? 1 : 0.2))}%` : '20%',
                    animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                  }}
                />
              ))}
            </div>

            {/* Atmosphere Mixer Trigger */}
            <button
              id="ambient-mixer-btn"
              onClick={() => setShowAmbientMixer(!showAmbientMixer)}
              className={`p-1.5 sm:p-2 rounded-xl text-xs flex items-center gap-1 border transition-colors ${
                showAmbientMixer
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Atmosphere Sound Mixer (Engine & Wind)"
            >
              <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden lg:inline text-[11px] font-hindi">माहौल</span>
            </button>

            {/* Playlist Drawer Button */}
            <button
              id="playlist-drawer-btn"
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-amber-300 transition-colors flex items-center gap-1"
              title="Roadways Cassette Tape List"
            >
              <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-xs font-medium font-hindi">गीत</span>
            </button>

            {/* Mute Button */}
            <button
              id="player-mute-btn"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
