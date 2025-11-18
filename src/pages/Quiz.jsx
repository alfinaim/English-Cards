
import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/utils";
import { ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { wordsStorage } from "../components/wordsStorage";

export default function Quiz() {
  const [quizMode, setQuizMode] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [options, setOptions] = useState([]);
  const [words, setWords] = useState([]);

  useEffect(() => {
    const loadedWords = wordsStorage.getWords();
    setWords(loadedWords);
    if (loadedWords.length > 0 && !quizMode) {
      const shuffled = [...loadedWords].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
    }
  }, []);

  useEffect(() => {
    if (quizMode === 'multiple' && shuffledWords.length > 0 && currentIndex < shuffledWords.length) {
      generateOptions();
    }
  }, [currentIndex, quizMode, shuffledWords]);

  const generateOptions = () => {
    const currentWord = shuffledWords[currentIndex];
    const wrongOptions = shuffledWords
      .filter(w => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.hebrew);
    
    const allOptions = [...wrongOptions, currentWord.hebrew]
      .sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
  };

  const handleMultipleChoice = (selectedAnswer) => {
    const correct = selectedAnswer === shuffledWords[currentIndex].hebrew;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    setShowResult(true);
  };

  const handleTypingSubmit = () => {
    const correct = userAnswer.trim().toLowerCase() === shuffledWords[currentIndex].hebrew.toLowerCase();
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer('');
    setShowResult(false);
    setCompleted(false);
    setQuizMode(null);
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  };

  if (words.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <p className="text-lg text-gray-600 mb-4" dir="rtl">אין מילים לבחינה. הוסף מילים קודם!</p>
          <Link to={createPageUrl("ManageWords")}>
            <Button>הוסף מילים</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!quizMode) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to={createPageUrl("Learn")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">בחר סוג בחינה</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all p-8 text-center border-2 hover:border-blue-400"
                onClick={() => setQuizMode('multiple')}
              >
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold mb-2">בחירה מרובה</h2>
                <p className="text-gray-600" dir="rtl">בחר את התרגום הנכון מתוך 4 אפשרויות</p>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all p-8 text-center border-2 hover:border-purple-400"
                onClick={() => setQuizMode('typing')}
              >
                <div className="text-6xl mb-4">⌨️</div>
                <h2 className="text-2xl font-bold mb-2">הקלדת תרגום</h2>
                <p className="text-gray-600" dir="rtl">הקלד את התרגום הנכון</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / shuffledWords.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <Card className="p-12">
            <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">סיימת!</h1>
            <p className="text-2xl text-gray-700 mb-2" dir="rtl">
              ציון: {score}/{shuffledWords.length}
            </p>
            <p className="text-lg text-gray-600 mb-8">{percentage}%</p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleRestart} className="bg-blue-600 hover:bg-blue-700">
                בחינה חדשה
              </Button>
              <Link to={createPageUrl("Learn")}>
                <Button variant="outline" className="w-full">
                  חזור ללמידה
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentWord = shuffledWords[currentIndex];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {currentIndex + 1}/{shuffledWords.length}
          </Badge>
          <Badge className="bg-green-600 text-lg px-4 py-2">
            ציון: {score}
          </Badge>
        </div>

        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / shuffledWords.length) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 mb-6">
              <div className="text-center mb-8">
                <p className="text-sm text-gray-500 mb-2">תרגם לעברית:</p>
                <h2 className="text-5xl font-bold text-gray-900">{currentWord.english}</h2>
              </div>

              {quizMode === 'multiple' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {options.map((option, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className={`h-16 text-xl ${
                        showResult
                          ? option === currentWord.hebrew
                            ? 'bg-green-100 border-green-500'
                            : 'opacity-50'
                          : 'hover:bg-blue-50'
                      }`}
                      onClick={() => !showResult && handleMultipleChoice(option)}
                      disabled={showResult}
                      dir="rtl"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {quizMode === 'typing' && (
                <div className="space-y-4">
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !showResult && handleTypingSubmit()}
                    placeholder="הקלד את התרגום..."
                    className="text-2xl h-16 text-center"
                    dir="rtl"
                    disabled={showResult}
                  />
                  {!showResult && (
                    <Button
                      onClick={handleTypingSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!userAnswer.trim()}
                    >
                      בדוק
                    </Button>
                  )}
                </div>
              )}

              {showResult && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`mt-6 p-6 rounded-lg ${
                    isCorrect ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <p className="text-2xl font-bold text-green-800">נכון!</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8 text-red-600" />
                        <p className="text-2xl font-bold text-red-800">לא נכון</p>
                      </>
                    )}
                  </div>
                  {!isCorrect && (
                    <p className="text-center text-lg text-gray-700" dir="rtl">
                      התשובה הנכונה: <span className="font-bold">{currentWord.hebrew}</span>
                    </p>
                  )}
                  <Button
                    onClick={handleNext}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    {currentIndex === shuffledWords.length - 1 ? 'סיים' : 'הבא'}
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
