import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { quizAPI } from '../services/api';

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await quizAPI.getHistory();
        setHistory(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <h1 className="text-4xl font-black">Quiz History</h1>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
          <p className="text-xl font-bold text-gray-500">No history found</p>
          <Link to="/quiz" className="text-black underline font-bold mt-4 inline-block">Take your first quiz</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map(item => (
            <div key={item._id} className="bg-white border-2 border-gray-100 p-8 rounded-[2rem] hover:border-black transition-colors">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 text-gray-500 font-bold text-sm uppercase tracking-widest">
                  <Calendar size={16} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className="bg-gray-100 px-4 py-1 rounded-full text-xs font-bold">
                  {item.recommended_products.length} Recommendations
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
                {item.recommended_products.slice(0, 4).map(prod => (
                  <img key={prod._id} src={prod.images[0]?.url} className="w-16 h-16 rounded-xl object-cover border border-gray-100" alt={prod.name} />
                ))}
                {item.recommended_products.length > 4 && (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    +{item.recommended_products.length - 4}
                  </div>
                )}
              </div>

              <Link
                to="/results"
                state={{ recommendations: item.recommended_products }}
                className="flex items-center gap-2 font-black text-lg hover:gap-4 transition-all"
              >
                View Results Again <ArrowRight size={20} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
