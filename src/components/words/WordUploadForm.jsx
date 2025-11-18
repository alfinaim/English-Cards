import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, Upload } from 'lucide-react';
import { toast } from "sonner";
import { wordsStorage } from "../wordsStorage";

export default function WordUploadForm({ onWordAdded }) {
  const [english, setEnglish] = useState('');
  const [hebrew, setHebrew] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!english.trim() || !hebrew.trim()) {
      toast.error('נא למלא את שני השדות');
      return;
    }
    setIsAdding(true);
    wordsStorage.addWord({ english: english.trim(), hebrew: hebrew.trim() });
    setEnglish('');
    setHebrew('');
    toast.success('המילה נוספה בהצלחה!');
    setIsAdding(false);
    if (onWordAdded) onWordAdded();
  };

  return (
    <Card className="shadow-lg border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Upload className="w-5 h-5" />
          הוסף מילה חדשה
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="english" className="text-sm font-medium">
              English Word
            </Label>
            <Input
              id="english"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="Enter English word..."
              className="text-lg"
              disabled={isAdding}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hebrew" className="text-sm font-medium">
              תרגום לעברית
            </Label>
            <Input
              id="hebrew"
              value={hebrew}
              onChange={(e) => setHebrew(e.target.value)}
              placeholder="הכנס תרגום..."
              className="text-lg"
              dir="rtl"
              disabled={isAdding}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-base h-11 text-white"
            disabled={isAdding}
          >
            <Plus className="w-5 h-5 mr-2" />
            {isAdding ? 'מוסיף...' : 'הוסף מילה'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}