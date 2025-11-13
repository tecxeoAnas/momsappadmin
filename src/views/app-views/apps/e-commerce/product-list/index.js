import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tooltip,
  message,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Select,
  Descriptions,
  Tag,
  Switch,
  List,
  Popconfirm,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
  InboxOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "services/categoryService";
import { imageUploader } from "utils/mediaUploader";
import api from "configs/UniversityConfig";

const { Option } = Select;
const { Dragger } = Upload;

const ProductList = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categoryProfileVisible, setCategoryProfileVisible] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addCategoryModalVisible, setAddCategoryModalVisible] =
    useState(false);
  const [editCategoryModalVisible, setEditCategoryModalVisible] =
    useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const [addCategoryForm] = Form.useForm();
  const [editCategoryForm] = Form.useForm();

  // Audio Management States
  const [audioManageModalVisible, setAudioManageModalVisible] = useState(false);
  const [managingCategoryId, setManagingCategoryId] = useState(null);
  const [categoryAudios, setCategoryAudios] = useState([]);
  const [audioUploadForm] = Form.useForm();
  const [uploadingAudioFile, setUploadingAudioFile] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingAudio, setEditingAudio] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Update filtered categories when items change or search value changes
  useEffect(() => {
    if (searchValue.trim()) {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          (category.value && category.value.toLowerCase().includes(searchValue.toLowerCase()))
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [categories, searchValue]);

  console.log("categories categories=====", categories);

  // Search functionality
  const onSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  // Add Category Modal methods
  const showAddCategoryModal = () => {
    setAddCategoryModalVisible(true);
  };

  const hideAddCategoryModal = () => {
    setAddCategoryModalVisible(false);
    addCategoryForm.resetFields();
  };

  // Edit Category Modal methods
  const showEditCategoryModal = (category) => {
    console.log("=== OPENING EDIT MODAL ===");
    console.log("Selected category:", category);
    
    // First reset everything to clear previous state
    editCategoryForm.resetFields();
    setEditingCategory(null);
    
    // Then set the new category and form values
    setEditingCategory(category);
    setEditCategoryModalVisible(true);
    
    // Set form values after modal is opened
    setTimeout(() => {
      editCategoryForm.setFieldsValue({
        name: category.name,
        status: category.status === "active",
      });
      console.log("Form values set:", {
        name: category.name,
        status: category.status === "active",
      });
    }, 100);
  };

  const hideEditCategoryModal = () => {
    console.log("=== CLOSING EDIT MODAL ===");
    setEditCategoryModalVisible(false);
    editCategoryForm.resetFields();
    setEditingCategory(null);
  };



  const addCategory = async (values) => {
    console.log("Adding category with values:", values);

    const formData = {
      name: values?.name,
      status: values?.status ? "active" : "inactive",
    };

    console.log("formData to send:", formData);

    try {
      const newCategory = await dispatch(createCategory(formData)).unwrap();
      setAddCategoryModalVisible(false);
      addCategoryForm.resetFields();
      
      // Refresh categories to get updated list
      await dispatch(fetchAllCategories());
      
      // Open audio management modal for the new category
      const categoryToManage = categories.find(cat => 
        (cat.id || cat._id) === (newCategory.id || newCategory._id)
      ) || newCategory;
      
      message.success("Category created! Now add audios.");
      
      // Small delay to ensure modal closes first
      setTimeout(() => {
        showAudioManageModal(categoryToManage);
      }, 300);
    } catch (error) {
      console.error("Error adding category:", error);
      // Error handled by service
    }
  };

  const editCategory = async (values) => {
    console.log("=== UPDATING CATEGORY ===");
    console.log("Original Category:", editingCategory);
    console.log("Updated Values:", values);

    if (!editingCategory) {
      message.error("No category selected for editing!");
      return;
    }

    const categoryId = editingCategory.id || editingCategory._id;
    console.log("Category ID to update:", categoryId);

    const updatedData = {
      id: categoryId,
      name: values.name,
      status: values.status ? "active" : "inactive",
    };

    console.log("Payload being sent:", updatedData);

    try {
      const result = await dispatch(updateCategory(updatedData)).unwrap();
      console.log("✅ Update successful, result:", result);
      
      // Refresh categories list to ensure UI is in sync
      await dispatch(fetchAllCategories());
      console.log("✅ Categories refreshed");
      
      setEditCategoryModalVisible(false);
      editCategoryForm.resetFields();
      setEditingCategory(null);
      // Message handled by service
    } catch (error) {
      console.error("❌ Error updating category:", error);
      // Error handled by service
    }
  };

  // Audio Management Functions
  const showAudioManageModal = (category) => {
    setManagingCategoryId(category.id || category._id);
    setCategoryAudios(category.audios || []);
    setAudioManageModalVisible(true);
    setShowUploadForm(false);
    setCurrentAudioUrl(null);
    audioUploadForm.resetFields();
  };

  const hideAudioManageModal = () => {
    setAudioManageModalVisible(false);
    setManagingCategoryId(null);
    setCategoryAudios([]);
    setShowUploadForm(false);
    setCurrentAudioUrl(null);
    audioUploadForm.resetFields();
  };



  const handleAudioFileUpload = async (file) => {
    try {
      setUploadingAudioFile(true);
      const url = await imageUploader(file, setUploadingAudioFile, false);
      setCurrentAudioUrl(url);
      message.success('Audio file uploaded! Now add title and description.');
      return false;
    } catch (error) {
      message.error('Audio upload failed');
      setUploadingAudioFile(false);
      return false;
    }
  };

  const handleAudioSubmit = async (values) => {
    if (!currentAudioUrl && !editingAudio) {
      message.error('Please upload an audio file first!');
      return;
    }

    if (!managingCategoryId) {
      message.error('Category ID not found!');
      return;
    }

    try {
      if (editingAudio) {
        // Update existing audio
        const audioData = {
          title: values.title,
          description: values.description,
          audioUrl: currentAudioUrl || editingAudio.audioUrl,
        };

        console.log('📝 Updating audio:', editingAudio._id, audioData);

        const response = await api.put(`/api/momreset-audio/admin/update/${editingAudio._id}`, audioData);
        const updatedAudio = response.data?.data || response.data;

        message.success('Audio updated successfully!');
        
        // Update audio in the list
        setCategoryAudios(prev => prev.map(audio => 
          audio._id === editingAudio._id ? { ...audio, ...updatedAudio } : audio
        ));
        
        // Reset editing state
        setEditingAudio(null);
      } else {
        // Create new audio
        const audioData = {
          title: values.title,
          description: values.description,
          audioUrl: currentAudioUrl,
          categoryId: managingCategoryId,
        };

        console.log('📤 Creating audio:', audioData);

        const response = await api.post('/api/momreset-audio/admin/create', audioData);
        const newAudio = response.data?.data || response.data;

        message.success('Audio added successfully!');
        
        // Add new audio to the list immediately
        setCategoryAudios(prev => [...prev, newAudio]);
      }
      
      // Also refresh categories in background to keep data in sync
      dispatch(fetchAllCategories());

      // Reset form and hide upload section
      audioUploadForm.resetFields();
      setCurrentAudioUrl(null);
      setShowUploadForm(false);
    } catch (error) {
      console.error('❌ Failed to save audio:', error);
      message.error(error.response?.data?.message || 'Failed to save audio');
    }
  };

  const handleEditAudio = (audio) => {
    setEditingAudio(audio);
    setCurrentAudioUrl(audio.audioUrl);
    audioUploadForm.setFieldsValue({
      title: audio.title,
      description: audio.description,
    });
    setShowUploadForm(true);
  };

  const handleCancelEdit = () => {
    setEditingAudio(null);
    setCurrentAudioUrl(null);
    audioUploadForm.resetFields();
    setShowUploadForm(false);
  };

  const handleDeleteAudio = async (audioId) => {
    try {
      console.log('🗑️ Deleting audio:', audioId);
      
      await api.delete(`/api/momreset-audio/admin/delete/${audioId}`);

      message.success('Audio deleted successfully!');
      
      // Refresh categories from backend
      const result = await dispatch(fetchAllCategories()).unwrap();
      
      // Find updated category from fresh data
      const updatedCategory = result.find(cat => 
        (cat.id || cat._id) === managingCategoryId
      );
      
      if (updatedCategory) {
        setCategoryAudios(updatedCategory.audios || []);
      } else {
        // Category might be empty now, just clear the list
        setCategoryAudios([]);
      }
    } catch (error) {
      console.error('❌ Failed to delete audio:', error);
      message.error(error.response?.data?.message || 'Failed to delete audio');
    }
  };

  const handleDeleteCategory = (categoryId, categoryName, hasAudioFiles = false) => {
    console.log("=== DELETE CATEGORY REQUEST ===");
    console.log("Category ID:", categoryId);
    console.log("Category Name:", categoryName);
    console.log("Has Audio Files:", hasAudioFiles);
    
    // If category has audio files, show warning and prevent delete
    if (hasAudioFiles) {
      Modal.warning({
        title: "Cannot Delete Category",
        content: (
          <div>
            <p>
              The category <strong>"{categoryName}"</strong> has associated audio files.
            </p>
            <div style={{ 
              marginTop: '15px', 
              padding: '12px', 
              background: '#fff7e6', 
              border: '1px solid #ffd591',
              borderRadius: '4px'
            }}>
              <p style={{ color: '#fa8c16', fontWeight: 'bold', marginBottom: '8px' }}>
                📋 Please follow these steps:
              </p>
              <ol style={{ fontSize: '13px', marginLeft: '20px', marginBottom: '0' }}>
                <li>Click "Manage Audios" button for this category</li>
                <li>Delete all audio files from the list</li>
                <li>Close the audio management modal</li>
                <li>Then you can delete the category</li>
              </ol>
            </div>
          </div>
        ),
        okText: "Got it",
        width: 500,
      });
      return;
    }
    
    Modal.confirm({
      title: "Delete Category",
      content: (
        <div>
          <p>Are you sure you want to delete <strong>"{categoryName}"</strong>?</p>
          <p style={{ color: '#999', fontSize: '12px', marginTop: '12px' }}>
            This action cannot be undone.
          </p>
        </div>
      ),
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okButtonProps: { 
        danger: true,
      },
      width: 500,
      onOk: async () => {
        try {
          console.log("🗑️ Deleting category:", categoryId);
          await dispatch(deleteCategory(categoryId)).unwrap();
          console.log("✅ Category deleted successfully");
          
          // Refresh the list
          await dispatch(fetchAllCategories());
          // Message handled by service
        } catch (error) {
          console.error("❌ Delete failed:", error);
          // Error message already shown by service
          // Just log for debugging
        }
      },
    });
  };

  const showCategoryProfile = (categoryInfo) => {
    console.log("Category Info:", categoryInfo);
    setCategoryProfileVisible(true);
    setSelectedCategory(categoryInfo);
    console.log("=== VIEW CATEGORY ===");
    console.log("Category Details:", categoryInfo);
    console.log("=======================");
  };

  const closeCategoryProfile = () => {
    setCategoryProfileVisible(false);
    setSelectedCategory(null);
  };

  const tableColumns = [
    {
      title: "Category Name",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <div>
            <div style={{ fontWeight: 500, fontSize: "14px" }}>
              {record.name}
            </div>
          </div>
        </div>
      ),
      sorter: {
        compare: (a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const isActive = status === "active";
        return (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "Audio Files",
      dataIndex: "audioCount",
      render: (count, record) => {
        // Handle backend format (audioUrls), new format (audioUrl) and old format (audios)
        const audioCount = count || 
                          record.audioCount || 
                          record.audioUrls?.length || 
                          record.audioUrl?.length || 
                          record.audios?.length || 
                          0;
        return (
          <Tag color={audioCount > 0 ? "blue" : "default"}>
            {audioCount} {audioCount === 1 ? 'file' : 'files'}
          </Tag>
        );
      },
      sorter: (a, b) => {
        const countA = a.audioCount || a.audioUrls?.length || a.audioUrl?.length || a.audios?.length || 0;
        const countB = b.audioCount || b.audioUrls?.length || b.audioUrl?.length || b.audios?.length || 0;
        return countA - countB;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => {
        const audioCount = record.audioCount || record.audios?.length || 0;
        const hasAudioFiles = audioCount > 0;
        
        return (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Tooltip title="View Details">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => showCategoryProfile(record)}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Manage Audios">
              <Button
                type="default"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
                icon={<PlayCircleOutlined />}
                onClick={() => showAudioManageModal(record)}
                size="small"
              >
                <span className="d-none d-md-inline">Audios</span> ({audioCount})
              </Button>
            </Tooltip>
            <Tooltip title="Edit Category">
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={() => showEditCategoryModal(record)}
                size="small"
              />
            </Tooltip>
            <Tooltip 
              title={hasAudioFiles 
                ? "Delete blocked - has audio files" 
                : "Delete category"
              }
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteCategory(record.id || record._id, record.name, hasAudioFiles)}
                size="small"
                style={hasAudioFiles ? { borderColor: '#ff7a45', color: '#ff7a45' } : {}}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Card
      bodyStyle={{ padding: "0px" }}
      title="Category Management"
      extra={
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <Input
            placeholder="Search categories..."
            prefix={<SearchOutlined />}
            onChange={onSearch}
            value={searchValue}
            style={{ minWidth: "200px", maxWidth: "300px" }}
          />
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={showAddCategoryModal}
          >
            <span className="d-none d-sm-inline">Add Category</span>
          </Button>
        </div>
      }
    >
      <div className="table-responsive" style={{ overflowX: "auto" }}>
        <Table
          columns={tableColumns}
          dataSource={filteredCategories}
          rowKey="id"
          loading={loading}
          scroll={{ x: 800 }}
          pagination={{
            responsive: true,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </div>

      {/* View Category Modal */}
      <Modal
        title="Category Details"
        open={categoryProfileVisible}
        onCancel={closeCategoryProfile}
        footer={[
          <Button key="close" onClick={closeCategoryProfile}>
            Close
          </Button>,
        ]}
        width="95%"
        style={{ top: 10, maxWidth: '700px' }}
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto', padding: '16px' }}
      >
        {selectedCategory && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Category Name">
                <strong>{selectedCategory.name}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedCategory.status === "active" ? "green" : "red"}>
                  {selectedCategory.status === "active" ? "Active" : "Inactive"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Audio Files">
                <Tag color="blue">
                  {(selectedCategory.audioUrls?.length || selectedCategory.audioUrl?.length || selectedCategory.audios?.length || 0)} {' '}
                  {(selectedCategory.audioUrls?.length || selectedCategory.audioUrl?.length || selectedCategory.audios?.length) === 1 ? 'file' : 'files'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {selectedCategory.createdAt 
                  ? dayjs(selectedCategory.createdAt).format("MMM DD, YYYY HH:mm")
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>

            {/* Audio Files Section */}
            {((selectedCategory.audioUrls && selectedCategory.audioUrls.length > 0) ||
              (selectedCategory.audioUrl && selectedCategory.audioUrl.length > 0) || 
              (selectedCategory.audios && selectedCategory.audios.length > 0)) && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ marginBottom: '15px', borderBottom: '2px solid #1890ff', paddingBottom: '8px' }}>
                  Audio Files ({selectedCategory.audioUrls?.length || selectedCategory.audioUrl?.length || selectedCategory.audios?.length || 0})
                </h4>
                <List
                  dataSource={
                    // Handle backend format (audioUrls: string[]), new format (audioUrl: string[]) and old format (audios: object[])
                    selectedCategory.audioUrls 
                      ? selectedCategory.audioUrls.map((url, idx) => ({
                          url,
                          title: url.split('/').pop() || `Audio ${idx + 1}` // Extract filename from URL
                        }))
                      : selectedCategory.audioUrl 
                        ? selectedCategory.audioUrl.map((url, idx) => ({
                            url,
                            title: url.split('/').pop() || `Audio ${idx + 1}` // Extract filename from URL
                          }))
                        : selectedCategory.audios || []
                  }
                  renderItem={(audio, index) => (
                    <List.Item
                      key={index}
                      style={{ 
                        padding: '15px', 
                        border: '1px solid #f0f0f0', 
                        borderRadius: '8px',
                        marginBottom: '10px',
                        background: '#fafafa'
                      }}
                    >
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                          <PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '10px' }} />
                          <div style={{ flex: 1 }}>
                            <strong>{audio.title || `Audio ${index + 1}`}</strong>
                            {audio.description && (
                              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                                {audio.description}
                              </div>
                            )}
                            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                              {audio.audioUrl || audio.url}
                            </div>
                          </div>
                        </div>
                        
                        {/* HTML5 Audio Player */}
                        <audio 
                          controls 
                          style={{ width: '100%', marginTop: '8px' }}
                          preload="metadata"
                        >
                          <source src={audio.audioUrl || audio.url} type="audio/mpeg" />
                          <source src={audio.audioUrl || audio.url} type="audio/wav" />
                          <source src={audio.audioUrl || audio.url} type="audio/ogg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            )}

            {/* No Audio Files Message */}
            {(!selectedCategory.audios || selectedCategory.audios.length === 0) && (
              <div style={{ 
                marginTop: '20px', 
                padding: '20px', 
                textAlign: 'center', 
                background: '#f5f5f5',
                borderRadius: '8px',
                color: '#999'
              }}>
                <PlayCircleOutlined style={{ fontSize: '48px', marginBottom: '10px', opacity: 0.3 }} />
                <div>No audio files available for this category</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Category Modal */}
      <Modal
        title="Add New Category"
        open={addCategoryModalVisible}
        onCancel={hideAddCategoryModal}
        footer={null}
        destroyOnClose={true}
        width="90%"
        style={{ top: 20, maxWidth: '600px' }}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <Form
          form={addCategoryForm}
          layout="vertical"
          onFinish={addCategory}
          requiredMark={false}
          initialValues={{ status: true }}
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              { required: true, message: "Please enter category name!" },
              {
                min: 3,
                message: "Category name must be at least 3 characters!",
              },
            ]}
          >
            <Input placeholder="e.g., Stretching Routine" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Button className="mr-2" onClick={hideAddCategoryModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Category
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        open={editCategoryModalVisible}
        onCancel={hideEditCategoryModal}
        footer={null}
        destroyOnClose={true}
        key={editingCategory?.id || editingCategory?._id || 'edit-modal'}
        width="90%"
        style={{ top: 20, maxWidth: '600px' }}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        {editingCategory && (
          <Form
            form={editCategoryForm}
            layout="vertical"
            onFinish={editCategory}
            requiredMark={false}
            key={`form-${editingCategory.id || editingCategory._id}`}
          >
            <Form.Item
              label="Category Name"
              name="name"
              rules={[
                { required: true, message: "Please enter category name!" },
                {
                  min: 3,
                  message: "Category name must be at least 3 characters!",
                },
              ]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              valuePropName="checked"
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>

            <Form.Item className="text-right mb-0">
              <Button className="mr-2" onClick={hideEditCategoryModal}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Category
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Audio Management Modal */}
      <Modal
        title="Manage Audios"
        open={audioManageModalVisible}
        onCancel={hideAudioManageModal}
        footer={[
          <Button key="close" onClick={hideAudioManageModal}>
            Close
          </Button>,
        ]}
        width="98%"
        style={{ top: 10, maxWidth: '1000px' }}
        bodyStyle={{ maxHeight: '85vh', overflowY: 'auto', padding: '12px' }}
      >
        {/* Add Audio Form Section */}
        {!showUploadForm ? (
          <div style={{ marginBottom: 20 }}>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              onClick={() => setShowUploadForm(true)}
              block
              size="large"
            >
              Add New Audio
            </Button>
          </div>
        ) : (
          <Card style={{ marginBottom: 20, background: '#f9f9f9' }} title={editingAudio ? '✏️ Edit Audio' : '➕ Add New Audio'}>
            <Form
              form={audioUploadForm}
              layout="vertical"
              onFinish={handleAudioSubmit}
            >
              <Form.Item label="Upload Audio File" required>
                <Upload
                  beforeUpload={handleAudioFileUpload}
                  maxCount={1}
                  showUploadList={false}
                  accept="audio/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploadingAudioFile} block>
                    {currentAudioUrl ? 'Change Audio File' : 'Upload Audio File'}
                  </Button>
                </Upload>
                {currentAudioUrl && (
                  <div style={{ marginTop: 8 }}>
                    <span style={{ color: 'green' }}>✓ Audio uploaded</span>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4, wordBreak: 'break-all' }}>
                      {currentAudioUrl}
                    </div>
                    <audio controls style={{ width: '100%', marginTop: 8 }}>
                      <source src={currentAudioUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
              </Form.Item>

              <Form.Item
                name="title"
                label="Audio Title"
                rules={[
                  { required: true, message: 'Please enter audio title!' },
                  { min: 3, message: 'Title must be at least 3 characters!' },
                ]}
              >
                <Input placeholder="e.g., Breathing Exercises 5" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { min: 10, message: 'Description must be at least 10 characters!' },
                ]}
              >
                <Input.TextArea rows={3} placeholder="e.g., Start your day with peace (Optional)" />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button 
                  className="mr-2" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  disabled={!currentAudioUrl}
                  loading={uploadingAudioFile}
                >
                  {editingAudio ? 'Update Audio' : 'Add Audio'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}

        <div style={{ marginBottom: 16 }}>
          <h4>Category Audios ({categoryAudios.length})</h4>
        </div>
        
        {categoryAudios.length > 0 ? (
          <List
            dataSource={categoryAudios}
            renderItem={(audio) => (
              <List.Item
                key={audio._id}
                style={{ 
                  padding: '12px', 
                  border: '1px solid #e8e8e8', 
                  borderRadius: '8px',
                  marginBottom: '12px',
                  background: '#fafafa'
                }}
                actions={[
                  <Button 
                    type="link" 
                    icon={<EditOutlined />}
                    onClick={() => handleEditAudio(audio)}
                    size="small"
                  >
                    <span className="d-none d-sm-inline">Edit</span>
                  </Button>,
                  <Popconfirm
                    title="Delete this audio?"
                    onConfirm={() => handleDeleteAudio(audio._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger icon={<DeleteOutlined />} size="small">
                      <span className="d-none d-sm-inline">Delete</span>
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '10px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <strong style={{ wordBreak: 'break-word' }}>{audio.title || 'Untitled'}</strong>
                      {audio.description && (
                        <div style={{ fontSize: '13px', color: '#666', marginTop: '4px', wordBreak: 'break-word' }}>
                          {audio.description}
                        </div>
                      )}
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '4px', wordBreak: 'break-all' }}>
                        {audio.audioUrl}
                      </div>
                    </div>
                  </div>
                  
                  {/* HTML5 Audio Player */}
                  <audio 
                    controls 
                    style={{ width: '100%', marginTop: '8px', maxWidth: '100%' }}
                    preload="metadata"
                    controlsList="nodownload"
                  >
                    <source src={audio.audioUrl} type="audio/mpeg" />
                    <source src={audio.audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            background: '#f5f5f5',
            borderRadius: '8px',
            color: '#999'
          }}>
            <PlayCircleOutlined style={{ fontSize: '48px', marginBottom: '10px', opacity: 0.3 }} />
            <div>No audio files yet. Click "Add New Audio" to upload.</div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ProductList;




