import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "services/categoryService";

const initialState = {
  categories: [],
  loading: false,
  error: null,
  selectedCategory: null,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // Reset error
    clearError: (state) => {
      state.error = null;
    },
    // Set selected category
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    // Clear selected category
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    // ==========================================
    // FETCH ALL CATEGORIES
    // ==========================================
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
        state.error = null;
        console.log("✅ State updated with categories:", state.categories);
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Failed to fetch categories:", action.payload);
      });

    // ==========================================
    // CREATE CATEGORY
    // ==========================================
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Add new category to the beginning of the list
        state.categories.unshift(action.payload);
        state.error = null;
        console.log("✅ New category added to state");
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Failed to create category:", action.payload);
      });

    // ==========================================
    // UPDATE CATEGORY
    // ==========================================
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload;
        
        console.log("📦 Redux: Received updated category:", updatedCategory);
        
        // Find the category by ID
        const categoryId = updatedCategory.id || updatedCategory._id;
        const index = state.categories.findIndex(
          (cat) => (cat.id === categoryId) || (cat._id === categoryId)
        );
        
        if (index !== -1) {
          console.log(`📝 Redux: Updating category at index ${index}`);
          console.log(`📝 Redux: Old data:`, state.categories[index]);
          
          // Replace the entire category object
          state.categories[index] = updatedCategory;
          
          console.log(`📝 Redux: New data:`, state.categories[index]);
          console.log("✅ Redux: Category updated successfully in state");
        } else {
          console.error("❌ Redux: Category not found in state, ID:", categoryId);
          console.log("📋 Available categories:", state.categories.map(c => ({ id: c.id, _id: c._id, name: c.name })));
        }
        
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Failed to update category:", action.payload);
      });

    // ==========================================
    // DELETE CATEGORY
    // ==========================================
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        const deletedCategoryId = action.payload;
        
        // Remove the deleted category from the list
        state.categories = state.categories.filter(
          (cat) => cat.id !== deletedCategoryId && cat._id !== deletedCategoryId
        );
        
        state.error = null;
        console.log("✅ Category removed from state");
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Failed to delete category:", action.payload);
      });
  },
});

export const { clearError, setSelectedCategory, clearSelectedCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
