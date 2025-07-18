import React, { useState, useEffect } from 'react';
import { Check, X, RotateCcw, MessageCircle, Type, FileText, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

const ThaiTypingTrainer = () => {
  const [currentMode, setCurrentMode] = useState('word');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeStart, setTimeStart] = useState<number | null>(null);

  const wordExercises = [
    // Greetings & Basic
    { english: "hello", thai: "สวัสดี", pronunciation: "sà-wàt-dii" },
    { english: "thank you", thai: "ขอบคุณ", pronunciation: "kɔ̀ɔp-kun" },
    { english: "excuse me", thai: "ขอโทษ", pronunciation: "kɔ̌ɔ-tôot" },
    { english: "goodbye", thai: "ลาก่อน", pronunciation: "laa-gɔ̀ɔn" },
    { english: "please", thai: "กรุณา", pronunciation: "gà-rù-naa" },
    
    // Food & Drink
    { english: "delicious", thai: "อร่อย", pronunciation: "à-ròoi" },
    { english: "spicy", thai: "เผ็ด", pronunciation: "pèt" },
    { english: "sweet", thai: "หวาน", pronunciation: "wǎan" },
    { english: "coffee", thai: "กาแฟ", pronunciation: "gaa-fɛɛ" },
    { english: "rice", thai: "ข้าว", pronunciation: "kâao" },
    { english: "noodles", thai: "ก๋วยเตี๋ยว", pronunciation: "gǔai-dtǐao" },
    { english: "water", thai: "น้ำ", pronunciation: "náam" },
    { english: "fruit", thai: "ผลไม้", pronunciation: "pǒn-lá-máai" },
    
    // Places
    { english: "market", thai: "ตลาด", pronunciation: "tà-làat" },
    { english: "restaurant", thai: "ร้านอาหาร", pronunciation: "ráan-aa-hǎan" },
    { english: "school", thai: "โรงเรียน", pronunciation: "roong-rian" },
    { english: "hospital", thai: "โรงพยาบาล", pronunciation: "roong-pá-yaa-baan" },
    { english: "bank", thai: "ธนาคาร", pronunciation: "tá-naa-kaan" },
    { english: "hotel", thai: "โรงแรม", pronunciation: "roong-rɛɛm" },
    { english: "airport", thai: "สนามบิน", pronunciation: "sà-nǎam-bin" },
    
    // People & Family
    { english: "friend", thai: "เพื่อน", pronunciation: "pɯ̂an" },
    { english: "family", thai: "ครอบครัว", pronunciation: "krɔ̂ɔp-kruua" },
    { english: "mother", thai: "แม่", pronunciation: "mɛ̂ɛ" },
    { english: "father", thai: "พ่อ", pronunciation: "pɔ̂ɔ" },
    { english: "teacher", thai: "ครู", pronunciation: "kruu" },
    { english: "student", thai: "นักเรียน", pronunciation: "nák-rian" },
    
    // Adjectives
    { english: "beautiful", thai: "สวย", pronunciation: "sǔai" },
    { english: "expensive", thai: "แพง", pronunciation: "pɛɛng" },
    { english: "cheap", thai: "ถูก", pronunciation: "tùuk" },
    { english: "big", thai: "ใหญ่", pronunciation: "yài" },
    { english: "small", thai: "เล็ก", pronunciation: "lék" },
    { english: "good", thai: "ดี", pronunciation: "dii" },
    { english: "bad", thai: "แย่", pronunciation: "yɛ̂ɛ" },
    { english: "new", thai: "ใหม่", pronunciation: "mài" },
    { english: "old", thai: "เก่า", pronunciation: "gào" },
    
    // Actions
    { english: "work", thai: "ทำงาน", pronunciation: "tam-ngaan" },
    { english: "study", thai: "เรียน", pronunciation: "rian" },
    { english: "travel", thai: "เที่ยว", pronunciation: "tîao" },
    { english: "buy", thai: "ซื้อ", pronunciation: "sɯ́ɯ" },
    { english: "sell", thai: "ขาย", pronunciation: "kǎai" },
    { english: "eat", thai: "กิน", pronunciation: "gin" },
    { english: "drink", thai: "ดื่ม", pronunciation: "dɯ̀ɯm" },
    { english: "sleep", thai: "นอน", pronunciation: "nɔɔn" },
    
    // Time
    { english: "today", thai: "วันนี้", pronunciation: "wan-níi" },
    { english: "tomorrow", thai: "พรุ่งนี้", pronunciation: "prûng-níi" },
    { english: "yesterday", thai: "เมื่อวาน", pronunciation: "mɯ̂a-waan" },
    { english: "time", thai: "เวลา", pronunciation: "wee-laa" },
    { english: "morning", thai: "เช้า", pronunciation: "cháao" },
    { english: "evening", thai: "เย็น", pronunciation: "yen" }
  ];

  const sentenceExercises = [
    // Daily Activities
    { 
      prompt: "Complete: 'I want to go to the _____ (market)'",
      answer: "ฉันอยากไปตลาด",
      hint: "ฉันอยากไป_____"
    },
    {
      prompt: "Complete: 'This food is very _____ (delicious)'",
      answer: "อาหารนี้อร่อยมาก",
      hint: "อาหารนี้_____มาก"
    },
    {
      prompt: "Complete: 'Where is the _____ (school)?'",
      answer: "โรงเรียนอยู่ที่ไหน",
      hint: "_____อยู่ที่ไหน"
    },
    {
      prompt: "Complete: 'My _____ (friend) is Thai'",
      answer: "เพื่อนฉันเป็นคนไทย",
      hint: "_____ฉันเป็นคนไทย"
    },
    
    // Shopping & Money
    {
      prompt: "Complete: 'How much does this _____ (cost)?'",
      answer: "นี่ราคาเท่าไหร่",
      hint: "นี่_____เท่าไหร่"
    },
    {
      prompt: "Complete: 'This is too _____ (expensive)'",
      answer: "นี่แพงเกินไป",
      hint: "นี่_____เกินไป"
    },
    {
      prompt: "Complete: 'I want to _____ (buy) this'",
      answer: "ฉันอยากซื้อนี่",
      hint: "ฉันอยาก_____นี่"
    },
    
    // Food & Restaurants
    {
      prompt: "Complete: 'I want to _____ (eat) Thai food'",
      answer: "ฉันอยากกินอาหารไทย",
      hint: "ฉันอยาก_____อาหารไทย"
    },
    {
      prompt: "Complete: 'This is very _____ (spicy)'",
      answer: "นี่เผ็ดมาก",
      hint: "นี่_____มาก"
    },
    {
      prompt: "Complete: 'Can I have some _____ (water)?'",
      answer: "ขอน้ำหน่อยได้มั้ย",
      hint: "ขอ_____หน่อยได้มั้ย"
    },
    
    // Time & Weather
    {
      prompt: "Complete: 'What time is it _____?'",
      answer: "ตอนนี้กี่โมงแล้ว",
      hint: "ตอนนี้_____แล้ว"
    },
    {
      prompt: "Complete: 'Today the weather is _____ (hot)'",
      answer: "วันนี้อากาศร้อน",
      hint: "วันนี้อากาศ_____"
    },
    {
      prompt: "Complete: 'I will go _____ (tomorrow)'",
      answer: "ฉันจะไปพรุ่งนี้",
      hint: "ฉันจะไป_____"
    },
    
    // Travel & Directions
    {
      prompt: "Complete: 'Where is the _____ (hotel)?'",
      answer: "โรงแรมอยู่ที่ไหน",
      hint: "_____อยู่ที่ไหน"
    },
    {
      prompt: "Complete: 'I want to go to the _____ (airport)'",
      answer: "ฉันอยากไปสนามบิน",
      hint: "ฉันอยากไป_____"
    },
    {
      prompt: "Complete: 'How do I get to the _____ (bank)?'",
      answer: "ไปธนาคารยังไง",
      hint: "ไป_____ยังไง"
    },
    
    // Work & Study
    {
      prompt: "Complete: 'I _____ (work) at a company'",
      answer: "ฉันทำงานที่บริษัท",
      hint: "ฉัน_____ที่บริษัท"
    },
    {
      prompt: "Complete: 'I'm _____ (studying) Thai'",
      answer: "ฉันกำลังเรียนภาษาไทย",
      hint: "ฉันกำลัง_____ภาษาไทย"
    },
    {
      prompt: "Complete: 'My _____ (teacher) is very good'",
      answer: "ครูของฉันดีมาก",
      hint: "_____ของฉันดีมาก"
    },
    
    // Family & People
    {
      prompt: "Complete: 'My _____ (mother) cooks well'",
      answer: "แม่ฉันทำอาหารเก่ง",
      hint: "_____ฉันทำอาหารเก่ง"
    },
    {
      prompt: "Complete: 'I have a big _____ (family)'",
      answer: "ฉันมีครอบครัวใหญ่",
      hint: "ฉันมี_____ใหญ่"
    }
  ];

  const conversationExercises = [
    // Greetings & Basic Interactions
    {
      prompt: "Someone says: 'สวัสดีครับ อยู่ไหน' (Hello, where are you?)",
      sampleAnswer: "สวัสดีค่ะ อยู่บ้านค่ะ",
      context: "Respond politely saying where you are"
    },
    {
      prompt: "Someone says: 'ทำอะไรอยู่' (What are you doing?)",
      sampleAnswer: "กำลังทำงานอยู่ค่ะ",
      context: "Tell them what you're currently doing"
    },
    {
      prompt: "Someone says: 'ไปไหนมา' (Where did you go?)",
      sampleAnswer: "ไปตลาดมาค่ะ",
      context: "Say where you went"
    },
    {
      prompt: "Someone says: 'เป็นอย่างไงบ้าง' (How are you?)",
      sampleAnswer: "สบายดีค่ะ คุณเป็นอย่างไงบ้าง",
      context: "Respond and ask back"
    },
    
    // Food & Dining
    {
      prompt: "Someone says: 'อาหารอร่อยมั้ย' (Is the food delicious?)",
      sampleAnswer: "อร่อยมากค่ะ",
      context: "Respond about the food"
    },
    {
      prompt: "Someone says: 'กินข้าวแล้วยั่ง' (Have you eaten yet?)",
      sampleAnswer: "ยังเลยค่ะ คุณล่ะ",
      context: "Say you haven't eaten and ask back"
    },
    {
      prompt: "Someone says: 'เผ็ดเกินไปมั้ย' (Is it too spicy?)",
      sampleAnswer: "เผ็ดนิดหน่อยค่ะ แต่ทานได้",
      context: "Comment on the spiciness"
    },
    {
      prompt: "Someone says: 'อยากกินอะไร' (What do you want to eat?)",
      sampleAnswer: "อยากกินก๋วยเตี๋ยวค่ะ",
      context: "Say what food you want"
    },
    
    // Shopping & Money
    {
      prompt: "Someone says: 'นี่ราคาเท่าไหร่' (How much is this?)",
      sampleAnswer: "ร้อยบาทค่ะ",
      context: "Give a price"
    },
    {
      prompt: "Someone says: 'แพงไปมั้ย' (Is it too expensive?)",
      sampleAnswer: "แพงนิดหน่อยค่ะ ลดได้มั้ย",
      context: "Say it's a bit expensive and ask for discount"
    },
    {
      prompt: "Someone says: 'ซื้ออะไร' (What are you buying?)",
      sampleAnswer: "ซื้อผลไม้ค่ะ",
      context: "Say what you're buying"
    },
    
    // Work & Study
    {
      prompt: "Someone says: 'ทำงานหนักมั้ย' (Is work hard?)",
      sampleAnswer: "หนักนิดหน่อยค่ะ",
      context: "Respond about work difficulty"
    },
    {
      prompt: "Someone says: 'เรียนภาษาไทยมานานแล้วมั้ย' (Have you been studying Thai for long?)",
      sampleAnswer: "เรียนมาสองปีแล้วค่ะ",
      context: "Say how long you've been studying"
    },
    {
      prompt: "Someone says: 'ทำงานที่ไหน' (Where do you work?)",
      sampleAnswer: "ทำงานที่บริษัทค่ะ",
      context: "Say where you work"
    },
    
    // Travel & Transportation
    {
      prompt: "Someone says: 'ไปยังไงดี' (How should I go?)",
      sampleAnswer: "ไปรถไฟฟ้าดีกว่าค่ะ",
      context: "Suggest transportation"
    },
    {
      prompt: "Someone says: 'ไกลมั้ย' (Is it far?)",
      sampleAnswer: "ไม่ไกลมากค่ะ นั่งรถประมาณ 20 นาที",
      context: "Say the distance/time"
    },
    {
      prompt: "Someone says: 'เที่ยวไหนมา' (Where did you travel?)",
      sampleAnswer: "เที่ยวเชียงใหม่มาค่ะ",
      context: "Say where you traveled"
    },
    
    // Weather & Time
    {
      prompt: "Someone says: 'อากาศร้อนมั้ย' (Is the weather hot?)",
      sampleAnswer: "ร้อนมากค่ะ",
      context: "Comment on the weather"
    },
    {
      prompt: "Someone says: 'กี่โมงแล้ว' (What time is it?)",
      sampleAnswer: "สี่โมงเย็นแล้วค่ะ",
      context: "Tell the time"
    },
    {
      prompt: "Someone says: 'พรุ่งนี้ว่างมั้ย' (Are you free tomorrow?)",
      sampleAnswer: "ว่างค่ะ ทำไมคะ",
      context: "Say you're free and ask why"
    },
    
    // Personal & Family
    {
      prompt: "Someone says: 'มีพี่น้องกี่คน' (How many siblings do you have?)",
      sampleAnswer: "มีพี่สาวหนึ่งคนค่ะ",
      context: "Say how many siblings you have"
    },
    {
      prompt: "Someone says: 'ครอบครัวเป็นอย่างไง' (How is your family?)",
      sampleAnswer: "ครอบครัวสบายดีค่ะ",
      context: "Say your family is doing well"
    },
    
    // Opinions & Preferences
    {
      prompt: "Someone says: 'ชอบอาหารไทยมั้ย' (Do you like Thai food?)",
      sampleAnswer: "ชอบมากค่ะ โดยเฉพาะต้มยำกุ้ง",
      context: "Say you like it and mention a favorite dish"
    },
    {
      prompt: "Someone says: 'ประเทศไทยเป็นอย่างไง' (How is Thailand?)",
      sampleAnswer: "ดีมากค่ะ คนไทยใจดี",
      context: "Give a positive opinion about Thailand"
    }
  ];

  const getCurrentExercises = () => {
    switch(currentMode) {
      case 'word': return wordExercises;
      case 'sentence': return sentenceExercises;
      case 'conversation': return conversationExercises;
      default: return wordExercises;
    }
  };

  const currentExercises = getCurrentExercises();
  const exercise = currentExercises[currentExercise];

  const checkAnswer = () => {
    if (!timeStart) return;
    
    let isCorrect = false;
    
    if (currentMode === 'word') {
      isCorrect = userInput.trim() === (exercise as any).thai;
    } else if (currentMode === 'sentence') {
      isCorrect = userInput.trim() === (exercise as any).answer;
    } else {
      // For conversation, we'll be more lenient
      isCorrect = userInput.trim().length > 0;
    }
    
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    setShowResult(true);
  };

  const nextExercise = () => {
    setCurrentExercise((prev) => (prev + 1) % currentExercises.length);
    setUserInput('');
    setShowResult(false);
    setShowAnswer(false);
    setTimeStart(Date.now());
  };

  const prevExercise = () => {
    setCurrentExercise((prev) => (prev - 1 + currentExercises.length) % currentExercises.length);
    setUserInput('');
    setShowResult(false);
    setShowAnswer(false);
    setTimeStart(Date.now());
  };

  const resetStats = () => {
    setScore({ correct: 0, total: 0 });
    setCurrentExercise(0);
    setUserInput('');
    setShowResult(false);
    setShowAnswer(false);
    setTimeStart(Date.now());
  };

  useEffect(() => {
    if (!timeStart) {
      setTimeStart(Date.now());
    }
  }, [currentMode, currentExercise]);

  const renderExercise = () => {
    if (currentMode === 'word') {
      const wordExercise = exercise as any;
      return (
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {wordExercise.english}
          </div>
          <div className="text-sm text-gray-500 mb-4">
            Pronunciation: {wordExercise.pronunciation}
          </div>
          <div className="text-lg text-gray-700 mb-4">
            Type in Thai:
          </div>
        </div>
      );
    } else if (currentMode === 'sentence') {
      const sentenceExercise = exercise as any;
      return (
        <div className="text-center">
          <div className="text-lg text-gray-700 mb-4">
            {sentenceExercise.prompt}
          </div>
          <div className="text-sm text-blue-500 mb-4">
            Hint: {sentenceExercise.hint}
          </div>
        </div>
      );
    } else {
      const conversationExercise = exercise as any;
      return (
        <div className="text-center">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="text-lg font-medium text-blue-800 mb-2">
              {conversationExercise.prompt}
            </div>
            <div className="text-sm text-blue-600">
              {conversationExercise.context}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderResult = () => {
    if (currentMode === 'word') {
      const wordExercise = exercise as any;
      const isCorrect = userInput.trim() === wordExercise.thai;
      return (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? <Check className="text-green-600" /> : <X className="text-red-600" />}
            <span className={isCorrect ? 'text-green-800' : 'text-red-800'}>
              {isCorrect ? 'Correct!' : 'Not quite...'}
            </span>
          </div>
          {!isCorrect && (
            <div className="text-sm">
              <div>Your answer: <span className="font-thai">{userInput}</span></div>
              <div>Correct answer: <span className="font-thai text-green-600">{wordExercise.thai}</span></div>
            </div>
          )}
        </div>
      );
    } else if (currentMode === 'sentence') {
      const sentenceExercise = exercise as any;
      const isCorrect = userInput.trim() === sentenceExercise.answer;
      return (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? <Check className="text-green-600" /> : <X className="text-red-600" />}
            <span className={isCorrect ? 'text-green-800' : 'text-red-800'}>
              {isCorrect ? 'Perfect!' : 'Keep practicing!'}
            </span>
          </div>
          {!isCorrect && (
            <div className="text-sm">
              <div>Your answer: <span className="font-thai">{userInput}</span></div>
              <div>Correct answer: <span className="font-thai text-green-600">{sentenceExercise.answer}</span></div>
            </div>
          )}
        </div>
      );
    } else {
      const conversationExercise = exercise as any;
      return (
        <div className="p-4 rounded-lg bg-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Check className="text-blue-600" />
            <span className="text-blue-800">Great response!</span>
          </div>
          <div className="text-sm">
            <div>Your answer: <span className="font-thai">{userInput}</span></div>
            <div>Sample answer: <span className="font-thai text-blue-600">{conversationExercise.sampleAnswer}</span></div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thai Typing Trainer</h1>
        <div className="text-sm text-gray-600">
          Score: {score.correct}/{score.total}
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setCurrentMode('word'); setCurrentExercise(0); setUserInput(''); setShowResult(false); setShowAnswer(false); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentMode === 'word' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <Type size={16} />
          Words
        </button>
        <button
          onClick={() => { setCurrentMode('sentence'); setCurrentExercise(0); setUserInput(''); setShowResult(false); setShowAnswer(false); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentMode === 'sentence' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <FileText size={16} />
          Sentences
        </button>
        <button
          onClick={() => { setCurrentMode('conversation'); setCurrentExercise(0); setUserInput(''); setShowResult(false); setShowAnswer(false); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentMode === 'conversation' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <MessageCircle size={16} />
          Conversation
        </button>
      </div>

      {/* Exercise Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevExercise}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        
        <div className="text-sm text-gray-600 font-medium">
          Exercise {currentExercise + 1} of {currentExercises.length}
        </div>
        
        <button
          onClick={nextExercise}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Exercise */}
      <div className="mb-6">
        {renderExercise()}
        
        {/* Show/Hide Answer Button - only for word and sentence modes */}
        {(currentMode === 'word' || currentMode === 'sentence') && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
          </div>
        )}
        
        {/* Answer Display */}
        {showAnswer && (currentMode === 'word' || currentMode === 'sentence') && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <div className="text-lg font-thai text-yellow-800">
              {currentMode === 'word' ? (exercise as any).thai : (exercise as any).answer}
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !showResult && checkAnswer()}
            className="w-full p-3 border border-gray-300 rounded-lg text-lg font-thai focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your answer in Thai..."
            disabled={showResult}
          />
        </div>
      </div>

      {/* Result */}
      {showResult && (
        <div className="mb-6">
          {renderResult()}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {!showResult ? (
          <button
            onClick={checkAnswer}
            disabled={!userInput.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={nextExercise}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Next Exercise
          </button>
        )}
        
        <button
          onClick={resetStats}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Progress */}
      <div className="mt-6 text-center text-sm text-gray-500">
        {currentMode === 'word' && 'Word Practice'}
        {currentMode === 'sentence' && 'Sentence Completion'}
        {currentMode === 'conversation' && 'Conversation Practice'}
      </div>
    </div>
  );
};

export default ThaiTypingTrainer;
