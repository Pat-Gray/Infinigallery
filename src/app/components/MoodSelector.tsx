'use client';

import { motion } from 'framer-motion';
import { 
  FaSmile, FaSadTear, FaHeart, FaBolt, FaLeaf, FaMoon, FaClock, FaMountain, FaWater 
} from 'react-icons/fa';

interface MoodOption {
  id: string;
  icon: JSX.Element;
  label: string;
  lightColor: string;
  darkColor: string;
  keywords: string[];
}

const moodOptions: MoodOption[] = [
  {
    id: 'happy',
    icon: <FaSmile className="text-2xl" />,
    label: 'Happy',
    lightColor: 'bg-yellow-400 hover:bg-yellow-500',
    darkColor: 'dark:bg-yellow-500/50 dark:hover:bg-yellow-500/70',
    keywords: ['joy', 'happy', 'cheerful', 'bright']
  },
  {
    id: 'sad',
    icon: <FaSadTear className="text-2xl" />,
    label: 'Melancholic',
    lightColor: 'bg-blue-400 hover:bg-blue-500',
    darkColor: 'dark:bg-blue-500/50 dark:hover:bg-blue-500/70',
    keywords: ['sad', 'rain', 'melancholy', 'blue']
  },
  {
    id: 'romantic',
    icon: <FaHeart className="text-2xl" />,
    label: 'Romantic',
    lightColor: 'bg-pink-400 hover:bg-pink-500',
    darkColor: 'dark:bg-pink-500/50 dark:hover:bg-pink-500/70',
    keywords: ['love', 'romantic', 'passion', 'heart']
  },
  {
    id: 'energetic',
    icon: <FaBolt className="text-2xl" />,
    label: 'Energetic',
    lightColor: 'bg-orange-400 hover:bg-orange-500',
    darkColor: 'dark:bg-orange-500/50 dark:hover:bg-orange-500/70',
    keywords: ['energy', 'power', 'dynamic', 'vibrant']
  },
  {
    id: 'peaceful',
    icon: <FaLeaf className="text-2xl" />,
    label: 'Peaceful',
    lightColor: 'bg-green-400 hover:bg-green-500',
    darkColor: 'dark:bg-green-500/50 dark:hover:bg-green-500/70',
    keywords: ['calm', 'peace', 'nature', 'tranquil']
  },
  {
    id: 'mysterious',
    icon: <FaMoon className="text-2xl" />,
    label: 'Mysterious',
    lightColor: 'bg-purple-400 hover:bg-purple-500',
    darkColor: 'dark:bg-purple-500/50 dark:hover:bg-purple-500/70',
    keywords: ['mystery', 'dark', 'enigmatic', 'night']
  },
  {
    id: 'nostalgic',
    icon: <FaClock className="text-2xl" />,
    label: 'Nostalgic',
    lightColor: 'bg-amber-400 hover:bg-amber-500',
    darkColor: 'dark:bg-amber-500/50 dark:hover:bg-amber-500/70',
    keywords: ['vintage', 'retro', 'memories', 'old']
  },
  {
    id: 'epic',
    icon: <FaMountain className="text-2xl" />,
    label: 'Epic',
    lightColor: 'bg-red-400 hover:bg-red-500',
    darkColor: 'dark:bg-red-500/50 dark:hover:bg-red-500/70',
    keywords: ['epic', 'grand', 'majestic', 'dramatic']
  },
  {
    id: 'serene',
    icon: <FaWater className="text-2xl" />,
    label: 'Serene',
    lightColor: 'bg-cyan-400 hover:bg-cyan-500',
    darkColor: 'dark:bg-cyan-500/50 dark:hover:bg-cyan-500/70',
    keywords: ['serene', 'ocean', 'flowing', 'gentle']
  }
];

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodOption) => void;
  selectedMood: string | null;
}

export default function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white transition-colors duration-200">
        How are you feeling today?
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {moodOptions.map((mood) => (
          <motion.button
            key={mood.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMoodSelect(mood)}
            className={`
              ${mood.lightColor} ${mood.darkColor}
              p-6 rounded-xl
              flex flex-col items-center justify-center gap-3
              transition-all duration-300
              ${selectedMood === mood.id 
                ? 'ring-4 ring-primary-400 dark:ring-primary-500/50' 
                : 'hover:shadow-lg dark:hover:shadow-black/30'}
              backdrop-blur-sm
              text-white dark:text-white/90
              shadow-md dark:shadow-none
              dark:backdrop-blur-sm
              group
            `}
          >
            <div className="transform transition-transform duration-200 group-hover:scale-110">
              {mood.icon}
            </div>
            <span className="font-medium text-white dark:text-white/90 tracking-wide">
              {mood.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}