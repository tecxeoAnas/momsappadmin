import api from "configs/UniversityConfig";

const recipeCategoryService = {}

recipeCategoryService.getAllRecipeCategories = async function () {
  try {
    const response = await api.get('/api/admin/getall/category');
    return response?.data?.categories || response?.data?.data || response?.data || [];
  } catch (error) {
    console.error("Error fetching recipe categories:", error);
    throw error;
  }
}

recipeCategoryService.createRecipeCategory = async function (data) {
  try {
    const response = await api.post('/api/admin/create/category', data);
    return response?.data?.data || response?.data?.category || response?.data;
  } catch (error) {
    console.error("Error creating recipe category:", error);
    throw error;
  }
}

recipeCategoryService.getRecipeCategoryById = async function (id) {
  try {
    const response = await api.get(`/api/admin/getbyid/category/${id}`);
    return response?.data?.data || response?.data?.category || response?.data;
  } catch (error) {
    console.error("Error fetching recipe category:", error);
    throw error;
  }
}

recipeCategoryService.updateRecipeCategory = async function (id, data) {
  try {
    const response = await api.put(`/api/admin/update/category/${id}`, data);
    return response?.data?.data || response?.data?.category || response?.data;
  } catch (error) {
    console.error("Error updating recipe category:", error);
    throw error;
  }
}

recipeCategoryService.deleteRecipeCategory = async function (id) {
  try {
    const response = await api.delete(`/api/admin/delete/category/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error deleting recipe category:", error);
    throw error;
  }
}

export default recipeCategoryService
