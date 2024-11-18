/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';
import MusicPlayer from '../MusicPlayer/MusicPlayer'

interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    regular: string;
    small: string;
  };
  alt_description: string;
  width: number;
  height: number;
}

interface ImagePageProps {
  selectedMood?: string;
  selectedKeywords?: string[];
}

export default function ImagePage({ selectedMood, selectedKeywords = [] }: ImagePageProps) {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  
  // Add a Set to track unique image IDs
  const imageIds = useRef(new Set<string>());

  // Reference for the last image element
  const lastImageRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  async function getImages(pageNum: number) {
    try {
      setLoading(true);
      const searchTerms = [selectedMood, ...selectedKeywords].filter(Boolean).join(',');
      const queryParams = new URLSearchParams({ 
        q: searchTerms,
        page: pageNum.toString()
      });
      
      const response = await fetch(`/api/images?${queryParams}`);
      const data = await response.json();
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        // Filter out duplicates
        const newImages = data.filter((img: UnsplashImage) => !imageIds.current.has(img.id));
        
        // Add new image IDs to the Set
        newImages.forEach((img: UnsplashImage) => imageIds.current.add(img.id));
        
        setImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  }

  // Reset everything when search terms change
  useEffect(() => {
    setImages([]);
    setPage(1);
    setHasMore(true);
    // Clear the Set of tracked IDs
    imageIds.current.clear();
  }, [selectedMood, selectedKeywords]);

  // Fetch images when page changes or search terms change
  useEffect(() => {
    if (selectedMood || selectedKeywords.length > 0) {
      getImages(page);
    }
  }, [page, selectedMood, selectedKeywords]);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-400">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-dark dark:shadow-none">
        <div className="container mx-auto px-4 py-4 max-w-8xl">
          <div className="flex flex-col space-y-4">
            {/* Top Row - Responsive Layout */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Left Side Content */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  Your Gallery
                </h1>
                
                <div className="flex flex-wrap gap-2 items-center">
                  {selectedMood && (
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-300 rounded-full text-sm whitespace-nowrap">
                      {selectedMood}
                    </span>
                  )}
                  
                  {selectedKeywords && selectedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center animate-fade-in">
                      {selectedKeywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-300 rounded-full text-sm whitespace-nowrap"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side Content */}
              <div className="flex items-center gap-4 self-end sm:self-auto">
                <MusicPlayer 
                  selectedMood={selectedMood} 
                  selectedKeywords={selectedKeywords} 
                />
                
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-full 
                    bg-primary-100 hover:bg-primary-200 
                    dark:bg-dark-hover dark:hover:bg-dark-card 
                    text-primary-600 dark:text-primary-300 
                    transition-colors duration-200 
                    font-medium text-sm
                    shadow-sm dark:shadow-none
                    border border-primary-200 dark:border-primary-500/20
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-500/30
                    hover:scale-105 active:scale-95 transform
                    whitespace-nowrap"
                >
                  Reset Gallery
                </button>
                
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Grid - Masonry Layout */}
      <div className="container mx-auto px-4 py-8 max-w-8xl">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              ref={index === images.length - 1 ? lastImageRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="break-inside-avoid mb-4"
            >
              <div className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-card shadow-dark dark:shadow-none transition-all duration-400">
                <Image
                  src={image.urls.regular}
                  alt={image.alt_description || 'Mood image'}
                  width={image.width}
                  height={image.height}
                  className="w-full h-auto object-cover transition-transform duration-400 group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="#1f2937"/></svg>'
                  ).toString('base64')}`}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                  
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading States */}
        {loading && (
          <div className="flex justify-center mt-8">
            <div className="animate-pulse-slow rounded-full h-8 w-8 border-b-2 border-primary-500 dark:border-primary-400"></div>
          </div>
        )}

        {/* No More Images Message */}
        {!loading && !hasMore && images.length > 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No more images to load
          </div>
        )}
      </div>
    </div>
  );
}