
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Keyword {
  word: string;
  count: number;
}

interface TrendingKeywordsProps {
  selectedKeywords: string[];
  onKeywordSelect: (keyword: string) => void;
}

export default function TrendingKeywords({ selectedKeywords, onKeywordSelect }: TrendingKeywordsProps) {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/trending');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isMounted.current) {
          setKeywords(data.keywords || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted.current) {
          setKeywords([]);
          setError('Failed to load trending keywords');
          // Use optional chaining for safer error logging
          console.error('Error fetching trending keywords:', err?.message || err);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchKeywords();

    return () => {
      isMounted.current = false;
    };
  }, []);

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-primary-500 hover:text-primary-600 dark:text-primary-400"
        >
          Click here refresh the page
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center space-x-2">
        <div className="animate-pulse bg-gray-700 rounded-full h-8 w-20"></div>
        <div className="animate-pulse bg-gray-700 rounded-full h-8 w-24"></div>
        <div className="animate-pulse bg-gray-700 rounded-full h-8 w-16"></div>
      </div>
    );
  }

  return (
    <div className="mb-8 animate-fade-in">
      <h3 className="text-xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
        Trending Topics
      </h3>
      <div className="flex flex-wrap justify-center gap-2">
        {keywords.map((keyword, index) => (
          <motion.button
            key={keyword.word}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onKeywordSelect(keyword.word)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-400 animate-slide-up
              ${selectedKeywords.includes(keyword.word) 
                ? 'bg-primary-500 text-white shadow-dark dark:shadow-none' 
                : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-dark-hover'}
            `}
          >
            {keyword.word}
          </motion.button>
        ))}
      </div>
    </div>
  );
} 