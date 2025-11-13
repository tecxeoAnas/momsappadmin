import api from "configs/UniversityConfig";

const supportFaqService = {}

// Support FAQs
supportFaqService.getAllFaqs = async function () {
  try {
    const response = await api.get('/api/support');
    return response?.data?.support?.faqs || [];
  } catch (error) {
    console.error("Error fetching support FAQs:", error);
    throw error;
  }
}

supportFaqService.createFaq = async function (data) {
  try {
    const response = await api.post('/api/support/faqs/create', data);
    return response?.data?.data || response?.data?.faq || response?.data;
  } catch (error) {
    console.error("Error creating support FAQ:", error);
    throw error;
  }
}

supportFaqService.updateFaq = async function (id, data) {
  try {
    const response = await api.put('/api/support/faqs/update', {
      faqId: id,
      ...data
    });
    return response?.data?.data || response?.data?.faq || response?.data;
  } catch (error) {
    console.error("Error updating support FAQ:", error);
    throw error;
  }
}

supportFaqService.deleteFaq = async function (id) {
  try {
    const response = await api.delete(`/api/support/deletefaqs/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error deleting support FAQ:", error);
    throw error;
  }
}

// Support Info
supportFaqService.getSupportInfo = async function () {
  try {
    const response = await api.get('/api/support');
    return response?.data?.support?.contactSupport || {};
  } catch (error) {
    console.error("Error fetching support info:", error);
    throw error;
  }
}

supportFaqService.updateSupportInfo = async function (data) {
  try {
    const response = await api.put('/api/support/contact-support', data);
    return response?.data;
  } catch (error) {
    console.error("Error updating support info:", error);
    throw error;
  }
}

export default supportFaqService
