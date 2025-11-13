import api from "configs/UniversityConfig";

const groceryService = {}

groceryService.getAllGroceryItems = async function () {
  try {
    const response = await api.get('/api/grocerylist/admin/getall');
    return response?.data?.foodGroups || response?.data?.data || response?.data?.items || [];
  } catch (error) {
    console.error("Error fetching grocery items:", error);
    throw error;
  }
}

groceryService.createGroceryItem = async function (data) {
  try {
    const response = await api.post('/api/grocerylist/admin/create', data);
    return response?.data?.data || response?.data?.item || response?.data;
  } catch (error) {
    console.error("Error creating grocery item:", error);
    throw error;
  }
}

groceryService.getGroceryItemById = async function (id) {
  try {
    const response = await api.get(`/api/grocerylist/admin/get/${id}`);
    return response?.data?.data || response?.data?.item || response?.data;
  } catch (error) {
    console.error("Error fetching grocery item:", error);
    throw error;
  }
}

groceryService.updateGroceryItem = async function (id, data) {
  try {
    const response = await api.put(`/api/grocerylist/admin/update/${id}`, data);
    return response?.data?.data || response?.data?.item || response?.data;
  } catch (error) {
    console.error("Error updating grocery item:", error);
    throw error;
  }
}

groceryService.deleteGroceryItem = async function (id) {
  try {
    const response = await api.delete(`/api/grocerylist/admin/delete/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error deleting grocery item:", error);
    throw error;
  }
}

export default groceryService
