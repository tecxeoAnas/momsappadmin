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
  InputNumber,
  Card,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllComingSoon,
  createComingSoon,
  updateComingSoon,
  deleteComingSoon,
} from '../../../../services/comingSoonService';

const ComingSoon = () => {
  const dispatch = useDispatch();
  const { features, loading, error } = useSelector((state) => state.comingSoon);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // Fetch features on mount
  useEffect(() => {
    dispatch(fetchAllComingSoon());
  }, [dispatch]);

  // Update filtered features
  useEffect(() => {
    setFilteredFeatures(features);
  }, [features]);

  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = features.filter(
      (feature) =>
        feature.heading1?.toLowerCase().includes(value.toLowerCase()) ||
        feature.heading2?.toLowerCase().includes(value.toLowerCase()) ||
        feature.description?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredFeatures(filtered);
  };

  // Open create modal
  const handleAddFeature = () => {
    setIsEditMode(false);
    setSelectedFeatureId(null);
    form.resetFields();
    form.setFieldsValue({ 
      status: 'upcoming', // Default to 'upcoming' for new features
      priority: 0,
      expectedTimeValue: 1,
      expectedTimeUnit: 'months'
    });
    setIsModalVisible(true);
  };

  // Open edit modal
  const handleEditFeature = (feature) => {
    setIsEditMode(true);
    setSelectedFeatureId(feature.id);
    
    // Parse expected time (e.g., "2 months" -> value: 2, unit: "months")
    const expectedTimeParts = feature.expectedTime?.split(' ') || [];
    const expectedTimeValue = parseInt(expectedTimeParts[0]) || 1;
    const expectedTimeUnit = expectedTimeParts[1] || 'months';
    
    form.setFieldsValue({
      heading1: feature.heading1,
      heading2: feature.heading2,
      description: feature.description,
      status: feature.status,
      expectedTimeValue: expectedTimeValue,
      expectedTimeUnit: expectedTimeUnit,
      priority: feature.priority,
    });
    setIsModalVisible(true);
  };

  // Submit handler
  const handleSubmit = async (values) => {
    try {
      // Combine expected time value and unit
      const expectedTime = `${values.expectedTimeValue} ${values.expectedTimeUnit}`;
      
      const payload = {
        heading1: values.heading1,
        heading2: values.heading2,
        description: values.description,
        status: values.status || 'upcoming', // Default to 'upcoming' if not set
        expectedTime: expectedTime,
        priority: values.priority,
      };

      if (isEditMode) {
        await dispatch(
          updateComingSoon({
            id: selectedFeatureId,
            data: payload,
          })
        ).unwrap();
        message.success('Feature updated successfully!');
      } else {
        await dispatch(createComingSoon(payload)).unwrap();
        message.success('Feature created successfully!');
      }
      setIsModalVisible(false);
      form.resetFields();
      dispatch(fetchAllComingSoon());
    } catch (err) {
      message.error(err || 'Operation failed');
    }
  };

  // Delete handler
  const handleDeleteFeature = async (id) => {
    try {
      await dispatch(deleteComingSoon(id)).unwrap();
      message.success('Feature deleted successfully!');
      dispatch(fetchAllComingSoon());
    } catch (err) {
      message.error(err || 'Failed to delete feature');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      sorter: (a, b) => a.priority - b.priority,
      render: (priority) => (
        <Tag color="blue">
          <strong>#{priority}</strong>
        </Tag>
      ),
    },
    {
      title: 'Heading 1',
      dataIndex: 'heading1',
      key: 'heading1',
      width: 180,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Heading 2',
      dataIndex: 'heading2',
      key: 'heading2',
      width: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Expected Time',
      dataIndex: 'expectedTime',
      key: 'expectedTime',
      width: 150,
      render: (text) => (
        <Tag icon={<ClockCircleOutlined />} color="orange">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusConfig = {
          active: { color: 'green', text: 'Active' },
          upcoming: { color: 'blue', text: 'Upcoming' },
          released: { color: 'purple', text: 'Released' },
          close: { color: 'red', text: 'Close' },
          delayed: { color: 'orange', text: 'Delayed' },
        };
        
        const config = statusConfig[status] || { color: 'default', text: status };
        
        return <Tag color={config.color}>{config.text}</Tag>;
      },
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
              onClick={() => handleEditFeature(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Feature"
              description="Are you sure you want to delete this feature?"
              onConfirm={() => handleDeleteFeature(record.id)}
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
      <Card
        title={
          <Space>
            <RocketOutlined style={{ fontSize: '20px' }} />
            <span>Coming Soon Features Management</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFeature}>
            Add Feature
          </Button>
        }
      >
        <div style={{ marginBottom: '20px' }}>
          <Input
            placeholder="Search by heading or description..."
            value={searchText}
            onChange={handleSearch}
            style={{ width: '300px' }}
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <Table
          columns={columns}
          dataSource={filteredFeatures}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={isEditMode ? 'Edit Feature' : 'Create New Feature'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="heading1"
            label="Heading 1"
            rules={[{ required: false }]}
          >
            <Input placeholder="e.g., New Feature 2 (Optional)" />
          </Form.Item>

          <Form.Item
            name="heading2"
            label="Heading 2"
            rules={[{ required: false }]}
          >
            <Input placeholder="e.g., Revolutionary Mom Tools (Optional)" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Exciting new tools for modern moms"
            />
          </Form.Item>

          <Form.Item label="Expected Time" required>
            <Input.Group compact>
              <Form.Item
                name="expectedTimeValue"
                noStyle
                rules={[{ required: true, message: 'Enter time value' }]}
              >
                <InputNumber
                  min={1}
                  placeholder="e.g., 2"
                  style={{ width: '40%' }}
                />
              </Form.Item>
              <Form.Item
                name="expectedTimeUnit"
                noStyle
                rules={[{ required: true, message: 'Select unit' }]}
              >
                <Select placeholder="Select unit" style={{ width: '60%' }}>
                  <Select.Option value="minutes">Minutes</Select.Option>
                  <Select.Option value="hours">Hours</Select.Option>
                  <Select.Option value="days">Days</Select.Option>
                  <Select.Option value="weeks">Weeks</Select.Option>
                  <Select.Option value="months">Months</Select.Option>
                  <Select.Option value="years">Years</Select.Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please enter priority' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="0 (higher number = higher priority)"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="upcoming">Upcoming</Select.Option>
              <Select.Option value="released">Released</Select.Option>
              <Select.Option value="close">Close</Select.Option>
              <Select.Option value="delayed">Delayed</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isEditMode ? 'Update Feature' : 'Create Feature'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ComingSoon;
