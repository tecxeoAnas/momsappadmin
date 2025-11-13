import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '../auth/FetchInterceptor';

/**
 * Fetch all prompts
 */
export const fetchAllPrompts = createAsyncThunk(
  'prompt/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📚 Fetching all prompts from:', `/api/prompt/?page=1&limit=1000`);

      // Add pagination to get all prompts
      const response = await axiosConfig.get(`/api/prompt/?page=1&limit=400`);

      console.log('✅ Prompts fetched successfully:', response);

      // Handle different response structures
      const prompts = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.prompts)
        ? response.prompts
        : Array.isArray(response)
        ? response
        : [];

      // Transform prompts data
      const transformedPrompts = prompts.map((prompt) => ({
        id: prompt?._id || prompt?.id,
        user: prompt?.user,
        title: prompt?.title,
        description: prompt?.description,
        category: prompt?.category,
        tags: prompt?.tags || [],
        isActive: prompt?.isActive !== false && prompt?.status !== 'deactivated',
        createdAt: prompt?.createdAt,
        updatedAt: prompt?.updatedAt,
      }));

      console.log('📊 Transformed prompts:', transformedPrompts);
      return transformedPrompts;
    } catch (error) {
      console.error('❌ Error fetching prompts:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch prompts');
    }
  }
);

/**
 * Fetch single prompt by ID
 */
export const getPromptById = createAsyncThunk(
  'prompt/getById',
  async (promptId, { rejectWithValue }) => {
    try {
      console.log('📚 Fetching prompt:', promptId);

      const response = await axiosConfig.get(`/api/admin/prompts/getbyid/${promptId}`);

      console.log('✅ Prompt fetched successfully:', response);

      const prompt = response?.data || response?.prompt || response;

      const transformedPrompt = {
        id: prompt?._id || prompt?.id,
        user: prompt?.user,
        title: prompt?.title,
        description: prompt?.description,
        category: prompt?.category,
        tags: prompt?.tags || [],
        isActive: prompt?.isActive !== false,
        createdAt: prompt?.createdAt,
        updatedAt: prompt?.updatedAt,
      };

      return transformedPrompt;
    } catch (error) {
      console.error('❌ Error fetching prompt:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch prompt');
    }
  }
);

/**
 * Create new prompt
 */
export const createPrompt = createAsyncThunk(
  'prompt/create',
  async (promptData, { rejectWithValue }) => {
    try {
      console.log('📝 Creating prompt with data:', promptData);
      console.log('🌐 Base URL:', axiosConfig.defaults.baseURL);
      console.log('🔑 Token:', localStorage.getItem('auth_token'));

      const payload = {
        user: promptData.user,
        title: promptData.title,
        description: promptData.description,
        category: promptData.category,
        tags: promptData.tags || [],
        isActive: promptData.isActive !== false,
      };

      console.log('📤 Sending payload:', payload);
      console.log('🎯 Full URL:', `${axiosConfig.defaults.baseURL}/api/admin/prompts/create`);

      const response = await axiosConfig.post(`/api/admin/prompts/create`, payload);

      console.log('✅ Prompt created successfully:', response);

      const newPrompt = response?.data || response?.prompt || response;

      const transformedPrompt = {
        id: newPrompt?._id || newPrompt?.id,
        user: newPrompt?.user,
        title: newPrompt?.title,
        description: newPrompt?.description,
        category: newPrompt?.category,
        tags: newPrompt?.tags || [],
        isActive: newPrompt?.isActive !== false,
        createdAt: newPrompt?.createdAt,
        updatedAt: newPrompt?.updatedAt,
      };

      return transformedPrompt;
    } catch (error) {
      console.error('❌ Error creating prompt:', error);
      console.error('🔴 Error response:', error?.response);
      console.error('📍 Error status:', error?.response?.status);
      console.error('💬 Error message:', error?.response?.data);
      console.error('🌐 Request URL:', error?.config?.url);
      console.error('🔑 Request headers:', error?.config?.headers);
      return rejectWithValue(error?.response?.data?.message || 'Failed to create prompt');
    }
  }
);

/**
 * Update existing prompt
 */
export const updatePrompt = createAsyncThunk(
  'prompt/update',
  async ({ promptId, promptData }, { rejectWithValue }) => {
    try {
      console.log('✏️ Updating prompt:', promptId, promptData);

      const payload = {
        user: promptData.user,
        title: promptData.title,
        description: promptData.description,
        category: promptData.category,
        tags: promptData.tags || [],
        isActive: promptData.isActive !== false,
      };

      const response = await axiosConfig.put(
        `/api/admin/prompts/update/${promptId}`,
        payload
      );

      console.log('✅ Prompt updated successfully:', response);

      // Merge response with original data to preserve all fields
      const updatedPrompt = response?.data || response?.prompt || response;

      const transformedPrompt = {
        ...promptData,
        id: updatedPrompt?._id || updatedPrompt?.id || promptId,
        user: updatedPrompt?.user || promptData.user,
        title: updatedPrompt?.title || promptData.title,
        description: updatedPrompt?.description || promptData.description,
        category: updatedPrompt?.category || promptData.category,
        tags: updatedPrompt?.tags || promptData.tags || [],
        isActive: updatedPrompt?.isActive !== false,
        updatedAt: updatedPrompt?.updatedAt,
      };

      return transformedPrompt;
    } catch (error) {
      console.error('❌ Error updating prompt:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to update prompt');
    }
  }
);

/**
 * Delete prompt (backend deactivates)
 */
export const deletePrompt = createAsyncThunk(
  'prompt/delete',
  async (promptId, { rejectWithValue }) => {
    try {
      console.log('🗑️ Deleting prompt:', promptId);

      const response = await axiosConfig.delete(`/api/admin/prompts/delete/${promptId}`);

      console.log('✅ Prompt deleted successfully:', response);
      console.log('📋 Response message:', response?.message);
      console.log('🔍 Deleted prompt data:', response?.data || response?.prompt);

      return promptId;
    } catch (error) {
      console.error('❌ Error deleting prompt:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete prompt');
    }
  }
);
