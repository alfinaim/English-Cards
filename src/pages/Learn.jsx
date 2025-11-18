
import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/utils";
import { BookOpen, Settings, Trophy, RotateCcw } from 'lucide-react';
import FlashCard from "../components/flashcard/FlashCard";
import { motion, AnimatePresence } from 'framer-motion';
import { wordsStorage } from "../components/wordsStorage";

export default function Learn() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords(wordsStorage.getWords());
  }, []);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCompleted(false);
  };

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-blue-100">
            <BookOpen className="w-20 h-20 mx-auto text-blue-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">התחל ללמוד</h1>
            <p className="text-gray-600 text-lg mb-8" dir="rtl">
              עדיין אין לך מילים ללמוד. הוסף מילים חדשות כדי להתחיל!
            </p>
            <Link to={createPageUrl("ManageWords")}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 text-white">
                <Settings className="w-5 h-5 mr-2 אקס" />
                הוסף מילים
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-blue-100">
            <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">כל הכבוד!</h1>
            <p className="text-gray-600 text-lg mb-8" dir="rtl">
              סיימת לעבור על כל {words.length} המילים
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleRestart}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                התחל מחדש
              </Button>
              <Link to={createPageUrl("ManageWords")}>
                <Button variant="outline" className="w-full text-lg px-8 py-6">
                  <Settings className="w-5 h-5 mr-2" />
                  נהל מילים
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">לומדים אנגלית</h1>
            <p className="text-gray-600 mt-1" dir="rtl">
              מילה {currentIndex + 1} מתוך {words.length}
            </p>
          </div>
          <Link to={createPageUrl("ManageWords")}>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              נהל מילים
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-blue-600 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <FlashCard
              word={words[currentIndex]}
              onNext={handleNext}
              isLast={currentIndex === words.length - 1}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
