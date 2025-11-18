import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { RotateCcw } from 'lucide-react';

export default function FlashCard({ word, onNext, isLast }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => onNext(), 150);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="perspective-1000" style={{ perspective: "1000px" }}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-80 md:h-96"
        >
          {/* Front side - English */}
          <Card
            onClick={handleFlip}
            className="absolute inset-0 cursor-pointer flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 transition-colors shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden"
            }}
          >
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium mb-3">English</p>
              <p className="text-4xl md:text-5xl font-bold text-gray-900">
                {word.english}
              </p>
              <p className="text-sm text-gray-500 mt-6">לחץ כדי לראות תרגום</p>
            </div>
          </Card>

          {/* Back side - Hebrew */}
          <Card
            onClick={handleFlip}
            className="absolute inset-0 cursor-pointer flex items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-300 transition-colors shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="text-center w-full">
              <p className="text-sm text-indigo-600 font-medium mb-3">עברית</p>
              <p className="text-4xl md:text-5xl font-bold text-gray-900" dir="rtl">
                {word.hebrew}
              </p>
              <p className="text-sm text-gray-500 mt-6">לחץ כדי לחזור</p>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={handleFlip}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          הפוך כרטיס
        </Button>
        <Button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLast ? 'סיים' : 'הבא'}
        </Button>
      </div>
    </div>
  );
}