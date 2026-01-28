import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizAPI } from '../services/api';

const questions = [
  {
    id: 'relation',
    question: 'Who are you buying for?',
    options: ['friend', 'partner', 'parent', 'colleague', 'universal']
  },
  {
    id: 'occasion',
    question: 'What is the occasion?',
    options: ['birthday', 'anniversary', 'graduation', 'wedding', 'just because']
  },
  {
    id: 'budget_segment',
    question: 'What is your budget range?',
    options: [
      { label: 'Budget Friendly (Under ₹1000)', value: 'low' },
      { label: 'Mid Range (₹1000 - ₹5000)', value: 'medium' },
      { label: 'Premium (Above ₹5000)', value: 'high' }
    ]
  },
  {
    id: 'emotion',
    question: 'What emotion should it convey?',
    options: ['romantic', 'funny', 'thoughtful', 'practical', 'luxurious']
  },
  {
    id: 'personality_traits',
    question: 'Select personality traits (multiple)',
    multiple: true,
    options: ['techie', 'artist', 'minimalist', 'adventurer', 'foodie']
  }
];

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    relation: '',
    occasion: '',
    budget_segment: '',
    emotion: '',
    personality_traits: [],
    optional_note: ''
  });
  const navigate = useNavigate();

  const handleOptionSelect = (value) => {
    const currentQuestion = questions[step];
    if (currentQuestion.multiple) {
      const newTraits = answers.personality_traits.includes(value)
        ? answers.personality_traits.filter(t => t !== value)
        : [...answers.personality_traits, value];
      setAnswers({ ...answers, personality_traits: newTraits });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });
      if (step < questions.length - 1) {
        setStep(step + 1);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const { data } = await quizAPI.submit(answers);
      navigate('/results', { state: { recommendations: data.data } });
    } catch (error) {
      console.error('Quiz submission failed', error);
      alert('Failed to get recommendations. Please try again.');
    }
  };

  const currentQuestion = questions[step];

  return (
    <div className="max-w-2xl mx-auto mt-20 px-4">
      <div className="mb-8 bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-black h-full transition-all duration-300"
          style={{ width: `${((step + 1) / (questions.length + 1)) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold">{currentQuestion.question}</h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option) => {
              const label = typeof option === 'string' ? option : option.label;
              const value = typeof option === 'string' ? option : option.value;
              const isSelected = currentQuestion.multiple
                ? answers.personality_traits.includes(value)
                : answers.budget_segment === value;

              return (
                <button
                  key={value}
                  onClick={() => handleOptionSelect(value)}
                  className={`p-6 text-left border-2 rounded-xl transition-all ${isSelected ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'
                    }`}
                >
                  <span className="capitalize">{label}</span>
                </button>
              );
            })}
          </div>

          {currentQuestion.multiple && (
            <button
              onClick={() => setStep(step + 1)}
              className="w-full py-4 bg-black text-white rounded-xl font-bold"
            >
              Next
            </button>
          )}

          {step === questions.length - 1 && !currentQuestion.multiple && (
            <div className="space-y-4">
              <textarea
                placeholder="Any optional notes? (e.g., 'They love blue color')"
                className="w-full p-4 border-2 border-gray-200 rounded-xl"
                onChange={(e) => setAnswers({ ...answers, optional_note: e.target.value })}
              />
              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-black text-white rounded-xl font-bold"
              >
                Find My Perfect Gift
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
