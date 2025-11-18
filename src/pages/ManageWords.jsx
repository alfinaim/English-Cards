
import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/utils";
import { ArrowLeft, GraduationCap } from 'lucide-react';
import WordUploadForm from "../components/words/WordUploadForm";
import WordList from "../components/words/WordList";
import FileUpload from "../components/words/FileUpload";
import { wordsStorage } from "../components/wordsStorage";

export default function ManageWords() {
  const [words, setWords] = useState([]);

  const loadWords = () => {
    setWords(wordsStorage.getWords());
  };

  useEffect(() => {
    loadWords();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Learn")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ניהול מילים</h1>
              <p className="text-gray-600 mt-1">הוסף ונהל את המילים שלך</p>
            </div>
          </div>
          <Link to={createPageUrl("Learn")}>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2 text-white">
              <GraduationCap className="w-5 h-5" />
              התחל ללמוד
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <WordUploadForm onWordAdded={loadWords} />
            </div>
            <div>
              <FileUpload onWordsAdded={loadWords} />
            </div>
          </div>

          <div>
            <WordList words={words} onWordDeleted={loadWords} />
          </div>
        </div>
      </div>
    </div>
  );
}
