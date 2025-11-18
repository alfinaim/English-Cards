
import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/utils";
import { ArrowLeft } from 'lucide-react';
import { Card } from "../components/ui/card";
import { motion } from 'framer-motion';
import MemoryGame from "../components/games/MemoryGame";
import SpeedBattle from "../components/games/SpeedBattle";
import { wordsStorage } from "../components/wordsStorage";

export default function Games() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords(wordsStorage.getWords());
  }, []);

  if (words.length < 4) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <p className="text-lg text-gray-600 mb-4" dir="rtl">צריך לפחות 4 מילים כדי לשחק. הוסף עוד מילים!</p>
          <Link to={createPageUrl("ManageWords")}>
            <Button>הוסף מילים</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (selectedGame === 'memory') {
    return <MemoryGame words={words} onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'speed') {
    return <SpeedBattle words={words} onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Learn")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">בחר משחק</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all p-8 text-center border-2 hover:border-purple-400"
              onClick={() => setSelectedGame('memory')}
            >
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="text-2xl font-bold mb-2">משחק זיכרון</h2>
              <p className="text-gray-600" dir="rtl">מצא את הזוגות התואמים</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all p-8 text-center border-2 hover:border-orange-400"
              onClick={() => setSelectedGame('speed')}
            >
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold mb-2">קרב מילים</h2>
              <p className="text-gray-600" dir="rtl">כמה מילים תוכל לתרגם בזמן מוגבל?</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
