import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import api from "configs/UniversityConfig";

// ============================================
// CATEGORY THUNKS - Sab CRUD Operations
// ============================================

/**
 * Fetch all categories
 * GET /api/momreset-category/admin/all
 */
export const fetchAllCategories = createAsyncThunk(
  "category/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📥 Fetching all categories...");
      const response = await api.get("/api/momreset-category/admin/all");
      
      const categories = response?.data?.data || response?.data?.categories || [];
      console.log("✅ Categories fetched:", categories);
      
      return categories;
    } catch (error) {
      console.error("❌ Error fetching categories:", error.message);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch categories"
      );
    }
  }
);

/**
 * Create new category
 * POST /api/momreset-category/admin/create
 */
export const createCategory = createAsyncThunk(
  "category/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      console.log("📤 Creating category:", categoryData);
      
      const payload = {
        name: categoryData?.name,
        status: categoryData?.status || "active",
      };

      // Add audio URLs if provided (backend expects 'audioUrls' with 's')
      if (categoryData?.audioUrl && categoryData.audioUrl.length > 0) {
        payload.audioUrls = categoryData.audioUrl; // Convert audioUrl to audioUrls for backend
        console.log("📁 Including audio URLs:", payload.audioUrls);
      }

      console.log("📦 Final payload:", payload);

      const response = await api.post("/api/momreset-category/admin/create", payload);
      
      const newCategory = response?.data?.data || response?.data?.category;
      console.log("✅ Category created:", newCategory);
      
      message.success("Category created successfully!");
      return newCategory;
    } catch (error) {
      console.error("❌ Error creating category:", error.message);
      const errorMsg = error.response?.data?.message || error.message || "Failed to create category";
      message.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Update category
 * PUT /api/momreset-category/admin/update/:id
 */
export const updateCategory = createAsyncThunk(
  "category/update",
  async (categoryData, { rejectWithValue }) => {
    try {
      if (!categoryData?.id) {
        throw new Error("Category ID is required for update");
      }

      console.log("📝 Updating category with ID:", categoryData.id);
      console.log("📝 Payload:", categoryData);
      
      const payload = {
        name: categoryData?.name,
        status: categoryData?.status || "active",
      };

      // Add audio URLs if provided (backend expects 'audioUrls' with 's')
      if (categoryData?.audioUrl && categoryData.audioUrl.length > 0) {
        payload.audioUrls = categoryData.audioUrl; // Convert audioUrl to audioUrls for backend
        console.log("📁 Including audio URLs:", payload.audioUrls);
      }

      console.log("📦 Final payload:", payload);

      const response = await api.put(
        `/api/momreset-category/admin/update/${categoryData.id}`,
        payload
      );
      
      console.log("📥 Backend response:", response?.data);
      
      const updatedCategory = response?.data?.data || response?.data?.category || response?.data;
      
      // Make sure we return the category with the ID we sent
      const categoryWithId = {
        ...updatedCategory,
        id: categoryData.id,
        _id: categoryData.id,
      };
      
      console.log("✅ Category updated, returning:", categoryWithId);
      
      message.success("Category updated successfully!");
      return categoryWithId;
    } catch (error) {
      console.error("❌ Error updating category:", error.message);
      const errorMsg = error.response?.data?.message || error.message || "Failed to update category";
      message.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Delete category
 * DELETE /api/momreset-category/admin/delete/:id
 */
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (categoryId, { rejectWithValue }) => {
    try {
      if (!categoryId) {
        throw new Error("Category ID is required for deletion");
      }

      console.log("🗑️ Admin deleting category with ID:", categoryId);
      
      const response = await api.delete(
        `/api/momreset-category/admin/delete/${categoryId}`
      );
      
      console.log("✅ Category deleted successfully:", response.data);
      message.success("Category deleted successfully!");
      
      // Return the ID to filter it out from the list
      return categoryId;
    } catch (error) {
      console.error("❌ Error deleting category:", error);
      console.error("❌ Response data:", error.response?.data);
      
      // Extract proper error message from backend
      let errorMsg = "Failed to delete category";
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
        
        // If category has audio files, show specific message
        if (errorMsg.includes('audio files')) {
          errorMsg = "Please delete all audio files from this category first before deleting the category.";
        }
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      // Show user-friendly error with icon
      message.error({
        content: errorMsg,
        duration: 5,
      });
      
      return rejectWithValue(errorMsg);
    }
  }
);
