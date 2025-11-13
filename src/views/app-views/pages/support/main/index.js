import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, message, Popconfirm, Space, Tag, Alert } from 'antd';
import { CustomerServiceOutlined, PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined, MailOutlined } from '@ant-design/icons';
import supportFaqService from 'services/supportFaqService';

const { TextArea } = Input;
const { TabPane } = Tabs;

const SupportMain = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [form] = Form.useForm();
  const [supportInfoForm] = Form.useForm();
  const [points, setPoints] = useState([]);
  const [supportInfo, setSupportInfo] = useState({});
  const [loadingSupportInfo, setLoadingSupportInfo] = useState(false);

  useEffect(() => {
    if (activeTab === '1') {
      fetchFaqs();
    } else if (activeTab === '2') {
      fetchSupportInfo();
    }
  }, [activeTab]);

  // Fetch support info on component mount
  useEffect(() => {
    fetchSupportInfo();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const response = await supportFaqService.getAllFaqs();
      console.log("📥 Support FAQs full response:", response);
      console.log("📥 Support FAQs type:", typeof response);
      console.log("📥 Support FAQs is array:", Array.isArray(response));
      console.log("📥 Support FAQs length:", response?.length);
      setFaqs(response);
    } catch (error) {
      console.error("❌ Error fetching FAQs:", error);
      if (error.response?.status === 404) {
        message.warning('Support FAQs endpoint not found. Please check backend API.');
        setFaqs([]); // Set empty array to avoid crash
      } else {
        message.error('Failed to fetch FAQs');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportInfo = async () => {
    setLoadingSupportInfo(true);
    try {
      const response = await supportFaqService.getSupportInfo();
      console.log("📥 Support Info:", response);
      setSupportInfo(response);
      supportInfoForm.setFieldsValue({
        email: response.email || ''
      });
    } catch (error) {
      console.error("❌ Error fetching support info:", error);
      if (error.response?.status === 404) {
        message.warning('Support info endpoint not found.');
      } else {
        message.error('Failed to fetch support info');
      }
    } finally {
      setLoadingSupportInfo(false);
    }
  };

  const handleUpdateSupportInfo = async (values) => {
    setLoadingSupportInfo(true);
    try {
      await supportFaqService.updateSupportInfo(values);
      message.success('Support info updated successfully');
      fetchSupportInfo();
    } catch (error) {
      console.error("Error updating support info:", error);
      message.error('Failed to update support info');
    } finally {
      setLoadingSupportInfo(false);
    }
  };

  const showModal = (faq = null) => {
    setEditingFaq(faq);
    if (faq) {
      form.setFieldsValue({
        question: faq.question,
        answer: faq.answer
      });
      setPoints(faq.points || []);
    } else {
      form.resetFields();
      setPoints([]);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingFaq(null);
    setPoints([]);
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    try {
      const faqData = {
        question: values.question,
        answer: values.answer,
        points: points.length > 0 ? points : undefined
      };

      if (editingFaq) {
        await supportFaqService.updateFaq(editingFaq._id, faqData);
        message.success('FAQ updated successfully');
      } else {
        await supportFaqService.createFaq(faqData);
        message.success('FAQ created successfully');
      }
      handleCancel();
      fetchFaqs();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      message.error(editingFaq ? 'Failed to update FAQ' : 'Failed to create FAQ');
    }
  };

  const handleDelete = async (id) => {
    try {
      await supportFaqService.deleteFaq(id);
      message.success('FAQ deleted successfully');
      fetchFaqs();
    } catch (error) {
      message.error('Failed to delete FAQ');
    }
  };

  const addPoint = () => {
    setPoints([...points, '']);
  };

  const removePoint = (index) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
  };

  const updatePoint = (index, value) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      width: '30%',
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      width: '40%',
      render: (text) => (
        <div style={{ maxWidth: '400px', whiteSpace: 'pre-wrap' }}>
          {text}
        </div>
      )
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      width: '15%',
      render: (points) => (
        <div>
          {points && points.length > 0 ? (
            <Tag color="blue">{points.length} points</Tag>
          ) : (
            <Tag>No points</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this FAQ?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="danger" 
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                <QuestionCircleOutlined />
                Support FAQs
              </span>
            } 
            key="1"
          >
            {supportInfo?.email && (
              <Alert
                message="Support Contact Email"
                description={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MailOutlined style={{ fontSize: '16px' }} />
                    <strong>{supportInfo.email}</strong>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: '20px' }}
              />
            )}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Support FAQs</h3>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => showModal()}
              >
                Add FAQ
              </Button>
            </div>
            <Table 
              columns={columns} 
              dataSource={faqs} 
              loading={loading}
              rowKey="_id"
              locale={{
                emptyText: 'No FAQs available. Click "Add FAQ" to create one.'
              }}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <MailOutlined />
                Support Info
              </span>
            } 
            key="2"
          >
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
              <h3 style={{ marginBottom: '20px' }}>Support Contact Information</h3>
              <Form
                form={supportInfoForm}
                layout="vertical"
                onFinish={handleUpdateSupportInfo}
              >
                <Form.Item
                  name="email"
                  label="Support Email"
                  rules={[
                    { required: true, message: 'Please enter support email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input 
                    placeholder="support@example.com" 
                    prefix={<MailOutlined />}
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loadingSupportInfo}
                    size="large"
                  >
                    Update Support Info
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
        destroyOnClose={true}
        afterClose={() => {
          form.resetFields();
          setEditingFaq(null);
          setPoints([]);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: 'Please enter question' }]}
          >
            <Input placeholder="How do I reset my password?" />
          </Form.Item>

          <Form.Item
            name="answer"
            label="Answer"
            rules={[{ required: true, message: 'Please enter answer' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="You can reset your password from the settings page."
            />
          </Form.Item>

          <Form.Item label="Points (Optional)">
            {points.map((point, index) => (
              <div key={index} style={{ display: 'flex', marginBottom: '8px', gap: '8px' }}>
                <Input
                  value={point}
                  onChange={(e) => updatePoint(index, e.target.value)}
                  placeholder={`Point ${index + 1}`}
                />
                <Button 
                  danger 
                  onClick={() => removePoint(index)}
                  icon={<DeleteOutlined />}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button 
              type="dashed" 
              onClick={addPoint}
              icon={<PlusOutlined />}
              style={{ width: '100%', marginTop: '8px' }}
            >
              Add Point
            </Button>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingFaq ? 'Update' : 'Create'}
              </Button>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupportMain;
