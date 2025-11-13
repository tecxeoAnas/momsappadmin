import api from "configs/UniversityConfig";

const quickStartService = {}

quickStartService.getQuickStartData = async function () {
  try {
    const response = await api.get('/api/mom-quickstart');
    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error("Error fetching quick start data:", error);
    throw error;
  }
}

quickStartService.createQuickStart = async function (data) {
  try {
    const response = await api.post('/api/mom-quickstart', data);
    return response?.data?.data || response?.data;
  } catch (error) {
    console.error("Error creating quick start:", error);
    throw error;
  }
}

quickStartService.updateQuickStart = async function (id, data) {
  try {
    const response = await api.put(`/api/mom-quickstart/update/${id}`, data);
    return response?.data?.data || response?.data;
  } catch (error) {
    console.error("Error updating quick start:", error);
    throw error;
  }
}

quickStartService.deleteQuickStart = async function (id) {
  try {
    const response = await api.delete(`/api/mom-quickstart/delete/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error deleting quick start:", error);
    throw error;
  }
}

// Community Guidelines APIs
quickStartService.getCommunityGuidelines = async function (quickStartId) {
  try {
    const response = await api.get(`/api/mom-quickstart/${quickStartId}/communityguidelines`);
    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error("Error fetching community guidelines:", error);
    throw error;
  }
}

quickStartService.createCommunityGuideline = async function (quickStartId, data) {
  try {
    const response = await api.post(`/api/mom-quickstart/${quickStartId}/communityguidelines`, data);
    return response?.data?.data || response?.data;
  } catch (error) {
    console.error("Error creating community guideline:", error);
    throw error;
  }
}

quickStartService.updateCommunityGuideline = async function (quickStartId, guidelineId, data) {
  try {
    const response = await api.put(`/api/mom-quickstart/${quickStartId}/communityguidelines/${guidelineId}`, data);
    return response?.data?.data || response?.data;
  } catch (error) {
    console.error("Error updating community guideline:", error);
    throw error;
  }
}

quickStartService.deleteCommunityGuideline = async function (quickStartId, guidelineId) {
  try {
    const response = await api.delete(`/api/mom-quickstart/${quickStartId}/communityguidelines/${guidelineId}`);
    return response?.data;
  } catch (error) {
    console.error("Error deleting community guideline:", error);
    throw error;
  }
}

export default quickStartService
