import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, message, Popconfirm, Space, Switch } from 'antd';
import { ShopOutlined, UnorderedListOutlined, PlusCircleOutlined, BookOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import groceryService from 'services/groceryService';
import recipeCategoryService from 'services/recipeCategoryService';

const { TabPane } = Tabs;

const KitchenHQ = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [groceryItems, setGroceryItems] = useState([]);
  const [recipeCategories, setRecipeCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecipeCategoryModalVisible, setIsRecipeCategoryModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingRecipeCategory, setEditingRecipeCategory] = useState(null);
  const [form] = Form.useForm();
  const [recipeCategoryForm] = Form.useForm();

  useEffect(() => {
    if (activeTab === '1') {
      fetchGroceryItems();
    } else if (activeTab === '2') {
      fetchRecipeCategories();
    }
  }, [activeTab]);

  const fetchGroceryItems = async () => {
    setLoading(true);
    try {
      const response = await groceryService.getAllGroceryItems();
      console.log("📥 Grocery items:", response);
      setGroceryItems(response);
    } catch (error) {
      console.error("❌ Error fetching grocery items:", error);
      message.error('Failed to fetch grocery items');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeCategories = async () => {
    setLoading(true);
    try {
      const response = await recipeCategoryService.getAllRecipeCategories();
      console.log("📥 Recipe categories full response:", response);
      console.log("📥 Recipe categories type:", typeof response);
      console.log("📥 Recipe categories is array:", Array.isArray(response));
      setRecipeCategories(response);
    } catch (error) {
      console.error("❌ Error fetching recipe categories:", error);
      message.error('Failed to fetch recipe categories');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      form.setFieldsValue({
        name: item.name
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingItem(null);
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        await groceryService.updateGroceryItem(editingItem._id, values);
        message.success('Grocery item updated successfully');
      } else {
        await groceryService.createGroceryItem(values);
        message.success('Grocery item created successfully');
      }
      handleCancel();
      fetchGroceryItems();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      message.error(editingItem ? 'Failed to update item' : 'Failed to create item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await groceryService.deleteGroceryItem(id);
      message.success('Grocery item deleted successfully');
      fetchGroceryItems();
    } catch (error) {
      message.error('Failed to delete item');
    }
  };

  // Recipe Category Functions
  const showRecipeCategoryModal = (category = null) => {
    setEditingRecipeCategory(category);
    if (category) {
      recipeCategoryForm.setFieldsValue({
        name: category.name
      });
    } else {
      recipeCategoryForm.resetFields();
    }
    setIsRecipeCategoryModalVisible(true);
  };

  const handleRecipeCategoryCancel = () => {
    recipeCategoryForm.resetFields();
    setEditingRecipeCategory(null);
    setIsRecipeCategoryModalVisible(false);
  };

  const handleRecipeCategorySubmit = async (values) => {
    try {
      if (editingRecipeCategory) {
        await recipeCategoryService.updateRecipeCategory(editingRecipeCategory._id, values);
        message.success('Recipe category updated successfully');
      } else {
        await recipeCategoryService.createRecipeCategory(values);
        message.success('Recipe category created successfully');
      }
      handleRecipeCategoryCancel();
      fetchRecipeCategories();
    } catch (error) {
      console.error("Error in handleRecipeCategorySubmit:", error);
      message.error(editingRecipeCategory ? 'Failed to update category' : 'Failed to create category');
    }
  };

  const handleDeleteRecipeCategory = async (id) => {
    try {
      await recipeCategoryService.deleteRecipeCategory(id);
      message.success('Recipe category deleted successfully');
      fetchRecipeCategories();
    } catch (error) {
      message.error('Failed to delete category');
    }
  };

  const handleToggleRecipeCategoryStatus = async (record) => {
    try {
      const newStatus = !record.isActive;
      await recipeCategoryService.updateRecipeCategory(record._id, {
        name: record.name,
        isActive: newStatus
      });
      message.success(`Category ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchRecipeCategories();
    } catch (error) {
      message.error('Failed to update category status');
    }
  };

  const groceryColumns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
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
            title="Are you sure you want to delete this item?"
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

  const recipeCategoryColumns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleRecipeCategoryStatus(record)}
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
            onClick={() => showRecipeCategoryModal(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDeleteRecipeCategory(record._id)}
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
                <UnorderedListOutlined />
                Grocery List
              </span>
            } 
            key="1"
          >
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Grocery List Management</h3>
                <Button 
                  type="primary" 
                  icon={<PlusCircleOutlined />}
                  onClick={() => showModal()}
                >
                  Add Grocery Item
                </Button>
              </div>
              <Table 
                columns={groceryColumns} 
                dataSource={groceryItems} 
                loading={loading}
                rowKey="_id"
              />
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <PlusCircleOutlined />
                New Recipe
              </span>
            } 
            key="2"
          >
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Recipe Categories</h3>
                <Button 
                  type="primary" 
                  icon={<PlusCircleOutlined />}
                  onClick={() => showRecipeCategoryModal()}
                >
                  Add Recipe Category
                </Button>
              </div>
              <Table 
                columns={recipeCategoryColumns} 
                dataSource={recipeCategories} 
                loading={loading}
                rowKey="_id"
              />
            </div>
          </TabPane>
          
          {/* <TabPane 
            tab={
              <span>
                <BookOutlined />
                All Recipes
              </span>
            } 
            key="3"
          >
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h3>All Recipes</h3>
              <p>All recipes content coming soon...</p>
            </div>
          </TabPane> */}
        </Tabs>
      </Card>

      <Modal
        title={editingItem ? 'Edit Grocery Item' : 'Add New Grocery Item'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
        afterClose={() => {
          form.resetFields();
          setEditingItem(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Item Name"
            rules={[{ required: true, message: 'Please enter item name' }]}
          >
            <Input placeholder="e.g., Vegetables, Fruits, Milk" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Add'}
              </Button>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Recipe Category Modal */}
      <Modal
        title={editingRecipeCategory ? 'Edit Recipe Category' : 'Add New Recipe Category'}
        visible={isRecipeCategoryModalVisible}
        onCancel={handleRecipeCategoryCancel}
        footer={null}
        destroyOnClose={true}
        afterClose={() => {
          recipeCategoryForm.resetFields();
          setEditingRecipeCategory(null);
        }}
      >
        <Form
          form={recipeCategoryForm}
          layout="vertical"
          onFinish={handleRecipeCategorySubmit}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="e.g., Chowmein, Pasta, Desserts" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRecipeCategory ? 'Update' : 'Add'}
              </Button>
              <Button onClick={handleRecipeCategoryCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KitchenHQ;
