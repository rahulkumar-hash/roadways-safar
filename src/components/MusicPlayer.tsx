import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Track } from '../types';
import { PLAYLIST_TRACKS } from '../data/busData';
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
  ExternalLink,
  Search,
  Shuffle,
  Repeat,
  Music,
  X,
  Tv,
  Eye,
  EyeOff,
} from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicPlayerProps {
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
}

// Convert mm:ss to seconds
function parseDurationToSec(durationStr: string): number {
  if (!durationStr) return 240;
  const parts = durationStr.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  return 240;
}

// Retro cassette mechanical click sound
function playCassetteClickSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (err) {
    // Ignore if blocked by browser
  }
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isMuted,
  setIsMuted,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showAmbientMixer, setShowAmbientMixer] = useState(false);
  const [showMiniScreen, setShowMiniScreen] = useState(false);
  const [engineVol, setEngineVol] = useState(8);
  const [windVol, setWindVol] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const currentTrack = PLAYLIST_TRACKS[currentTrackIndex] || PLAYLIST_TRACKS[0];
  const durationSec = useMemo(() => parseDurationToSec(currentTrack.duration), [currentTrack]);
  const playerRef = useRef<any>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const currentTrackIndexRef = useRef(currentTrackIndex);
  currentTrackIndexRef.current = currentTrackIndex;

  const isShuffleRef = useRef(isShuffle);
  isShuffleRef.current = isShuffle;

  const isRepeatRef = useRef(isRepeat);
  isRepeatRef.current = isRepeat;

  // Handle Next Track Function (memoized)
  const handleNext = useCallback(() => {
    playCassetteClickSound();
    let nextIdx = 0;
    if (isShuffleRef.current) {
      nextIdx = Math.floor(Math.random() * PLAYLIST_TRACKS.length);
    } else {
      nextIdx = (currentTrackIndexRef.current + 1) % PLAYLIST_TRACKS.length;
    }
    const nextTrack = PLAYLIST_TRACKS[nextIdx];
    setCurrentTrackIndex(nextIdx);
    setCurrentTimeSec(0);
    setProgressPercent(0);
    setIsPlaying(true);

    if (playerRef.current && playerRef.current.loadVideoById) {
      try {
        playerRef.current.loadVideoById({
          videoId: nextTrack.youtubeId,
          startSeconds: 0,
        });
        playerRef.current.playVideo();
      } catch (e) {
        console.warn('YT load error:', e);
      }
    }
  }, []);

  // Handle Previous Track Function (memoized)
  const handlePrev = useCallback(() => {
    playCassetteClickSound();
    let prevIdx = 0;
    if (isShuffleRef.current) {
      prevIdx = Math.floor(Math.random() * PLAYLIST_TRACKS.length);
    } else {
      prevIdx = (currentTrackIndexRef.current - 1 + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
    }
    const prevTrack = PLAYLIST_TRACKS[prevIdx];
    setCurrentTrackIndex(prevIdx);
    setCurrentTimeSec(0);
    setProgressPercent(0);
    setIsPlaying(true);

    if (playerRef.current && playerRef.current.loadVideoById) {
      try {
        playerRef.current.loadVideoById({
          videoId: prevTrack.youtubeId,
          startSeconds: 0,
        });
        playerRef.current.playVideo();
      } catch (e) {
        console.warn('YT load error:', e);
      }
    }
  }, []);

  // Handle direct track selection from 100 songs playlist
  const handleSelectTrack = useCallback((index: number) => {
    playCassetteClickSound();
    const targetTrack = PLAYLIST_TRACKS[index];
    setCurrentTrackIndex(index);
    setCurrentTimeSec(0);
    setProgressPercent(0);
    setIsPlaying(true);

    if (playerRef.current && playerRef.current.loadVideoById) {
      try {
        playerRef.current.loadVideoById({
          videoId: targetTrack.youtubeId,
          startSeconds: 0,
        });
        playerRef.current.playVideo();
      } catch (e) {
        console.warn('YT select load error:', e);
      }
    }
  }, []);

  // Initialize YouTube Iframe Player API
  useEffect(() => {
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      try {
        playerRef.current = new window.YT.Player('roadways-yt-player-slot', {
          height: '180',
          width: '280',
          videoId: currentTrack.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: (event: any) => {
              setPlayerReady(true);
              if (isMuted) {
                event.target.mute();
              }
            },
            onStateChange: (event: any) => {
              // 1: PLAYING, 2: PAUSED, 0: ENDED
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                if (isRepeatRef.current) {
                  event.target.seekTo(0, true);
                  event.target.playVideo();
                } else {
                  handleNext();
                }
              }
            },
            onError: (err: any) => {
              console.warn('YouTube Error, auto-switching:', err);
            },
          },
        });
      } catch (err) {
        console.warn('YT Player init error:', err);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
      document.body.appendChild(tag);
    } else {
      initPlayer();
    }
  }, [currentTrack.youtubeId, handleNext, isMuted]);

  // Sync Mute state with YouTube player
  useEffect(() => {
    if (playerRef.current && playerRef.current.mute && playerRef.current.unMute) {
      try {
        if (isMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      } catch (e) {
        // Ignore
      }
    }
  }, [isMuted]);

  // Ambient sound sync
  useEffect(() => {
    if (isPlaying && !isMuted) {
      ambientBusAudio.start(engineVol / 100, windVol / 100);
    } else {
      ambientBusAudio.stop();
    }
  }, [isPlaying, isMuted, engineVol, windVol]);

  // Progress sync timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
          try {
            const cur = Math.floor(playerRef.current.getCurrentTime() || 0);
            const dur = Math.floor(playerRef.current.getDuration() || durationSec);
            setCurrentTimeSec(cur);
            if (dur > 0) {
              setProgressPercent(Math.min(100, (cur / dur) * 100));
            }
          } catch (e) {
            setCurrentTimeSec((prev) => prev + 1);
          }
        } else {
          setCurrentTimeSec((prev) => {
            if (prev >= durationSec) {
              handleNext();
              return 0;
            }
            return prev + 1;
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, durationSec, handleNext]);

  // Play / Pause toggle
  const togglePlay = () => {
    playCassetteClickSound();
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (playerRef.current) {
      try {
        if (nextState) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (e) {
        console.warn('Play/Pause error:', e);
      }
    }
  };

  // Seek bar scrubber
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercent = Math.max(0, Math.min(100, (clickX / width) * 100));
    setProgressPercent(newPercent);
    const newTime = Math.floor((newPercent / 100) * durationSec);
    setCurrentTimeSec(newTime);

    if (playerRef.current && playerRef.current.seekTo) {
      try {
        playerRef.current.seekTo(newTime, true);
      } catch (e) {
        // Ignore
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrev();
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setShowPlaylist((prev) => !prev);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsMuted(!isMuted);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNext, handlePrev, isMuted, isPlaying]);

  // Filter 100 tracks
  const filteredTracks = useMemo(() => {
    return PLAYLIST_TRACKS.filter((track, idx) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        track.title.toLowerCase().includes(q) ||
        track.movie.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.tag.toLowerCase().includes(q) ||
        (track.year && track.year.includes(q)) ||
        `${idx + 1}` === q;

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'retro') {
        const y = parseInt(track.year || '0', 10);
        return (y > 0 && y < 1990) || track.tag.includes('70s') || track.tag.includes('Classic') || track.tag.includes('Golden');
      }
      if (selectedCategory === '90s') {
        const y = parseInt(track.year || '0', 10);
        return (y >= 1990 && y < 2000) || track.tag.includes('90s');
      }
      if (selectedCategory === '2000s') {
        const y = parseInt(track.year || '0', 10);
        return y >= 2000;
      }
      if (selectedCategory === 'highway') {
        return track.tag.toLowerCase().includes('highway') || track.tag.toLowerCase().includes('road') || track.tag.toLowerCase().includes('safar') || track.tag.toLowerCase().includes('travel');
      }
      if (selectedCategory === 'sufi') {
        return track.tag.toLowerCase().includes('sufi') || track.tag.toLowerCase().includes('dhaba') || track.tag.toLowerCase().includes('ghazal');
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      {/* YouTube Player Slot - Rendered visibly or offscreen so browser NEVER freezes or throttles audio */}
      <div
        className={`fixed z-50 transition-all duration-300 ${
          showMiniScreen
            ? 'bottom-28 right-4 sm:right-8 bg-neutral-900 border-2 border-amber-500 rounded-2xl shadow-2xl p-2'
            : 'pointer-events-none opacity-0 -bottom-96 -right-96 w-1 h-1'
        }`}
      >
        {showMiniScreen && (
          <div className="flex items-center justify-between pb-1.5 px-1 text-xs text-amber-300 font-bold border-b border-neutral-800 mb-1">
            <span className="flex items-center gap-1">
              <Tv className="w-3.5 h-3.5" /> मिनी स्क्रीन (Roadways TV)
            </span>
            <button
              onClick={() => setShowMiniScreen(false)}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
        <div id="roadways-yt-player-slot" className="rounded-xl overflow-hidden shadow" />
      </div>

      {/* 100 SONGS CASSETTE PLAYLIST MODAL */}
      {showPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-neutral-950 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-yatra text-lg sm:text-xl text-amber-300 flex items-center gap-2">
                    <span>रोडवेज़ 100 कैसेट टेप प्लेलिस्ट</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-normal">
                      {PLAYLIST_TRACKS.length} Songs
                    </span>
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-hindi">
                    गाना सेलेक्ट करें और तुरंत बजना शुरू हो जाएगा
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPlaylist(false)}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Close Playlist (L)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter Tabs */}
            <div className="pt-3 pb-2 space-y-2.5 shrink-0 border-b border-neutral-800/80">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="गाना, गायक, फिल्म, या साल सर्च करें (e.g. Kishore, 90s, Arijit, Swades)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900/90 border border-neutral-700/80 focus:border-amber-500 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'all', label: `All (${PLAYLIST_TRACKS.length})` },
                  { id: 'retro', label: '70s-80s Retro' },
                  { id: '90s', label: '90s Evergreen' },
                  { id: '2000s', label: '2000s Hits' },
                  { id: 'highway', label: 'Highway & Safar' },
                  { id: 'sufi', label: 'Dhaba & Sufi' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Song List */}
            <div className="overflow-y-auto my-2 space-y-1.5 pr-1 flex-1 custom-scrollbar">
              {filteredTracks.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  कोई गाना नहीं मिला "{searchQuery}"
                </div>
              ) : (
                filteredTracks.map((track) => {
                  const originalIndex = PLAYLIST_TRACKS.findIndex((t) => t.id === track.id);
                  const isCurrent = originalIndex === currentTrackIndex;

                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(originalIndex)}
                      className={`p-2.5 sm:p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-amber-500/20 border border-amber-500/60 text-amber-200 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/80 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Number or Animated Playing Equalizer */}
                        <div className="w-6 text-center shrink-0">
                          {isCurrent && isPlaying ? (
                            <div className="flex items-end justify-center gap-0.5 h-3.5">
                              <span className="w-1 bg-amber-400 rounded-full animate-pulse h-3" />
                              <span className="w-1 bg-amber-400 rounded-full animate-pulse h-2" style={{ animationDelay: '0.2s' }} />
                              <span className="w-1 bg-amber-400 rounded-full animate-pulse h-3.5" style={{ animationDelay: '0.4s' }} />
                            </div>
                          ) : (
                            <span className={`text-xs font-mono ${isCurrent ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
                              {originalIndex + 1}
                            </span>
                          )}
                        </div>

                        {/* Title and details */}
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold truncate flex items-center gap-1.5">
                            <span>{track.title}</span>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-neutral-950 font-bold font-mono">
                                PLAYING
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate flex items-center gap-2">
                            <span>{track.movie}</span>
                            <span>•</span>
                            <span className="text-neutral-500">{track.artist}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Tag & Duration */}
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-neutral-800 text-amber-300/80 border border-neutral-700">
                          {track.tag}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {track.duration}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 shrink-0">
              <span className="font-hindi text-[11px] truncate max-w-[280px]">
                अभी बज रहा: <strong className="text-amber-300">#{currentTrackIndex + 1} {currentTrack.title}</strong>
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMiniScreen(!showMiniScreen)}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <Tv className="w-3 h-3" />
                  <span>{showMiniScreen ? 'Hide Video' : 'Show Video'}</span>
                </button>
                <a
                  href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 text-[11px]"
                >
                  YouTube Link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
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
        className="fixed bottom-2.5 sm:bottom-4 inset-x-2 sm:inset-x-6 z-40 max-w-5xl mx-auto backdrop-blur-2xl bg-neutral-950/92 border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] px-3 sm:px-5 py-2 sm:py-3 transition-all duration-300 hover:border-amber-500/50"
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
          {/* Left: Track Details & Cassette Reel Animation */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div
              onClick={() => setShowPlaylist(true)}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-neutral-950 font-bold shrink-0 shadow-lg cursor-pointer relative overflow-hidden group"
              title="Click to open 100 Songs Cassette Tape Playlist (L)"
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
                  {currentTrackIndex + 1}. {currentTrack.title}
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
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Shuffle button */}
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-1 sm:p-1.5 rounded-xl transition-colors cursor-pointer ${
                  isShuffle ? 'text-amber-400 bg-amber-500/20' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title={isShuffle ? 'Shuffle ON' : 'Shuffle OFF'}
              >
                <Shuffle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>

              {/* Previous */}
              <button
                id="player-prev-btn"
                onClick={handlePrev}
                className="p-1 sm:p-1.5 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all active:scale-90 cursor-pointer"
                title="Previous Track (P / ←)"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
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
                className="p-1 sm:p-1.5 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all active:scale-90 cursor-pointer"
                title="Next Track (N / →)"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Repeat button */}
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-1 sm:p-1.5 rounded-xl transition-colors cursor-pointer ${
                  isRepeat ? 'text-amber-400 bg-amber-500/20' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title={isRepeat ? 'Repeat Song ON' : 'Repeat OFF'}
              >
                <Repeat className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            {/* Time Stamp */}
            <div className="text-[9px] sm:text-[10px] text-neutral-400 font-mono flex items-center gap-1">
              <span>{formatTime(currentTimeSec)}</span>
              <span>/</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>

          {/* Right: Atmosphere Mixer, Mini Video Toggle, 100 Playlist Drawer & Mute */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 justify-end flex-1 shrink-0">
            {/* Video Screen Toggle */}
            <button
              onClick={() => setShowMiniScreen(!showMiniScreen)}
              className={`p-1.5 sm:p-2 rounded-xl text-xs flex items-center gap-1 border transition-colors cursor-pointer ${
                showMiniScreen
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Toggle Mini Video Screen"
            >
              <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Atmosphere Mixer Trigger */}
            <button
              id="ambient-mixer-btn"
              onClick={() => setShowAmbientMixer(!showAmbientMixer)}
              className={`p-1.5 sm:p-2 rounded-xl text-xs flex items-center gap-1 border transition-colors cursor-pointer ${
                showAmbientMixer
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Atmosphere Sound Mixer (Engine & Wind)"
            >
              <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden lg:inline text-[11px] font-hindi">माहौल</span>
            </button>

            {/* Playlist Drawer Button (100 Songs) */}
            <button
              id="playlist-drawer-btn"
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="p-1.5 sm:p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open 100 Roadways Cassette Songs (Press 'L')"
            >
              <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs font-bold font-hindi">100 गीत</span>
            </button>

            {/* Mute Button */}
            <button
              id="player-mute-btn"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
