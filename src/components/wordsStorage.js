const STORAGE_KEY = 'english_words';

export const wordsStorage = {
  getWords: () => {
    const words = localStorage.getItem(STORAGE_KEY);
    return words ? JSON.parse(words) : [];
  },

  addWord: (word) => {
    const words = wordsStorage.getWords();
    const newWord = {
      id: Date.now().toString(),
      ...word,
      created_date: new Date().toISOString()
    };
    words.push(newWord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    return newWord;
  },

  addWords: (wordsArray) => {
    const words = wordsStorage.getWords();
    const newWords = wordsArray.map(word => ({
      id: Date.now().toString() + Math.random(),
      ...word,
      created_date: new Date().toISOString()
    }));
    words.push(...newWords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    return newWords;
  },

  deleteWord: (id) => {
    const words = wordsStorage.getWords();
    const filtered = words.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};