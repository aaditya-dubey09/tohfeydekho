import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuizHistory, clearQuizHistory } from '../redux/slices/quiz.thunk';
import Modal from '../components/ui/Modal';
import { useModal } from '../hooks/useModal';

const QuizHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isClearing, setIsClearing] = useState(false);
  const { user } = useSelector(state => state.auth);
  const { history, loading, error } = useSelector(state => state.quiz);
  const { isOpen, modalConfig, showModal, closeModal } = useModal();

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      console.log('User not logged in, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('Fetching quiz history for user:', user._id);
    dispatch(fetchQuizHistory());
  }, [user, navigate, dispatch]);

  const handleClearHistory = async () => {
    if (
      showModal({
        title: 'Confirm Clear History',
        message: 'Are you sure you want to clear your quiz history? This action cannot be undone.',
        type: 'warning',
        confirmText: 'Clear History',
        cancelText: 'Cancel',
      })
    ) {
      return;
    }

    setIsClearing(true);
    try {
      await dispatch(clearQuizHistory()).unwrap();
      // Refresh the history after clearing
      dispatch(fetchQuizHistory());
    } catch (error) {
      console.error('Failed to clear history:', error);
      alert('Failed to clear history. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  if (loading) return <div className="py-20 text-center max-w-4xl mx-auto">Loading...</div>;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 py-20">
        <h1 className="text-4xl font-black">Quiz History</h1>
        <div className="text-center py-20 bg-red-50 rounded-[3rem]">
          <p className="text-lg font-bold text-red-600">{error}</p>
          <Link to="/quiz" className="text-black underline font-bold mt-4 inline-block">Take a quiz</Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-4xl mx-auto space-y-12 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black">Quiz History</h1>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            disabled={isClearing}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={18} />
            {isClearing ? 'Clearing...' : 'Clear History'}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
          <p className="text-xl font-bold text-gray-500">No history found</p>
          <Link to="/quiz" className="text-black underline font-bold mt-4 inline-block">Take your first quiz</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map(item => (
            <div key={item._id} className="bg-white border-2 border-gray-100 p-6 md:p-8 rounded-[2rem] hover:border-black transition-colors">
              <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
                <div className="flex items-center gap-2 text-gray-500 font-bold text-sm uppercase tracking-widest">
                  <Calendar size={16} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className="bg-gray-100 px-4 py-1 rounded-full text-xs font-bold">
                  {item.recommended_products?.length || 0} Recommendations
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Relation</p>
                  <p className="font-bold capitalize">{item.relation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Occasion</p>
                  <p className="font-bold capitalize">{item.occasion}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Budget</p>
                  <p className="font-bold capitalize">{item.budget_segment}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Emotion</p>
                  <p className="font-bold capitalize">{item.emotion}</p>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-4">
                {item.recommended_products?.slice(0, 4).map(prod => (
                  <img 
                    key={prod._id} 
                    src={prod.images?.[0]?.url} 
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0" 
                    alt={prod.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64';
                    }}
                  />
                ))}
                {item.recommended_products?.length > 4 && (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 flex-shrink-0">
                    +{item.recommended_products.length - 4}
                  </div>
                )}
              </div>

              {item.recommended_products?.length > 0 && (
                <Link
                  to="/results"
                  state={{ recommendations: item.recommended_products }}
                  className="flex items-center gap-2 font-black text-lg hover:gap-4 transition-all"
                >
                  View Results Again <ArrowRight size={20} />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />
    </>
  );
};

export default QuizHistory;
