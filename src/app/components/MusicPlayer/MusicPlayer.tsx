'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Track {
  id: number;
  title: string;
  artist: {
    name: string;
    picture_small: string;
  };
  album: {
    cover_small: string;
  };
  preview: string; // 30-second preview URL
}

interface MusicPlayerProps {
  selectedMood?: string;
  selectedKeywords?: string[];
}

export default function MusicPlayer({ selectedMood, selectedKeywords = [] }: MusicPlayerProps) {
  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup previous audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const fetchMusic = async () => {
      try {
        const searchTerms = [selectedMood, ...selectedKeywords].filter(Boolean).join(' ');
        const queryParams = new URLSearchParams({ q: searchTerms });
        
        const response = await fetch(`/api/music?${queryParams}`);
        const data = await response.json();
        
        if (data && data.preview) {
          setTrack(data);
          const newAudio = new Audio(data.preview);
          setAudio(newAudio);
        }
      } catch (error) {
        console.error('Error fetching music:', error);
      }
    };

    if (selectedMood || selectedKeywords.length > 0) {
      fetchMusic();
    }

    // Cleanup on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [selectedMood, selectedKeywords]);

  const togglePlay = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!track) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-1 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-white dark:bg-dark-card rounded-full shadow-lg p-2 flex items-center space-x-4">
        <img
          src={track.album.cover_small}
          alt={track.title}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {track.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {track.artist.name}
          </p>
        </div>
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  );
} 