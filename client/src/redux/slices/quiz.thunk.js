import { createAsyncThunk } from '@reduxjs/toolkit';
import { quizAPI } from '../../services/api';

// Submit quiz and get recommendations
export const submitQuiz = createAsyncThunk(
  'quiz/submit',
  async (quizData, { rejectWithValue }) => {
    try {
      console.log('=== QUIZ SUBMISSION START ===');
      console.log('Quiz data being submitted:', quizData);
      
      const { data } = await quizAPI.submit(quizData);
      
      console.log('=== QUIZ SUBMISSION SUCCESS ===');
      console.log('Response data:', data);
      console.log('Recommendations received:', data.data?.length || 0);
      console.log('Quiz result ID:', data.quizResultId);
      
      return {
        recommendations: data.data,
        matchType: data.matchType,
        noPerfectMatch: data.noPerfectMatch,
        quizResultId: data.quizResultId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('=== QUIZ SUBMISSION ERROR ===');
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      
      // Check if 401 (unauthorized)
      if (error.response?.status === 401) {
        return rejectWithValue({
          message: 'You must be logged in to submit the quiz',
          status: 401
        });
      }
      
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit quiz. Please try again.'
      );
    }
  }
);

// Fetch quiz history
export const fetchQuizHistory = createAsyncThunk(
  'quiz/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching quiz history');
      const { data } = await quizAPI.getHistory();
      console.log('Quiz history fetched:', data.data?.length || 0);
      return data.data;
    } catch (error) {
      console.error('Error fetching quiz history:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz history');
    }
  }
);

// Clear quiz history
export const clearQuizHistory = createAsyncThunk(
  'quiz/clearHistory',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Clearing quiz history');
      const { data } = await quizAPI.clearHistory();
      console.log('Quiz history cleared:', data.deletedCount, 'entries');
      return data;
    } catch (error) {
      console.error('Error clearing quiz history:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to clear quiz history');
    }
  }
);
