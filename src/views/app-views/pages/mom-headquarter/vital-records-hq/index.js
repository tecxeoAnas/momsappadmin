import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, Space, message, Popconfirm } from 'antd';
import { FileProtectOutlined, ShopOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import securityQuestionService from 'services/securityQuestionService';

const { TabPane } = Tabs;

const VitalRecordsHQ = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form] = Form.useForm();

  // Fetch all security questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await securityQuestionService.getAllQuestions();
      setQuestions(data);
    } catch (error) {
      message.error('Failed to fetch security questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle create/update
  const handleSubmit = async (values) => {
    try {
      if (editingQuestion) {
        await securityQuestionService.updateQuestion(editingQuestion.id, values);
        message.success('Security question updated successfully');
      } else {
        await securityQuestionService.createQuestion(values);
        message.success('Security question created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
      message.error(editingQuestion ? 'Failed to update question' : 'Failed to create question');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await securityQuestionService.deleteQuestion(id);
      message.success('Security question deleted successfully');
      fetchQuestions();
    } catch (error) {
      message.error('Failed to delete security question');
    }
  };

  // Open modal for create/edit
  const openModal = (question = null) => {
    setEditingQuestion(question);
    if (question) {
      form.setFieldsValue({
        text: question.text
      });
    }
    setModalVisible(true);
  };

  // Close modal and reset
  const closeModal = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingQuestion(null);
  };

  // Table columns
  const columns = [
    {
      title: 'Question',
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this question?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
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
                <FileProtectOutlined />
                Vital Records
              </span>
            } 
            key="1"
          >
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
              >
                Add Security Question
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={questions}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />

            <Modal
              title={editingQuestion ? 'Edit Security Question' : 'Add Security Question'}
              visible={modalVisible}
              onCancel={closeModal}
              footer={null}
              destroyOnClose={true}
              afterClose={() => {
                form.resetFields();
                setEditingQuestion(null);
              }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="text"
                  label="Question"
                  rules={[{ required: true, message: 'Please enter the security question' }]}
                >
                  <Input.TextArea 
                    rows={3}
                    placeholder="Enter security question"
                  />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      {editingQuestion ? 'Update' : 'Create'}
                    </Button>
                    <Button onClick={closeModal}>
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </TabPane>
          
          {/* <TabPane 
            tab={
              <span>
                <ShopOutlined />
                Business HQ
              </span>
            } 
            key="2"
          >
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <ShopOutlined style={{ fontSize: '72px', color: '#13c2c2', marginBottom: '20px' }} />
              <h3>Business HQ</h3>
              <p>Business management coming soon...</p>
            </div>
          </TabPane> */}
        </Tabs>
      </Card>
    </div>
  );
};

export default VitalRecordsHQ;
