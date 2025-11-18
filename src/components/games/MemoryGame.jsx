import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MemoryGame({ words, onBack }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [words]);

  const initializeGame = () => {
    const selectedWords = words.sort(() => Math.random() - 0.5).slice(0, 8);
    const gameCards = [];
    
    selectedWords.forEach((word, idx) => {
      gameCards.push({ id: `en-${idx}`, content: word.english, type: 'english', pairId: idx });
      gameCards.push({ id: `he-${idx}`, content: word.hebrew, type: 'hebrew', pairId: idx });
    });
    
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsCompleted(false);
  };

  const handleCardClick = (cardId) => {
    if (flipped.length === 2 || flipped.includes(cardId) || matched.includes(cardId)) {
      return;
    }

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const card1 = cards.find(c => c.id === newFlipped[0]);
      const card2 = cards.find(c => c.id === newFlipped[1]);

      if (card1.pairId === card2.pairId) {
        setMatched([...matched, card1.id, card2.id]);
        setFlipped([]);
        
        if (matched.length + 2 === cards.length) {
          setTimeout(() => setIsCompleted(true), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <Card className="p-12">
            <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">כל הכבוד!</h1>
            <p className="text-xl text-gray-700 mb-8" dir="rtl">
              סיימת ב-{moves} מהלכים
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={initializeGame} className="bg-purple-600 hover:bg-purple-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                שחק שוב
              </Button>
              <Button variant="outline" onClick={onBack}>
                חזור לתפריט
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              מהלכים: {moves}
            </Badge>
            <Badge className="bg-purple-600 text-lg px-4 py-2">
              זוגות: {matched.length / 2}/{cards.length / 2}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 md:gap-4">
          <AnimatePresence>
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
              const isMatched = matched.includes(card.id);
              
              return (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="aspect-square"
                >
                  <Card
                    onClick={() => handleCardClick(card.id)}
                    className={`w-full h-full cursor-pointer flex items-center justify-center p-2 transition-all ${
                      isMatched 
                        ? 'bg-green-100 border-green-400' 
                        : isFlipped 
                        ? 'bg-blue-50 border-blue-400' 
                        : 'bg-gradient-to-br from-purple-100 to-indigo-100 hover:shadow-md'
                    }`}
                  >
                    {isFlipped ? (
                      <p 
                        className={`font-bold text-center ${
                          card.content.length > 8 ? 'text-sm' : 'text-lg md:text-xl'
                        }`}
                        dir={card.type === 'hebrew' ? 'rtl' : 'ltr'}
                      >
                        {card.content}
                      </p>
                    ) : (
                      <div className="text-4xl">❓</div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}