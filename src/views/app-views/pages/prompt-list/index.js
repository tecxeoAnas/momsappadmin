import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  message,
  Tooltip,
  Popconfirm,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, TagOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
} from '../../../../services/promptService';
import { AUTH_TOKEN } from '../../../../constants/AuthConstant';

// Decode JWT token to get user ID
const getUserIdFromToken = () => {
  const token = localStorage.getItem(AUTH_TOKEN);
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const decoded = JSON.parse(jsonPayload);
    return decoded.id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const PromptList = () => {
  const dispatch = useDispatch();
  const { prompts, loading, error } = useSelector((state) => state.prompt);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // Fetch prompts on component mount
  useEffect(() => {
    dispatch(fetchAllPrompts());
  }, [dispatch]);

  // Update filtered prompts when prompts change
  useEffect(() => {
    const activePrompts = prompts.filter((prompt) => prompt.isActive !== false);
    setFilteredPrompts(activePrompts);
  }, [prompts]);

  // Filter prompts based on search text
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = prompts
      .filter((prompt) => prompt.isActive !== false)
      .filter((prompt) =>
        prompt.title?.toLowerCase().includes(value.toLowerCase())
      );

    setFilteredPrompts(filtered);
  };

  // Open create modal
  const handleAddPrompt = () => {
    setIsEditMode(false);
    setSelectedPromptId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Open edit modal
  const handleEditPrompt = (prompt) => {
    setIsEditMode(true);
    setSelectedPromptId(prompt.id);
    form.setFieldsValue({
      title: prompt.title,
    });
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      // Get logged in user ID from token
      const userId = getUserIdFromToken();
      
      if (!userId) {
        message.error('User not authenticated. Please login again.');
        return;
      }

      const promptData = {
        title: values.title,
        description: values.title, // Use title as description
        category: 'parenting', // Default category
        tags: [], // Empty tags
        user: userId,
      };

      if (isEditMode) {
        // Update existing prompt
        await dispatch(
          updatePrompt({
            promptId: selectedPromptId,
            promptData,
          })
        ).unwrap();
        message.success('Prompt updated successfully!');
      } else {
        // Create new prompt
        await dispatch(createPrompt(promptData)).unwrap();
        message.success('Prompt created successfully!');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error(err || 'Failed to save prompt');
    }
  };

  // Handle delete
  const handleDeletePrompt = (promptId) => {
    dispatch(deletePrompt(promptId))
      .unwrap()
      .then(() => {
        message.success('Prompt deactivated successfully!');
      })
      .catch((err) => {
        message.error(err || 'Failed to delete prompt');
      });
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditPrompt(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Prompt"
              description="Are you sure you want to deactivate this prompt?"
              onConfirm={() => handleDeletePrompt(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search by title..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: '300px' }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPrompt}>
          Add Prompt
        </Button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={filteredPrompts}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={isEditMode ? 'Edit Prompt' : 'Create New Prompt'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setIsEditMode(false);
          setSelectedPrompt(null);
        }}
        footer={null}
        width={700}
        destroyOnClose={true}
        afterClose={() => {
          form.resetFields();
          setIsEditMode(false);
          setSelectedPrompt(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Prompt Title"
            rules={[{ required: true, message: 'Please enter prompt title' }]}
          >
            <Input placeholder="Enter prompt title" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isEditMode ? 'Update Prompt' : 'Create Prompt'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromptList;
