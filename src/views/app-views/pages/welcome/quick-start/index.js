import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Spin, message, Button, Modal, Form, Input, Table, Space, Popconfirm, Upload, Tag } from 'antd';
import { SmileOutlined, PlayCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import quickStartService from 'services/quickStartService';
import { imageUploader } from 'utils/mediaUploader';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const QuickStart = () => {
  const [quickStartData, setQuickStartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    fetchQuickStartData();
  }, []);

  const fetchQuickStartData = async () => {
    setLoading(true);
    try {
      const data = await quickStartService.getQuickStartData();
      console.log('Quick Start Data:', data);
      setQuickStartData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch quick start data:', error);
      message.error('Failed to load quick start guide');
      setQuickStartData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (file) => {
    setUploadingVideo(true);
    try {
      const url = await imageUploader(file, setUploadingVideo);
      setVideoUrl(url);
      message.success('Video uploaded successfully');
    } catch (error) {
      message.error('Video upload failed');
    } finally {
      setUploadingVideo(false);
    }
    return false;
  };

  const showModal = async (item = null) => {
    setEditingItem(item);
    if (item) {
      setVideoUrl(item.video || '');
      
      form.setFieldsValue({
        name: item.name,
        description: item.description,
        keyPoints: item.keyPoints || [{ name: '', description: '' }],
      });
    } else {
      form.resetFields();
      setVideoUrl('');
      // Initialize with one empty key point for new items
      form.setFieldsValue({
        keyPoints: [{ name: '', description: '' }]
      });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingItem(null);
    setVideoUrl('');
    setUploadingVideo(false);
  };

  const handleSubmit = async (values) => {
    try {
      const { keyPoints, ...quickStartData } = values;
      
      const payload = {
        ...quickStartData,
        video: videoUrl,
        keyPoints: keyPoints || [], // Add key points
      };

      let quickStartId;
      
      if (editingItem) {
        await quickStartService.updateQuickStart(editingItem._id, payload);
        quickStartId = editingItem._id;
        message.success('Quick start updated successfully');
      } else {
        const response = await quickStartService.createQuickStart(payload);
        quickStartId = response._id || response.data?._id;
        message.success('Quick start created successfully');
      }

      handleCancel();
      fetchQuickStartData();
    } catch (error) {
      console.error('Error:', error);
      message.error(editingItem ? 'Failed to update' : 'Failed to create');
    }
  };

  const handleDelete = async (id) => {
    try {
      await quickStartService.deleteQuickStart(id);
      message.success('Quick start deleted successfully');
      fetchQuickStartData();
    } catch (error) {
      message.error('Failed to delete');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      ellipsis: true,
      render: (text) => <span style={{ fontSize: '12px' }}>{text?.substring(0, 100)}...</span>,
    },
    {
      title: 'Guidelines',
      dataIndex: 'keyPoints',
      key: 'keyPoints',
      width: '20%',
      render: (keyPoints) => (
        keyPoints && keyPoints.length > 0 ? (
          <div>
            {keyPoints.map((point, index) => (
              <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                {point.name}
              </Tag>
            ))}
          </div>
        ) : (
          <span style={{ color: '#999', fontSize: '12px' }}>No guidelines</span>
        )
      ),
    },
    {
      title: 'Video',
      dataIndex: 'video',
      key: 'video',
      width: '12%',
      render: (video) => (
        video ? (
          <a href={video} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
            <PlayCircleOutlined /> Watch
          </a>
        ) : (
          <span style={{ color: '#999' }}>No video</span>
        )
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '18%',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this?"
            onConfirm={() => handleDelete(record._id)}
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Title level={3} style={{ margin: 0 }}>Mom App Quick Start</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
              >
                Add New
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={quickStartData}
              loading={loading}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          </div>
        )}
      </Card>

      <Modal
        title={editingItem ? 'Edit Quick Start' : 'Create New Quick Start'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
        afterClose={() => {
          form.resetFields();
          setEditingItem(null);
          setVideoUrl('');
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input placeholder="Enter quick start name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item label="Video Upload" required>
            <Upload
              beforeUpload={handleVideoUpload}
              maxCount={1}
              showUploadList={false}
              accept="video/*"
            >
              <Button icon={<UploadOutlined />} loading={uploadingVideo}>
                {videoUrl ? 'Change Video' : 'Upload Video'}
              </Button>
            </Upload>
            {videoUrl && (
              <div style={{ marginTop: 8 }}>
                <span style={{ color: 'green' }}>✓ Video uploaded</span>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4, wordBreak: 'break-all' }}>{videoUrl}</div>
              </div>
            )}
          </Form.Item>

          {/* Key Points Dynamic Fields */}
          <div style={{ marginBottom: 16 }}>
            <h4>Guidelines (Key Points)</h4>
          </div>

          <Form.List 
            name="keyPoints" 
            initialValue={[{ name: '', description: '' }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      marginBottom: 16,
                      padding: 16,
                      border: '1px solid #d9d9d9',
                      borderRadius: 4,
                      position: 'relative',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        label="Point Name"
                        rules={[{ required: true, message: 'Please enter point name' }]}
                      >
                        <Input placeholder="e.g., Introduction" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        label="Point Description"
                        rules={[{ required: true, message: 'Please enter point description' }]}
                      >
                        <TextArea rows={2} placeholder="e.g., Welcome to the program" />
                      </Form.Item>
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type="link"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Key Point
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Create'}
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

export default QuickStart;
