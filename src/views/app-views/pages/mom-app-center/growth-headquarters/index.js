import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, message, Popconfirm, Space, Tag, Select, DatePicker, InputNumber, Upload, Divider, Switch } from 'antd';
import { TrophyOutlined, PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import monthlyChallengeService from 'services/monthlyChallengeService';
import { imageUploader } from 'utils/mediaUploader';
import { ROW_GUTTER } from 'constants/ThemeConstant';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const GrowthHeadquarters = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [form] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // Upload states for Moms Training
  const [trainingVideoUrl, setTrainingVideoUrl] = useState('');
  const [trainingThumbnailUrl, setTrainingThumbnailUrl] = useState('');
  const [uploadingTrainingVideo, setUploadingTrainingVideo] = useState(false);
  const [uploadingTrainingThumbnail, setUploadingTrainingThumbnail] = useState(false);
  const [attachmentUrls, setAttachmentUrls] = useState([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  // Upload states for Monthly Challenges
  const [challengeVideoUrl, setChallengeVideoUrl] = useState('');
  const [challengeThumbnailUrl, setChallengeThumbnailUrl] = useState('');
  const [uploadingChallengeVideo, setUploadingChallengeVideo] = useState(false);
  const [uploadingChallengeThumbnail, setUploadingChallengeThumbnail] = useState(false);

  useEffect(() => {
    if (activeTab === '1') {
      fetchChallenges();
    }
  }, [activeTab]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const data = await monthlyChallengeService.getAllChallenges();
      console.log('Monthly Challenges Raw Data:', data);
      console.log('First item:', data?.[0]);
      console.log('First item keys:', Object.keys(data?.[0] || {}));
      setChallenges(data);
    } catch (error) {
      message.error('Failed to fetch monthly challenges');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (challenge = null) => {
    setEditingChallenge(challenge);
    if (challenge) {
      console.log('🔍 Editing challenge:', challenge);
      console.log('🔍 Challenge ID (_id):', challenge._id);
      console.log('🔍 Challenge ID (id):', challenge.id);
      
      // Set Moms Training URLs (if available in response)
      setTrainingVideoUrl(challenge.trainingUrl || challenge.trainingVideo || challenge.url || '');
      setTrainingThumbnailUrl(challenge.trainingThumbnail || challenge.trainingThumb || challenge.thumbnail || '');
      setAttachmentUrls(challenge.trainingAttachments || challenge.attachments || []);
      
      // Set Monthly Challenge URLs (from first challenge if exists)
      const firstChallenge = challenge.monthlyChallenges?.[0];
      setChallengeVideoUrl(firstChallenge?.url || '');
      setChallengeThumbnailUrl(firstChallenge?.thumbnail || '');
      
      form.setFieldsValue({
        // Moms Training fields
        name: challenge.name || '',
        description: challenge.description || '',
        status: challenge.status || 'active',
        
        // Monthly Challenge fields (from first challenge if exists)
        challengeName: firstChallenge?.name || '',
        challengeDescription: firstChallenge?.description || '',
        category: firstChallenge?.category || 'General',
        instructor: firstChallenge?.instructor || 'Admin',
        priority: firstChallenge?.priority || 1,
        steps: firstChallenge?.steps || [{ title: '', description: [''], order: 1 }],
      });
    } else {
      form.resetFields();
      setTrainingVideoUrl('');
      setTrainingThumbnailUrl('');
      setAttachmentUrls([]);
      setChallengeVideoUrl('');
      setChallengeThumbnailUrl('');
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingChallenge(null);
    setIsModalVisible(false);
    setTrainingVideoUrl('');
    setTrainingThumbnailUrl('');
    setAttachmentUrls([]);
    setChallengeVideoUrl('');
    setChallengeThumbnailUrl('');
  };

  // Upload handlers for Moms Training
  const handleTrainingVideoUpload = async (file) => {
    setUploadingTrainingVideo(true);
    try {
      const url = await imageUploader(file, setUploadingTrainingVideo);
      setTrainingVideoUrl(url);
      message.success('Training video uploaded successfully');
    } catch (error) {
      message.error('Training video upload failed');
    } finally {
      setUploadingTrainingVideo(false);
    }
    return false;
  };

  const handleTrainingThumbnailUpload = async (file) => {
    setUploadingTrainingThumbnail(true);
    try {
      const url = await imageUploader(file, setUploadingTrainingThumbnail);
      setTrainingThumbnailUrl(url);
      message.success('Training thumbnail uploaded successfully');
    } catch (error) {
      message.error('Training thumbnail upload failed');
    } finally {
      setUploadingTrainingThumbnail(false);
    }
    return false;
  };

  const handleAttachmentUpload = async (file) => {
    setUploadingAttachment(true);
    try {
      const url = await imageUploader(file, setUploadingAttachment);
      setAttachmentUrls([...attachmentUrls, url]);
      message.success('Attachment uploaded successfully');
    } catch (error) {
      message.error('Attachment upload failed');
    } finally {
      setUploadingAttachment(false);
    }
    return false;
  };

  const removeAttachment = (index) => {
    const newAttachments = attachmentUrls.filter((_, i) => i !== index);
    setAttachmentUrls(newAttachments);
  };

  // Upload handlers for Monthly Challenges
  const handleChallengeVideoUpload = async (file) => {
    setUploadingChallengeVideo(true);
    try {
      const url = await imageUploader(file, setUploadingChallengeVideo);
      setChallengeVideoUrl(url);
      message.success('Challenge video uploaded successfully');
    } catch (error) {
      message.error('Challenge video upload failed');
    } finally {
      setUploadingChallengeVideo(false);
    }
    return false;
  };

  const handleChallengeThumbnailUpload = async (file) => {
    setUploadingChallengeThumbnail(true);
    try {
      const url = await imageUploader(file, setUploadingChallengeThumbnail);
      setChallengeThumbnailUrl(url);
      message.success('Challenge thumbnail uploaded successfully');
    } catch (error) {
      message.error('Challenge thumbnail upload failed');
    } finally {
      setUploadingChallengeThumbnail(false);
    }
    return false;
  };

  const handleSubmit = async (values) => {
    try {
      // Get current date for default month
      const currentDate = new Date();
      const defaultMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      // Calculate default start and end dates (current month)
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const payload = {
        // Moms Training data
        trainingName: values.name,
        trainingUrl: trainingVideoUrl,
        trainingThumbnail: trainingThumbnailUrl,
        trainingDescription: values.description,
        trainingAttachments: attachmentUrls,
        trainingStatus: values.status,
        
        // Monthly Challenge data (with defaults for removed fields)
        challengeName: values.challengeName,
        challengeDescription: values.challengeDescription,
        challengeUrl: challengeVideoUrl,
        challengeThumbnail: challengeThumbnailUrl,
        category: values.category || 'General',
        difficulty: 'Beginner', // Default value
        estimatedDuration: '4 hours', // Default value
        instructor: values.instructor || 'Admin',
        steps: values.steps || [],
        challengeStatus: values.status,
        month: defaultMonth, // Auto-generated current month
        startDate: startOfMonth.toISOString(), // First day of current month
        endDate: endOfMonth.toISOString(), // Last day of current month
        priority: values.priority || 1,
      };

      if (editingChallenge) {
        // For update, use the new combined update endpoint
        await monthlyChallengeService.updateCombinedTrainingChallenge(editingChallenge._id, payload);
        message.success('Training & Challenge updated successfully');
      } else {
        // For create, use the new combined endpoint
        const response = await monthlyChallengeService.createCombinedTrainingChallenge(payload);
        message.success('Training & Challenge created successfully');
      }
      handleCancel();
      fetchChallenges();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      message.error(editingChallenge ? 'Failed to update' : 'Failed to create');
    }
  };

  const handleDelete = async (id) => {
    try {
      await monthlyChallengeService.deleteCombinedTrainingChallenge(id);
      message.success('Training & Challenge deleted successfully');
      fetchChallenges();
    } catch (error) {
      message.error('Failed to delete');
    }
  };

  const handleStatusToggle = async (record, checked) => {
    try {
      const newStatus = checked ? 'active' : 'inactive';
      await monthlyChallengeService.updateTrainingStatus(record._id, newStatus);
      message.success(`Status updated to ${newStatus.toUpperCase()}`);
      fetchChallenges();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Failed to update status');
    }
  };

  const handleViewDetails = (record) => {
    setViewingRecord(record);
    setIsViewModalVisible(true);
  };

  const expandedRowRender = (record) => {
    const stepColumns = [
      {
        title: 'Order',
        dataIndex: 'order',
        key: 'order',
        width: 80,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (descriptions) => (
          <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
            {descriptions.map((desc, idx) => (
              <li key={idx}>{desc}</li>
            ))}
          </ul>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        width: 100,
        render: (isActive) => (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Active' : 'Inactive'}
          </Tag>
        ),
      },
    ];

    return (
      <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
        {/* MOMS TRAINING SECTION */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ color: '#1890ff', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>📚 MOMS TRAINING DETAILS</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <strong>Training Name:</strong>
              <p>{record.name}</p>
            </div>
            <div>
              <strong>Status:</strong>
              <p>
                <Tag color={record.status === 'active' ? 'green' : 'red'}>
                  {record.status?.toUpperCase()}
                </Tag>
              </p>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Description:</strong>
              <p>{record.description}</p>
            </div>
            {record.url && (
              <div>
                <strong>Video:</strong>
                <p>
                  <a href={record.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                    Watch Video
                  </a>
                </p>
              </div>
            )}
            {record.thumbnail && (
              <div>
                <strong>Thumbnail:</strong>
                <p>
                  <a href={record.thumbnail} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                    View Thumbnail
                  </a>
                </p>
              </div>
            )}
            {record.attachments && record.attachments.length > 0 && (
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Attachments ({record.attachments.length}):</strong>
                <ul>
                  {record.attachments.map((att, idx) => (
                    <li key={idx}>
                      <a href={att} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                        Attachment {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* MONTHLY CHALLENGES SECTION */}
        {record.monthlyChallenges && record.monthlyChallenges.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#1890ff', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
              🏆 MONTHLY CHALLENGES ({record.monthlyChallenges.length})
            </h4>
            {record.monthlyChallenges.map((challenge, idx) => (
              <div key={challenge._id || idx} style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e8e8e8' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <strong>Challenge Name:</strong>
                    <p>{challenge.name}</p>
                  </div>
                  <div>
                    <strong>Month:</strong>
                    <p>{challenge.month}</p>
                  </div>
                  <div>
                    <strong>Difficulty:</strong>
                    <p>
                      <Tag color={challenge.difficulty === 'Beginner' ? 'green' : challenge.difficulty === 'Intermediate' ? 'orange' : 'red'}>
                        {challenge.difficulty}
                      </Tag>
                    </p>
                  </div>
                  <div>
                    <strong>Duration:</strong>
                    <p>{challenge.estimatedDuration}</p>
                  </div>
                  <div>
                    <strong>Instructor:</strong>
                    <p>{challenge.instructor}</p>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <p>
                      <Tag color={challenge.status === 'active' ? 'green' : 'red'}>
                        {challenge.status?.toUpperCase()}
                      </Tag>
                    </p>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Description:</strong>
                    <p>{challenge.description}</p>
                  </div>
                  {challenge.url && (
                    <div>
                      <strong>Video:</strong>
                      <p>
                        <a href={challenge.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                          Watch Challenge Video
                        </a>
                      </p>
                    </div>
                  )}
                  {challenge.thumbnail && (
                    <div>
                      <strong>Thumbnail:</strong>
                      <p>
                        <a href={challenge.thumbnail} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                          View Thumbnail
                        </a>
                      </p>
                    </div>
                  )}
                </div>

                {/* CHALLENGE STEPS */}
                {challenge.steps && challenge.steps.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <h5 style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>📝 CHALLENGE STEPS ({challenge.steps.length})</h5>
                    <Table
                      columns={stepColumns}
                      dataSource={challenge.steps}
                      pagination={false}
                      size="small"
                      rowKey="_id"
                      bordered
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!record.monthlyChallenges || record.monthlyChallenges.length === 0 && (
          <div style={{ padding: '12px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffc107' }}>
            <p style={{ margin: 0, color: '#856404' }}>⚠️ No monthly challenges added yet.</p>
          </div>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: 'Training Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Training Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Challenge Name',
      key: 'challengeName',
      width: 200,
      render: (_, record) => {
        const challenge = record.monthlyChallenges?.[0];
        return challenge?.name ? (
          <span>{challenge.name}</span>
        ) : (
          <Tag color="orange">No Challenge</Tag>
        );
      },
    },
    {
      title: 'Challenge Description',
      key: 'challengeDescription',
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        const challenge = record.monthlyChallenges?.[0];
        return challenge?.description || '-';
      },
    },
    {
      title: 'Total Steps',
      key: 'totalSteps',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const challenge = record.monthlyChallenges?.[0];
        const stepsCount = challenge?.steps?.length || 0;
        return <Tag color="cyan">{stepsCount}</Tag>;
      },
    },
    {
      title: 'Attachments',
      key: 'attachments',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Tag color="purple">{record.attachments?.length || 0}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status, record) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => handleStatusToggle(record, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
            title="View Details"
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
            title="Edit"
          />
          <Popconfirm
            title="Are you sure you want to delete this training?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              size="small"
              title="Delete"
            />
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
                <TrophyOutlined />
                Monthly Challenge
              </span>
            }
            key="1"
          >
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Training with Challenges Management</h3>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showModal()}
                >
                  Create New Training & Challenge
                </Button>
              </div>
              <Table
                columns={columns}
                dataSource={challenges}
                loading={loading}
                rowKey="_id"
                expandable={{
                  expandedRowRender,
                  expandedRowKeys,
                  onExpandedRowsChange: (keys) => setExpandedRowKeys(keys),
                }}
                scroll={{ x: 1800 }}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingChallenge ? 'Edit Monthly Challenge' : 'Create New Monthly Challenge'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
        width={900}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        afterClose={() => {
          form.resetFields();
          setEditingChallenge(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'active',
            steps: [{ title: '', description: [''], order: 1 }]
          }}
        >
          {/* ========== MOMS TRAINING SECTION ========== */}
          <Divider orientation="left" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
            MOMS TRAINING
          </Divider>

          <Form.Item
            name="name"
            label="Training Name"
            rules={[{ required: true, message: 'Please enter training name' }]}
          >
            <Input placeholder="Enter training name (e.g., Cookies and cream)" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Training Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={3} placeholder="Enter training description" />
          </Form.Item>

          <Form.Item label="Training Video Upload" required>
            <Upload
              beforeUpload={handleTrainingVideoUpload}
              maxCount={1}
              showUploadList={false}
              accept="video/*"
            >
              <Button icon={<UploadOutlined />} loading={uploadingTrainingVideo}>
                {trainingVideoUrl ? 'Change Video' : 'Upload Video'}
              </Button>
            </Upload>
            {trainingVideoUrl && (
              <div style={{ marginTop: 8 }}>
                <span style={{ color: 'green' }}>✓ Video uploaded</span>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4, wordBreak: 'break-all' }}>{trainingVideoUrl}</div>
              </div>
            )}
          </Form.Item>

          <Form.Item label="Training Thumbnail Upload" required>
            <Upload
              beforeUpload={handleTrainingThumbnailUpload}
              maxCount={1}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={uploadingTrainingThumbnail}>
                {trainingThumbnailUrl ? 'Change Thumbnail' : 'Upload Thumbnail'}
              </Button>
            </Upload>
            {trainingThumbnailUrl && (
              <div style={{ marginTop: 8 }}>
                <span style={{ color: 'green' }}>✓ Thumbnail uploaded</span>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4, wordBreak: 'break-all' }}>{trainingThumbnailUrl}</div>
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Attachments (Optional)">
            <Upload
              beforeUpload={handleAttachmentUpload}
              showUploadList={false}
              accept="image/*,video/*,application/pdf,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            >
              <Button icon={<UploadOutlined />} loading={uploadingAttachment}>
                Add Attachment (Images, Videos, PDFs, Documents)
              </Button>
            </Upload>
            {attachmentUrls.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {attachmentUrls.map((url, index) => {
                  // Detect file type from URL
                  const getFileIcon = (fileUrl) => {
                    if (fileUrl.match(/\.(jpg|jpeg|png|gif|webp)/i)) return '🖼️ Image';
                    if (fileUrl.match(/\.(mp4|mov|avi|wmv|webm)/i)) return '🎥 Video';
                    if (fileUrl.match(/\.pdf/i)) return '📄 PDF';
                    if (fileUrl.match(/\.(doc|docx)/i)) return '📝 Word';
                    if (fileUrl.match(/\.(xls|xlsx)/i)) return '📊 Excel';
                    if (fileUrl.match(/\.(ppt|pptx)/i)) return '📽️ PowerPoint';
                    return '📎 File';
                  };
                  
                  return (
                    <div key={index} style={{ marginBottom: 4, display: 'flex', alignItems: 'center', padding: '4px 8px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                      <span style={{ marginRight: 8 }}>{getFileIcon(url)}</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#1890ff', flex: 1, wordBreak: 'break-all' }}>
                        {url.split('/').pop().substring(0, 50)}...
                      </a>
                      <Button 
                        type="link" 
                        danger 
                        size="small" 
                        onClick={() => removeAttachment(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Form.Item>

          {/* ========== MONTHLY CHALLENGE SECTION ========== */}
          <Divider orientation="left" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff', marginTop: 32 }}>
            MONTHLY CHALLENGE
          </Divider>

          <Form.Item
            name="challengeName"
            label="Challenge Name"
            rules={[{ required: true, message: 'Please enter challenge name' }]}
          >
            <Input placeholder="Enter challenge name (e.g., Meal Prep Challenge)" />
          </Form.Item>

          <Form.Item
            name="challengeDescription"
            label="Challenge Description"
            rules={[{ required: true, message: 'Please enter challenge description' }]}
          >
            <TextArea rows={3} placeholder="Enter challenge description" />
          </Form.Item>

          <Form.Item label="Challenge Video Upload" required>
            <Upload
              beforeUpload={handleChallengeVideoUpload}
              maxCount={1}
              showUploadList={false}
              accept="video/*"
            >
              <Button icon={<UploadOutlined />} loading={uploadingChallengeVideo}>
                {challengeVideoUrl ? 'Change Video' : 'Upload Video'}
              </Button>
            </Upload>
            {challengeVideoUrl && (
              <div style={{ marginTop: 8 }}>
                <span style={{ color: 'green' }}>✓ Video uploaded</span>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4, wordBreak: 'break-all' }}>{challengeVideoUrl}</div>
              </div>
            )}
          </Form.Item>

          <Form.Item label="Challenge Thumbnail Upload" required>
            <Upload
              beforeUpload={handleChallengeThumbnailUpload}
              maxCount={1}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={uploadingChallengeThumbnail}>
                {challengeThumbnailUrl ? 'Change Thumbnail' : 'Upload Thumbnail'}
              </Button>
            </Upload>
            {challengeThumbnailUrl && (
              <div style={{ marginTop: 8 }}>
                <span style={{ color: 'green' }}>✓ Thumbnail uploaded</span>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4, wordBreak: 'break-all' }}>{challengeThumbnailUrl}</div>
              </div>
            )}
          </Form.Item>

          {/* Challenge Steps Section */}
          <div style={{ marginBottom: 16 }}>
            <h4>Challenge Steps</h4>
          </div>

          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card 
                    key={key} 
                    style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}
                    size="small"
                    title={`Step ${index + 1}`}
                    extra={
                      fields.length > 1 ? (
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ color: 'red' }}
                        />
                      ) : null
                    }
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      label="Step Title"
                      rules={[{ required: true, message: 'Please enter step title' }]}
                    >
                      <Input placeholder="e.g., Week 1: Foundation" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'order']}
                      label="Order"
                      rules={[{ required: true, message: 'Please enter order' }]}
                    >
                      <InputNumber min={1} placeholder="1" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Step Descriptions">
                      <Form.List name={[name, 'description']}>
                        {(descFields, { add: addDesc, remove: removeDesc }) => (
                          <>
                            {descFields.map((descField, descIndex) => (
                              <Space key={descField.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                  {...descField}
                                  rules={[{ required: true, message: 'Please enter description' }]}
                                  style={{ marginBottom: 0, flex: 1 }}
                                >
                                  <Input placeholder="Enter description point" />
                                </Form.Item>
                                {descFields.length > 1 && (
                                  <MinusCircleOutlined
                                    onClick={() => removeDesc(descField.name)}
                                    style={{ color: 'red' }}
                                  />
                                )}
                              </Space>
                            ))}
                            <Button type="dashed" onClick={() => addDesc()} block icon={<PlusOutlined />}>
                              Add Description Point
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add({ title: '', description: [''], order: fields.length + 1 })} block icon={<PlusOutlined />}>
                  Add Step
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingChallenge ? 'Update' : 'Create'}
              </Button>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title="Training & Challenge Details"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={900}
      >
        {viewingRecord && (
          <div>
            {/* Training Details */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: 8 }}>
                📚 TRAINING DETAILS
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: 16 }}>
                <div>
                  <strong>Name:</strong>
                  <p>{viewingRecord.name}</p>
                </div>
                <div>
                  <strong>Status:</strong>
                  <p>
                    <Tag color={viewingRecord.status === 'active' ? 'green' : 'red'}>
                      {viewingRecord.status?.toUpperCase()}
                    </Tag>
                  </p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Description:</strong>
                  <p>{viewingRecord.description}</p>
                </div>
                {viewingRecord.url && (
                  <div>
                    <strong>Video:</strong>
                    <p>
                      <a href={viewingRecord.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                        Watch Video →
                      </a>
                    </p>
                  </div>
                )}
                {viewingRecord.thumbnail && (
                  <div>
                    <strong>Thumbnail:</strong>
                    <p>
                      <a href={viewingRecord.thumbnail} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                        View Image →
                      </a>
                    </p>
                  </div>
                )}
                {viewingRecord.attachments && viewingRecord.attachments.length > 0 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Attachments ({viewingRecord.attachments.length}):</strong>
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {viewingRecord.attachments.map((att, idx) => {
                        const getFileIcon = (url) => {
                          if (url.match(/\.(jpg|jpeg|png|gif|webp)/i)) return '🖼️ Image';
                          if (url.match(/\.(mp4|mov|avi|wmv|webm)/i)) return '🎥 Video';
                          if (url.match(/\.pdf/i)) return '📄 PDF';
                          if (url.match(/\.(doc|docx)/i)) return '📝 Word';
                          if (url.match(/\.(xls|xlsx)/i)) return '📊 Excel';
                          if (url.match(/\.(ppt|pptx)/i)) return '📽️ PowerPoint';
                          return '📎 File';
                        };
                        
                        return (
                          <div key={idx} style={{ padding: '8px 12px', backgroundColor: '#f0f0f0', borderRadius: 4 }}>
                            <span style={{ marginRight: 8 }}>{getFileIcon(att)}</span>
                            <a href={att} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                              {att.split('/').pop() || `Attachment ${idx + 1}`} →
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Challenge Details */}
            {viewingRecord.monthlyChallenges && viewingRecord.monthlyChallenges.length > 0 && (
              <div>
                <h3 style={{ color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: 8 }}>
                  🏆 MONTHLY CHALLENGES ({viewingRecord.monthlyChallenges.length})
                </h3>
                {viewingRecord.monthlyChallenges.map((challenge, idx) => (
                  <Card key={challenge._id || idx} style={{ marginTop: 16, backgroundColor: '#fafafa' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <strong>Challenge Name:</strong>
                        <p>{challenge.name}</p>
                      </div>
                      <div>
                        <strong>Month:</strong>
                        <p>{challenge.month}</p>
                      </div>
                      <div>
                        <strong>Difficulty:</strong>
                        <p>
                          <Tag color={challenge.difficulty === 'Beginner' ? 'green' : challenge.difficulty === 'Intermediate' ? 'orange' : 'red'}>
                            {challenge.difficulty}
                          </Tag>
                        </p>
                      </div>
                      <div>
                        <strong>Duration:</strong>
                        <p>{challenge.estimatedDuration}</p>
                      </div>
                      <div>
                        <strong>Instructor:</strong>
                        <p>{challenge.instructor}</p>
                      </div>
                      <div>
                        <strong>Status:</strong>
                        <p>
                          <Tag color={challenge.status === 'active' ? 'green' : 'red'}>
                            {challenge.status?.toUpperCase()}
                          </Tag>
                        </p>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Description:</strong>
                        <p>{challenge.description}</p>
                      </div>
                      {challenge.url && (
                        <div>
                          <strong>Video:</strong>
                          <p>
                            <a href={challenge.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                              Watch Challenge Video →
                            </a>
                          </p>
                        </div>
                      )}
                      {challenge.thumbnail && (
                        <div>
                          <strong>Thumbnail:</strong>
                          <p>
                            <a href={challenge.thumbnail} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                              View Image →
                            </a>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Challenge Steps */}
                    {challenge.steps && challenge.steps.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <h4 style={{ marginBottom: 12 }}>📝 Challenge Steps ({challenge.steps.length})</h4>
                        {challenge.steps.map((step, stepIdx) => (
                          <Card key={step._id || stepIdx} size="small" style={{ marginBottom: 8 }}>
                            <div>
                              <strong>Step {step.order}: {step.title}</strong>
                              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                                {step.description.map((desc, descIdx) => (
                                  <li key={descIdx}>{desc}</li>
                                ))}
                              </ul>
                              <div style={{ marginTop: 4 }}>
                                <Tag color={step.isActive ? 'green' : 'red'}>
                                  {step.isActive ? 'Active' : 'Inactive'}
                                </Tag>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {(!viewingRecord.monthlyChallenges || viewingRecord.monthlyChallenges.length === 0) && (
              <div style={{ padding: 16, backgroundColor: '#fff3cd', borderRadius: 4, marginTop: 16 }}>
                <p style={{ margin: 0, color: '#856404' }}>⚠️ No challenges added for this training.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GrowthHeadquarters;
