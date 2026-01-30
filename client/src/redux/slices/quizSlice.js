import { createSlice } from '@reduxjs/toolkit';
import { submitQuiz, fetchQuizHistory, clearQuizHistory } from './quiz.thunk';

const initialState = {
  currentRecommendations: [],
  history: [],
  loading: false,
  error: null,
  lastQuizResultId: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearRecommendations: (state) => {
      state.currentRecommendations = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Submit quiz
    builder
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecommendations = action.payload.recommendations;
        state.lastQuizResultId = action.payload.quizResultId;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch quiz history
    builder
      .addCase(fetchQuizHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchQuizHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Clear quiz history
    builder
      .addCase(clearQuizHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearQuizHistory.fulfilled, (state) => {
        state.loading = false;
        state.history = [];
      })
      .addCase(clearQuizHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearRecommendations, clearError } = quizSlice.actions;
export default quizSlice.reducer;
