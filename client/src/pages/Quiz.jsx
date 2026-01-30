import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { submitQuiz } from '../redux/slices/quiz.thunk';
import { useModal } from '../hooks/useModal';
import Modal from '../components/ui/Modal';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, modalConfig, showModal, closeModal } = useModal();
  const { user } = useSelector(state => state.auth);

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
    console.log('=== QUIZ FORM SUBMIT INITIATED ===');
    console.log('User authenticated:', !!user);
    console.log('User data:', user);
    
    if (!user) {
      console.log('User not logged in, redirecting to login');
      navigate('/login', { state: { from: '/quiz' } });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Dispatching submitQuiz thunk');
      const result = await dispatch(submitQuiz(answers)).unwrap();
      
      console.log('Quiz submission unwrapped result:', result);
      
      if (!result.recommendations || result.recommendations.length === 0) {
        setIsSubmitting(false);
        showModal({
          title: 'No Recommendations Found',
          message: 'We couldn\'t find any products matching your criteria. Please try adjusting your preferences.',
          type: 'warning'
        });
        return;
      }
      
      console.log('Navigating to results with recommendations:', result.recommendations.length);
      navigate('/results', { 
        state: { 
          recommendations: result.recommendations 
        } 
      });
    } catch (error) {
      console.error('Quiz submission error caught:', error);
      
      // Check if it's a 401 error (not authenticated)
      if (error?.status === 401) {
        setIsSubmitting(false);
        navigate('/login', { state: { from: '/quiz' } });
        return;
      }
      
      setIsSubmitting(false);
      showModal({
        title: 'Submission Failed',
        message: error || 'Failed to get recommendations. Please try again.',
        type: 'error'
      });
    }
  };

  const currentQuestion = questions[step];

  // Defensive check: ensure currentQuestion exists
  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto mt-20 px-4">
        <p className="text-center text-red-600">Error loading question. Please refresh.</p>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-2xl mx-auto mt-12 md:mt-20 px-4 pb-20">
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
          className="space-y-6 md:space-y-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold">{currentQuestion.question}</h2>

          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {currentQuestion.options.map((option) => {
              const label = typeof option === 'string' ? option : option.label;
              const value = typeof option === 'string' ? option : option.value;
              const isSelected = currentQuestion.multiple
                ? answers.personality_traits.includes(value)
                : answers[currentQuestion.id] === value;

              return (
                <button
                  key={value}
                  onClick={() => handleOptionSelect(value)}
                  className={`p-4 md:p-6 text-left border-2 rounded-xl transition-all ${isSelected ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'
                    }`}
                >
                  <span className="capitalize text-sm md:text-base">{label}</span>
                </button>
              );
            })}
          </div>

          {currentQuestion.multiple && step < questions.length - 1 && (
            <button
              onClick={() => setStep(step + 1)}
              className="w-full py-3 md:py-4 bg-black text-white rounded-xl font-bold text-sm md:text-base"
            >
              Next
            </button>
          )}

          {step === questions.length - 1 && (
            <div className="space-y-4">
              <textarea
                placeholder="Any optional notes? (e.g., 'They love blue color')"
                className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl text-sm md:text-base"
                onChange={(e) => setAnswers({ ...answers, optional_note: e.target.value })}
                />
              <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 md:py-4 bg-black text-white rounded-xl font-bold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Finding Your Perfect Gifts...' : 'Find My Perfect Gift'}
            </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
      />
    </>
  );
};

export default Quiz;
