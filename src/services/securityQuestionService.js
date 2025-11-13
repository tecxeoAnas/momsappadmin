import api from 'configs/UniversityConfig';

const securityQuestionService = {};

// Get all security questions
securityQuestionService.getAllQuestions = async function () {
  try {
    const response = await api.get('/api/securityquestion/get-all-ques');
    console.log('Security Questions API Response:', response);
    
    // Response structure: { message: "", questions: [] }
    const data = response?.data?.questions || [];
    
    console.log('Extracted questions:', data);
    return data;
  } catch (error) {
    console.error('Error fetching security questions:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

// Create security question
securityQuestionService.createQuestion = async function (data) {
  try {
    const response = await api.post('/api/securityquestion/add', data);
    return response?.data;
  } catch (error) {
    console.error('Error creating security question:', error);
    throw error;
  }
};

// Update security question
securityQuestionService.updateQuestion = async function (id, data) {
  try {
    const response = await api.put(`/api/securityquestion/update/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error('Error updating security question:', error);
    throw error;
  }
};

// Delete security question
securityQuestionService.deleteQuestion = async function (id) {
  try {
    const response = await api.delete(`/api/securityquestion/delete/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting security question:', error);
    throw error;
  }
};

export default securityQuestionService;
