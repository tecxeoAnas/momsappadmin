import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllComingSoon,
  getComingSoonById,
  createComingSoon,
  updateComingSoon,
  deleteComingSoon,
} from '../../services/comingSoonService';

const comingSoonSlice = createSlice({
  name: 'comingSoon',
  initialState: {
    features: [],
    loading: false,
    error: null,
    selectedFeature: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedFeature: (state, action) => {
      state.selectedFeature = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all features
    builder
      .addCase(fetchAllComingSoon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllComingSoon.fulfilled, (state, action) => {
        state.loading = false;
        state.features = action.payload;
      })
      .addCase(fetchAllComingSoon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get feature by ID
    builder
      .addCase(getComingSoonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComingSoonById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFeature = action.payload;
      })
      .addCase(getComingSoonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create feature
    builder
      .addCase(createComingSoon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComingSoon.fulfilled, (state, action) => {
        state.loading = false;
        state.features.push(action.payload);
      })
      .addCase(createComingSoon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update feature
    builder
      .addCase(updateComingSoon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComingSoon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.features.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.features[index] = action.payload;
        }
      })
      .addCase(updateComingSoon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete feature
    builder
      .addCase(deleteComingSoon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComingSoon.fulfilled, (state, action) => {
        state.loading = false;
        state.features = state.features.filter((f) => f.id !== action.payload);
      })
      .addCase(deleteComingSoon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedFeature } = comingSoonSlice.actions;
export default comingSoonSlice.reducer;
