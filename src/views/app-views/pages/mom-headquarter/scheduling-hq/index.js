import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, message, Popconfirm, Space, Switch } from 'antd';
import { BgColorsOutlined, TagOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import tagService from 'services/tagService';
import colourService from 'services/colourService';

const { TabPane } = Tabs;

const SchedulingHQ = () => {
  const [activeTab, setActiveTab] = useState('1');
  
  // Tags state
  const [tags, setTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagForm] = Form.useForm();
  
  // Colours state
  const [colours, setColours] = useState([]);
  const [coloursLoading, setColoursLoading] = useState(false);
  const [isColourModalVisible, setIsColourModalVisible] = useState(false);
  const [editingColour, setEditingColour] = useState(null);
  const [colourForm] = Form.useForm();

  useEffect(() => {
    if (activeTab === '1') {
      fetchColours();
    } else if (activeTab === '2') {
      fetchTags();
    }
  }, [activeTab]);

  // Colour functions
  const fetchColours = async () => {
    setColoursLoading(true);
    try {
      const response = await colourService.getAllColours();
      console.log("📥 Colours response:", response);
      setColours(response);
    } catch (error) {
      console.error("❌ Error fetching colours:", error);
      message.error('Failed to fetch colours');
    } finally {
      setColoursLoading(false);
    }
  };

  const showColourModal = (colour = null) => {
    setEditingColour(colour);
    if (colour) {
      colourForm.setFieldsValue({
        colorcode: colour.colorcode,
        bgcolorcode: colour.bgcolorcode
      });
    } else {
      colourForm.resetFields();
    }
    setIsColourModalVisible(true);
  };

  const handleColourCancel = () => {
    colourForm.resetFields();
    setEditingColour(null);
    setIsColourModalVisible(false);
  };

  const handleColourSubmit = async (values) => {
    try {
      if (editingColour) {
        await colourService.updateColour(editingColour._id, values);
        message.success('Colour updated successfully');
      } else {
        await colourService.createColour(values);
        message.success('Colour created successfully');
      }
      handleColourCancel();
      fetchColours();
    } catch (error) {
      console.error("Error in handleColourSubmit:", error);
      message.error(editingColour ? 'Failed to update colour' : 'Failed to create colour');
    }
  };

  const handleColourDelete = async (id) => {
    try {
      await colourService.deleteColour(id);
      message.success('Colour deleted successfully');
      fetchColours();
    } catch (error) {
      message.error('Failed to delete colour');
    }
  };

  const handleToggleColourStatus = async (record) => {
    try {
      const newStatus = !record.active;
      await colourService.updateColour(record._id, {
        colorcode: record.colorcode,
        bgcolorcode: record.bgcolorcode,
        active: newStatus
      });
      message.success(`Colour ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchColours();
    } catch (error) {
      message.error('Failed to update colour status');
    }
  };

  // Tag functions
  const fetchTags = async () => {
    setTagsLoading(true);
    try {
      const response = await tagService.getAllTags();
      console.log("📥 Tags response:", response);
      setTags(response);
    } catch (error) {
      console.error("❌ Error fetching tags:", error);
      message.error('Failed to fetch tags');
    } finally {
      setTagsLoading(false);
    }
  };

  const showModal = (tag = null) => {
    setEditingTag(tag);
    if (tag) {
      tagForm.setFieldsValue({
        tagname: tag.tagname
      });
    } else {
      tagForm.resetFields();
    }
    setIsTagModalVisible(true);
  };

  const handleCancel = () => {
    tagForm.resetFields();
    setEditingTag(null);
    setIsTagModalVisible(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTag) {
        await tagService.updateTag(editingTag._id, values);
        message.success('Tag updated successfully');
      } else {
        await tagService.createTag(values);
        message.success('Tag created successfully');
      }
      handleCancel();
      fetchTags();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      message.error(editingTag ? 'Failed to update tag' : 'Failed to create tag');
    }
  };

  const handleDelete = async (id) => {
    try {
      await tagService.deleteTag(id);
      message.success('Tag deleted successfully');
      fetchTags();
    } catch (error) {
      message.error('Failed to delete tag');
    }
  };

  const handleToggleStatus = async (record) => {
    try {
      const newStatus = !record.active;
      await tagService.updateTag(record._id, {
        tagname: record.tagname,
        active: newStatus
      });
      message.success(`Tag ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchTags();
    } catch (error) {
      message.error('Failed to update tag status');
    }
  };

  const colourColumns = [
    {
      title: 'Text Color (Darker)',
      dataIndex: 'colorcode',
      key: 'colorcode',
      render: (colorcode) => (
        <Space>
          <div style={{ 
            width: 30, 
            height: 30, 
            backgroundColor: colorcode,
            border: '1px solid #d9d9d9',
            borderRadius: 4
          }} />
          <span>{colorcode}</span>
        </Space>
      )
    },
    {
      title: 'Background Color',
      dataIndex: 'bgcolorcode',
      key: 'bgcolorcode',
      render: (bgcolorcode) => (
        <Space>
          <div style={{ 
            width: 30, 
            height: 30, 
            backgroundColor: bgcolorcode,
            border: '1px solid #d9d9d9',
            borderRadius: 4
          }} />
          <span>{bgcolorcode}</span>
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active, record) => (
        <Switch 
          checked={active} 
          onChange={() => handleToggleColourStatus(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showColourModal(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this colour?"
            onConfirm={() => handleColourDelete(record._id)}
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

  const columns = [
    {
      title: 'Tag Name',
      dataIndex: 'tagname',
      key: 'tagname',
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active, record) => (
        <Switch 
          checked={active} 
          onChange={() => handleToggleStatus(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
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
            title="Are you sure you want to delete this tag?"
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
                <BgColorsOutlined />
                Create Colour
              </span>
            } 
            key="1"
          >
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Colours Management</h3>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => showColourModal()}
                >
                  Create New Colour
                </Button>
              </div>
              <Table 
                columns={colourColumns} 
                dataSource={colours} 
                loading={coloursLoading}
                rowKey="_id"
              />
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <TagOutlined />
                Create Tag
              </span>
            } 
            key="2"
          >
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Tags Management</h3>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => showModal()}
                >
                  Create New Tag
                </Button>
              </div>
              <Table 
                columns={columns} 
                dataSource={tags} 
                loading={tagsLoading}
                rowKey="_id"
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Colour Modal */}
      <Modal
        title={editingColour ? 'Edit Colour' : 'Create New Colour'}
        visible={isColourModalVisible}
        onCancel={handleColourCancel}
        footer={null}
        destroyOnClose={true}
        afterClose={() => {
          colourForm.resetFields();
          setEditingColour(null);
        }}
      >
        <Form
          form={colourForm}
          layout="vertical"
          onFinish={handleColourSubmit}
        >
          <Form.Item
            name="colorcode"
            label="Text Color (Darker)"
            rules={[{ required: true, message: 'Please enter text color code' }]}
            extra="This color code is for the text color that appears darker"
          >
            <Input type="color" placeholder="#000000" />
          </Form.Item>

          <Form.Item
            name="bgcolorcode"
            label="Background Color"
            rules={[{ required: true, message: 'Please enter background color code' }]}
          >
            <Input type="color" placeholder="#FFFFFF" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingColour ? 'Update' : 'Create'}
              </Button>
              <Button onClick={handleColourCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Tag Modal */}
      <Modal
        title={editingTag ? 'Edit Tag' : 'Create New Tag'}
        visible={isTagModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
        afterClose={() => {
          tagForm.resetFields();
          setEditingTag(null);
        }}
      >
        <Form
          form={tagForm}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="tagname"
            label="Tag Name"
            rules={[{ required: true, message: 'Please enter tag name' }]}
          >
            <Input placeholder="Enter tag name" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTag ? 'Update' : 'Create'}
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

export default SchedulingHQ;
