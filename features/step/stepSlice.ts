import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StepState {
  currentStep: number;
  currentQuestion: number;
  questionsPerStep: number[];
  answers: { [key: string]: any };
}

const initialState: StepState = {
  currentStep: 0,
  currentQuestion: 0,
  questionsPerStep: [4, 2, 6, 2],
  answers: {}
};

const stepSlice = createSlice({
  name: 'step',
  initialState,
  reducers: {
    nextQuestion: (state) => {
      if (state.currentQuestion < state.questionsPerStep[state.currentStep] - 1) {
        state.currentQuestion += 1;
      } else if (state.currentStep < state.questionsPerStep.length - 1) {
        state.currentStep += 1;
        state.currentQuestion = 0;
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1;
      } else if (state.currentStep > 0) {
        state.currentStep -= 1;
        state.currentQuestion = state.questionsPerStep[state.currentStep] - 1;
      }
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      state.currentQuestion = 0;
    },
    setQuestion: (state, action: PayloadAction<number>) => {
      state.currentQuestion = action.payload;
    },
    setAnswer: (state, action: PayloadAction<{ id: string; value: any }>) => {
      state.answers[action.payload.id] = action.payload.value;
    },
    resetStep: (state) => {
      state.currentStep = 0;
      state.currentQuestion = 0;
      state.answers = {};
    },
  },
});

export const { nextQuestion, prevQuestion, setAnswer, resetStep } = stepSlice.actions;
export default stepSlice.reducer;