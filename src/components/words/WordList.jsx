import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Trash2, BookOpen } from 'lucide-react';
import { toast } from "sonner";
import { wordsStorage } from "../wordsStorage";

export default function WordList({ words, onWordDeleted }) {
  const handleDelete = (id) => {
    wordsStorage.deleteWord(id);
    toast.success('המילה נמחקה');
    if (onWordDeleted) onWordDeleted();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
        <CardTitle className="flex items-center gap-2 text-green-900">
          <BookOpen className="w-5 h-5" />
          המילים שלי ({words.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {words.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500" dir="rtl">עדיין אין מילים. הוסף את המילה הראשונה!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {words.map((word) => (
              <div
                key={word.id}
                className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all border"
              >
                <div className="flex flex-row flex-1 justify-between mr-6">
                  <p className="font-semibold text-lg text-gray-900">{word.english}</p>
                  <p className="text-gray-600" dir="rtl">{word.hebrew}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(word.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}