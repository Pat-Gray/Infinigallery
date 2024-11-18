'use client';

import { useState } from 'react';
import MoodSelector from './components/MoodSelector';
import TrendingKeywords from './components/TrendingKeywords';
import ImagePage from './components/ImagePage/ImagePage';
import ThemeToggle from './components/ThemeToggle';
import { motion } from 'framer-motion';
export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showImagePage, setShowImagePage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMoodSelect = (mood: any) => {
    try {
      if (selectedMood !== mood.id) {
        setSelectedMood(mood.id);
      } else {
        setSelectedMood(null);
      }
    } catch (err) {
      setError('Error selecting mood');
      console.error('Error in handleMoodSelect:', err);
    }
  };

  const handleKeywordSelect = (keyword: string) => {
    try {
      setSelectedKeywords(prev => {
        if (prev.includes(keyword)) {
          return prev.filter(k => k !== keyword);
        } else {
          return [...prev, keyword];
        }
      });
    } catch (err) {
      setError('Error selecting keyword');
      console.error('Error in handleKeywordSelect:', err);
    }
  };

  const handleSubmit = () => {
    try {
      setShowImagePage(true);
    } catch (err) {
      setError('Error submitting selection');
      console.error('Error in handleSubmit:', err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-dark-bg dark:to-dark-card">
        <div className="text-center p-8">
          <p className="text-red-500 dark:text-red-400 mb-4 font-montserrat">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-500 text-white rounded-full 
              hover:bg-primary-600 transition-all duration-300 
              font-poppins shadow-lg hover:shadow-xl
              transform hover:scale-105 active:scale-95"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-dark-bg dark:to-dark-card transition-all duration-500">
      {!showImagePage ? (
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div className="text-center md:text-left">
                <h1 className="font-montserrat font-bold text-5xl md:text-6xl 
                  bg-gradient-to-r from-primary-500 to-primary-700 
                  dark:from-primary-400 dark:to-primary-600 
                  text-transparent bg-clip-text 
                  mb-2"
                >
                  Infinigallery
                </h1>
                <p className="text-gray-600 dark:text-gray-300 font-poppins text-lg">
                  Visual inspiration from your mood, trending keywords from Reddit and matching music
                </p>
              </div>
              <ThemeToggle />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm 
                rounded-3xl shadow-2xl dark:shadow-primary-500/5 
                p-8 md:p-12 border border-gray-100 dark:border-gray-800"
            >
              <div className="space-y-12">
                <TrendingKeywords 
                  selectedKeywords={selectedKeywords}
                  onKeywordSelect={handleKeywordSelect}
                />
                <MoodSelector 
                  onMoodSelect={handleMoodSelect} 
                  selectedMood={selectedMood}
                />
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mt-12"
              >
                <button 
                  onClick={handleSubmit}
                  disabled={!selectedMood && selectedKeywords.length === 0}
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 
                    hover:from-primary-600 hover:to-primary-700
                    text-white rounded-full font-poppins font-medium text-lg
                    shadow-lg hover:shadow-xl
                    transform transition-all duration-300 hover:scale-105 
                    active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:hover:scale-100 disabled:hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50
                    dark:focus:ring-primary-500/30"
                >
                  Explore Images
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <ImagePage 
          selectedMood={selectedMood} 
          selectedKeywords={selectedKeywords}
        />
      )}
    </main>
  );
}