import api from 'configs/UniversityConfig';

const colourService = {};

// Get all colours
colourService.getAllColours = async function () {
  try {
    const response = await api.get('/api/colour/getall');
    console.log('Colours API Response:', response);
    return response?.data?.colours || [];
  } catch (error) {
    console.error('Error fetching colours:', error);
    throw error;
  }
};

// Create colour
colourService.createColour = async function (data) {
  try {
    const response = await api.post('/api/colour/create', data);
    return response?.data;
  } catch (error) {
    console.error('Error creating colour:', error);
    throw error;
  }
};

// Update colour
colourService.updateColour = async function (id, data) {
  try {
    const response = await api.put(`/api/colour/update/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error('Error updating colour:', error);
    throw error;
  }
};

// Delete colour
colourService.deleteColour = async function (id) {
  try {
    const response = await api.delete(`/api/colour/delete/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting colour:', error);
    throw error;
  }
};

export default colourService;
