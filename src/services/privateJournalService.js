import api from 'configs/UniversityConfig';

const privateJournalService = {};

// Get all headings
privateJournalService.getAllHeadings = async function () {
  try {
    const response = await api.get('/api/riselikeaceo/headings');
    console.log('Private Journal Headings Response:', response);
    return response?.data?.headings || response?.data || [];
  } catch (error) {
    console.error('Error fetching private journal headings:', error);
    throw error;
  }
};

// Create heading
privateJournalService.createHeading = async function (data) {
  try {
    const response = await api.post('/api/riselikeaceo/headings', data);
    return response?.data;
  } catch (error) {
    console.error('Error creating heading:', error);
    throw error;
  }
};

// Update heading
privateJournalService.updateHeading = async function (id, data) {
  try {
    const response = await api.patch(`/api/riselikeaceo/headings/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error('Error updating heading:', error);
    throw error;
  }
};

// Delete heading
privateJournalService.deleteHeading = async function (id) {
  try {
    const response = await api.delete(`/api/riselikeaceo/headings/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting heading:', error);
    throw error;
  }
};

export default privateJournalService;
