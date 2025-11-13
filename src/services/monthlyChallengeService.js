import api from 'configs/UniversityConfig';

const monthlyChallengeService = {};

// Get all trainings with challenges
monthlyChallengeService.getAllChallenges = async function () {
  try {
    const response = await api.get('/api/momtraining/get-all');
    console.log('🔍 GET API Response:', response);
    console.log('🔍 Response Data:', response?.data);
    // Return trainings array from response
    return response?.data?.trainings || response?.data || [];
  } catch (error) {
    console.error('Error fetching trainings with challenges:', error);
    throw error;
  }
};

// Create monthly challenge
monthlyChallengeService.createChallenge = async function (data) {
  try {
    const response = await api.post('/api/monthlychallenges/admin/create', data);
    return response?.data;
  } catch (error) {
    console.error('Error creating monthly challenge:', error);
    throw error;
  }
};

// Create training with challenges (combined endpoint)
monthlyChallengeService.createCombinedTrainingChallenge = async function (data) {
  try {
    const response = await api.post('/api/momtraining/create-with-challenges', data);
    return response?.data;
  } catch (error) {
    console.error('Error creating training with challenges:', error);
    throw error;
  }
};

// Update monthly challenge
monthlyChallengeService.updateChallenge = async function (id, data) {
  try {
    const response = await api.patch(`/api/monthlychallenges/admin/update/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error('Error updating monthly challenge:', error);
    throw error;
  }
};

// Update training with challenges (combined endpoint)
monthlyChallengeService.updateCombinedTrainingChallenge = async function (id, data) {
  try {
    console.log('🔍 Update Request - ID:', id);
    console.log('🔍 Update Request - Endpoint:', `/api/momtraining/update-with-challenges/${id}`);
    console.log('🔍 Update Request - Payload:', data);
    const response = await api.put(`/api/momtraining/update-with-challenges/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error('Error updating training with challenges:', error); 
    throw error;
  }
};

// Delete monthly challenge
monthlyChallengeService.deleteChallenge = async function (id) {
  try {
    const response = await api.delete(`/api/monthlychallenges/admin/delete/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting monthly challenge:', error);
    throw error;
  }
};

// Delete training with challenges (combined endpoint)
monthlyChallengeService.deleteCombinedTrainingChallenge = async function (id) {
  try {
    console.log('🔍 Delete Request - ID:', id);
    console.log('🔍 Delete Request - Endpoint:', `/api/momtraining/delete-with-challenges/${id}`);
    const response = await api.delete(`/api/momtraining/delete-with-challenges/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting training with challenges:', error);
    throw error;
  }
};

// Update status for training
monthlyChallengeService.updateTrainingStatus = async function (id, status) {
  try {
    console.log('🔍 Status Update Request - ID:', id);
    console.log('🔍 Status Update Request - Endpoint:', `/api/momtraining/update-status/${id}`);
    console.log('🔍 Status Update Request - Payload:', { status });
    const response = await api.patch(`/api/momtraining/update-status/${id}`, { status });
    return response?.data;
  } catch (error) {
    console.error('Error updating training status:', error);
    throw error;
  }
};

export default monthlyChallengeService;
