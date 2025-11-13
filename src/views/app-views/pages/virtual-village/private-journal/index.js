import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import privateJournalService from 'services/privateJournalService';

const PrivateJournal = () => {
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingHeading, setEditingHeading] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchHeadings();
  }, []);

  const fetchHeadings = async () => {
    setLoading(true);
    try {
      const data = await privateJournalService.getAllHeadings();
      console.log('Headings data:', data);
      setHeadings(data);
    } catch (error) {
      message.error('Failed to fetch headings');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (heading = null) => {
    setEditingHeading(heading);
    if (heading) {
      form.setFieldsValue({
        name: heading.name
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingHeading(null);
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingHeading) {
        await privateJournalService.updateHeading(editingHeading._id, values);
        message.success('Heading updated successfully');
      } else {
        await privateJournalService.createHeading(values);
        message.success('Heading created successfully');
      }
      handleCancel();
      fetchHeadings();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      message.error(editingHeading ? 'Failed to update heading' : 'Failed to create heading');
    }
  };

  const handleDelete = async (id) => {
    try {
      await privateJournalService.deleteHeading(id);
      message.success('Heading deleted successfully');
      fetchHeadings();
    } catch (error) {
      message.error('Failed to delete heading');
    }
  };

  const columns = [
    {
      title: 'Heading',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <span style={{ color: isActive ? 'green' : 'red' }}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
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
            title="Are you sure you want to delete this heading?"
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
      <Card title="Private Journal - Rise Like A CEO">
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Headings Management</h3>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Create New Heading
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={headings}
          loading={loading}
          rowKey="_id"
        />
      </Card>

      <Modal
        title={editingHeading ? 'Edit Heading' : 'Create New Heading'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
        afterClose={() => {
          form.resetFields();
          setEditingHeading(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Heading"
            rules={[{ required: true, message: 'Please enter heading' }]}
          >
            <Input placeholder="Enter heading" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingHeading ? 'Update' : 'Create'}
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

export default PrivateJournal;
