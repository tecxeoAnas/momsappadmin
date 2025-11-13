import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
} from '../../services/promptService';

const initialState = {
  prompts: [],
  loading: false,
  error: null,
  selectedPrompt: null,
};

const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPrompt: (state, action) => {
      state.selectedPrompt = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Prompts
    builder
      .addCase(fetchAllPrompts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPrompts.fulfilled, (state, action) => {
        state.loading = false;
        state.prompts = action.payload;
      })
      .addCase(fetchAllPrompts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Prompt By ID
    builder
      .addCase(getPromptById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPromptById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPrompt = action.payload;
      })
      .addCase(getPromptById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Prompt
    builder
      .addCase(createPrompt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrompt.fulfilled, (state, action) => {
        state.loading = false;
        state.prompts.push(action.payload);
      })
      .addCase(createPrompt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Prompt
    builder
      .addCase(updatePrompt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrompt.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.prompts.findIndex((prompt) => prompt.id === action.payload.id);
        if (index !== -1) {
          state.prompts[index] = action.payload;
        }
      })
      .addCase(updatePrompt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Prompt
    builder
      .addCase(deletePrompt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePrompt.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out deleted prompt
        state.prompts = state.prompts.filter((prompt) => prompt.id !== action.payload);
      })
      .addCase(deletePrompt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedPrompt } = promptSlice.actions;
export default promptSlice.reducer;
