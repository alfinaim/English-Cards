import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft, Trophy, Timer, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpeedBattle({ words, onBack }) {
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (gameState === 'ready') {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
    }
  }, [gameState, words]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('finished');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setCurrentWordIndex(0);
    setUserAnswer('');
  };

  const checkAnswer = () => {
    const currentWord = shuffledWords[currentWordIndex];
    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.hebrew.toLowerCase();
    
    if (isCorrect) {
      const points = 10 + (combo * 2);
      setScore(score + points);
      setCombo(combo + 1);
    } else {
      setCombo(0);
    }
    
    setUserAnswer('');
    if (currentWordIndex < shuffledWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setCurrentWordIndex(0);
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
    }
  };

  if (gameState === 'ready') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <Card className="p-12">
            <Zap className="w-24 h-24 mx-auto text-orange-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">קרב מילים</h1>
            <p className="text-lg text-gray-600 mb-8" dir="rtl">
              יש לך 60 שניות לתרגם כמה שיותר מילים!<br />
              קומבו = נקודות בונוס!
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={startGame} className="bg-orange-600 hover:bg-orange-700 text-lg py-6">
                התחל לשחק!
              </Button>
              <Button variant="outline" onClick={onBack}>
                חזור
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <Card className="p-12">
            <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">הזמן נגמר!</h1>
            <p className="text-3xl text-orange-600 font-bold mb-8">
              {score} נקודות
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={startGame} className="bg-orange-600 hover:bg-orange-700">
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

  const currentWord = shuffledWords[currentWordIndex];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-4">
            <Badge 
              variant="outline" 
              className={`text-lg px-4 py-2 ${timeLeft < 10 ? 'bg-red-100 border-red-400' : ''}`}
            >
              <Timer className="w-4 h-4 mr-2" />
              {timeLeft}s
            </Badge>
            <Badge className="bg-orange-600 text-lg px-4 py-2">
              {score} נקודות
            </Badge>
            {combo > 0 && (
              <Badge className="bg-yellow-500 text-lg px-4 py-2 animate-pulse">
                🔥 x{combo}
              </Badge>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentWordIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-8 md:p-12 mb-6 bg-gradient-to-br from-orange-50 to-yellow-50">
              <div className="text-center mb-8">
                <p className="text-sm text-gray-500 mb-4">תרגם לעברית:</p>
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  {currentWord?.english}
                </h2>
                <div className="space-y-4">
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    placeholder="הקלד תרגום..."
                    className="text-2xl h-16 text-center"
                    dir="rtl"
                    autoFocus
                  />
                  <Button
                    onClick={checkAnswer}
                    className="w-full bg-orange-600 hover:bg-orange-700 h-14 text-lg"
                  >
                    שלח
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {combo > 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-orange-600">🔥 קומבו מדליק! 🔥</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}