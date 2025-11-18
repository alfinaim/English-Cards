import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { FileText, Upload, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { Alert, AlertDescription } from "../ui/alert";
import { wordsStorage } from "../wordsStorage";

export default function FileUpload({ onWordsAdded }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const parseTextFile = (text) => {
    const lines = text.split('\n');
    const words = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      const separators = [' - ', ' – ', ' — ', '\t', '  '];
      let parts = null;
      
      for (const sep of separators) {
        if (trimmed.includes(sep)) {
          parts = trimmed.split(sep).map(p => p.trim());
          break;
        }
      }
      
      if (!parts && trimmed.includes('-')) {
        parts = trimmed.split('-').map(p => p.trim());
      }
      
      if (parts && parts.length >= 2 && parts[0] && parts[1]) {
        words.push({
          english: parts[0],
          hebrew: parts.slice(1).join(' ')
        });
      }
    }
    
    return words;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
      setError('נא להעלות קובץ טקסט (.txt) או CSV בלבד');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const words = parseTextFile(text);
      
      if (words.length === 0) {
        setError('לא נמצאו מילים בפורמט הנכון. וודא שכל שורה היא בפורמט: english - עברית');
        setIsProcessing(false);
        return;
      }
      
      wordsStorage.addWords(words);
      toast.success(`${words.length} מילים נוספו בהצלחה!`);
      setIsProcessing(false);
      if (onWordsAdded) onWordsAdded();
    } catch (err) {
      setError('שגיאה בקריאת הקובץ. נסה שוב');
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-lg border-indigo-100">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
        <CardTitle className="flex items-center gap-2 text-indigo-900">
          <FileText className="w-5 h-5" />
          העלה קובץ מילים
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-4" dir="rtl">
              העלה קובץ טקסט עם מילים בפורמט:<br />
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                apple - תפוח<br />
                book - ספר<br />
                a dead end - מבוי סתום
              </span>
            </p>
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label htmlFor="file-upload">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                disabled={isProcessing}
                asChild
              >
                <span>
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2" />
                      מעבד...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      בחר קובץ
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" dir="rtl">
            <p className="text-sm text-blue-900 font-medium mb-2">💡 טיפים:</p>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>כל שורה צריכה להכיל מילה באנגלית ותרגום לעברית</li>
              <li>הפרד בין המילים עם " - " (מקף עם רווחים)</li>
              <li>לדוגמה: "dog - כלב" או "a dead end - מבוי סתום"</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}