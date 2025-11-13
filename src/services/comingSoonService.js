import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '../auth/FetchInterceptor';

/**
 * Fetch all coming soon features
 */
export const fetchAllComingSoon = createAsyncThunk(
  'comingSoon/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📚 Fetching all coming soon features');

      const response = await axiosConfig.get(`/api/coming-soon/admin/all`);

      console.log('✅ Coming soon features fetched:', response);

      const features = Array.isArray(response?.comingSoonItems)
        ? response.comingSoonItems
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.features)
        ? response.features
        : Array.isArray(response)
        ? response
        : [];

      const transformedFeatures = features.map((feature) => ({
        id: feature?._id || feature?.id,
        heading1: feature?.heading1,
        heading2: feature?.heading2,
        description: feature?.description,
        status: feature?.status,
        expectedTime: feature?.expectedTime,
        priority: feature?.priority || 0,
        createdAt: feature?.createdAt,
        updatedAt: feature?.updatedAt,
      }));

      console.log('📊 Transformed features:', transformedFeatures);
      return transformedFeatures;
    } catch (error) {
      console.error('❌ Error fetching coming soon features:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch features');
    }
  }
);

/**
 * Fetch single coming soon feature by ID
 */
export const getComingSoonById = createAsyncThunk(
  'comingSoon/getById',
  async (featureId, { rejectWithValue }) => {
    try {
      console.log('📚 Fetching feature:', featureId);

      const response = await axiosConfig.get(`/api/coming-soon/admin/${featureId}`);

      console.log('✅ Feature fetched:', response);

      const feature = response?.data || response?.feature || response;

      const transformedFeature = {
        id: feature?._id || feature?.id,
        heading1: feature?.heading1,
        heading2: feature?.heading2,
        description: feature?.description,
        status: feature?.status,
        expectedTime: feature?.expectedTime,
        priority: feature?.priority || 0,
        createdAt: feature?.createdAt,
        updatedAt: feature?.updatedAt,
      };

      return transformedFeature;
    } catch (error) {
      console.error('❌ Error fetching feature:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch feature');
    }
  }
);

/**
 * Create new coming soon feature
 */
export const createComingSoon = createAsyncThunk(
  'comingSoon/create',
  async (featureData, { rejectWithValue }) => {
    try {
      console.log('📝 Creating feature:', featureData);

      const payload = {
        heading1: featureData.heading1,
        heading2: featureData.heading2,
        description: featureData.description,
        status: featureData.status || 'active',
        expectedTime: featureData.expectedTime,
        priority: featureData.priority || 0,
      };

      console.log('📤 Sending payload:', payload);

      const response = await axiosConfig.post(`/api/coming-soon/admin/create`, payload);

      console.log('✅ Feature created:', response);

      const newFeature = response?.data || response?.feature || response;

      const transformedFeature = {
        id: newFeature?._id || newFeature?.id,
        heading1: newFeature?.heading1,
        heading2: newFeature?.heading2,
        description: newFeature?.description,
        status: newFeature?.status,
        expectedTime: newFeature?.expectedTime,
        priority: newFeature?.priority || 0,
        createdAt: newFeature?.createdAt,
        updatedAt: newFeature?.updatedAt,
      };

      return transformedFeature;
    } catch (error) {
      console.error('❌ Error creating feature:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to create feature');
    }
  }
);

/**
 * Update existing coming soon feature
 */
export const updateComingSoon = createAsyncThunk(
  'comingSoon/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('✏️ Updating feature:', id, data);

      const payload = {
        heading1: data.heading1,
        heading2: data.heading2,
        description: data.description,
        status: data.status,
        expectedTime: data.expectedTime,
        priority: data.priority || 0,
      };

      const response = await axiosConfig.put(
        `/api/coming-soon/admin/update/${id}`,
        payload
      );

      console.log('✅ Feature updated:', response);

      const updatedFeature = response?.data || response?.feature || response;

      const transformedFeature = {
        ...data,
        id: updatedFeature?._id || updatedFeature?.id || id,
        heading1: updatedFeature?.heading1 || data.heading1,
        heading2: updatedFeature?.heading2 || data.heading2,
        description: updatedFeature?.description || data.description,
        status: updatedFeature?.status || data.status,
        expectedTime: updatedFeature?.expectedTime || data.expectedTime,
        priority: updatedFeature?.priority || data.priority || 0,
        updatedAt: updatedFeature?.updatedAt,
      };

      return transformedFeature;
    } catch (error) {
      console.error('❌ Error updating feature:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to update feature');
    }
  }
);

/**
 * Delete coming soon feature
 */
export const deleteComingSoon = createAsyncThunk(
  'comingSoon/delete',
  async (featureId, { rejectWithValue }) => {
    try {
      console.log('🗑️ Deleting feature:', featureId);

      const response = await axiosConfig.delete(`/api/coming-soon/admin/delete/${featureId}`);

      console.log('✅ Feature deleted:', response);

      return featureId;
    } catch (error) {
      console.error('❌ Error deleting feature:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete feature');
    }
  }
);
