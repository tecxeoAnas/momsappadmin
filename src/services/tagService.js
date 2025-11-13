import api from "configs/UniversityConfig";

const tagService = {}

tagService.getAllTags = async function () {
  try {
    const response = await api.get('/api/tags/getall');
    return response?.data?.data || response?.data?.tags || response?.data || [];
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
}

tagService.createTag = async function (data) {
  try {
    const response = await api.post('/api/tags/create', data);
    return response?.data?.data || response?.data?.tag || response?.data;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
}

tagService.getTagById = async function (id) {
  try {
    const response = await api.get(`/api/tags/gettag/${id}`);
    return response?.data?.data || response?.data?.tag || response?.data;
  } catch (error) {
    console.error("Error fetching tag:", error);
    throw error;
  }
}

tagService.updateTag = async function (id, data) {
  try {
    const response = await api.put(`/api/tags/update/${id}`, data);
    return response?.data?.data || response?.data?.tag || response?.data;
  } catch (error) {
    console.error("Error updating tag:", error);
    throw error;
  }
}

tagService.deleteTag = async function (id) {
  try {
    const response = await api.delete(`/api/tags/delete/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw error;
  }
}

export default tagService
