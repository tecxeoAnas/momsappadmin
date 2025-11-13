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
  Upload,
  Image,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined, PlayCircleOutlined, MinusCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../../../../services/courseService';
import { imageUploader } from '../../../../utils/mediaUploader';

const CourseList = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.course);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [stepsModalVisible, setStepsModalVisible] = useState(false);
  const [stepsForm] = Form.useForm();
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentCourseSteps, setCurrentCourseSteps] = useState([]);

  // Fetch courses on component mount
  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  // Update filtered courses when courses change
  useEffect(() => {
    const activeCourseslist = courses.filter((course) => course.isActive !== false);
    setFilteredCourses(activeCourseslist);
  }, [courses]);

  // Filter courses based on search text
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = courses
      .filter((course) => course.isActive !== false)
      .filter(
        (course) =>
          course.name?.toLowerCase().includes(value.toLowerCase()) ||
          course.category?.toLowerCase().includes(value.toLowerCase()) ||
          course.instructor?.toLowerCase().includes(value.toLowerCase())
      );

    setFilteredCourses(filtered);
  };

  // Open create modal
  const handleAddCourse = () => {
    setIsEditMode(false);
    setSelectedCourseId(null);
    form.resetFields();
    setThumbnailUrl('');
    setVideoUrl('');
    setIsModalVisible(true);
  };

  // Open edit modal
  const handleEditCourse = (course) => {
    setIsEditMode(true);
    setSelectedCourseId(course.id);
    setThumbnailUrl(course.thumbnail || '');
      setVideoUrl(course.url || course.video || '');
    form.setFieldsValue({
      name: course.name,
      subtitle: course.subtitle,
      description: course.description,
      subdescription: course.subdescription,
      pro_tip: course.pro_tip,
      nextstop: course.nextstop,
      category: course.category,
      difficulty: course.difficulty,
      estimatedDuration: course.estimatedDuration,
      rankNumber: course.rankNumber || 1,
      steps: course.steps || [],
      thumbnail: course.thumbnail,
      url: course.url || course.video,
      isActive: course.isActive,
    });
    setIsModalVisible(true);
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (file) => {
    try {
      const url = await imageUploader(file, setThumbnailUploading, false);
      setThumbnailUrl(url);
      form.setFieldsValue({ thumbnail: url });
      message.success('Thumbnail uploaded successfully!');
      return false; // Prevent default upload behavior
    } catch (error) {
      message.error('Failed to upload thumbnail: ' + error.message);
      return false;
    }
  };

  // Handle video upload
  const handleVideoUpload = async (file) => {
    try {
      const url = await imageUploader(file, setVideoUploading, false);
      setVideoUrl(url);
      form.setFieldsValue({ url: url });
      message.success('Video uploaded successfully!');
      return false; // Prevent default upload behavior
    } catch (error) {
      message.error('Failed to upload video: ' + error.message);
      return false;
    }
  };

  // Handle view details
  const handleViewDetails = (course) => {
    console.log("=== COURSE DETAIL ===");
    console.log("Full Course Data:", course);
    console.log("Video URL (url field):", course.url);
    console.log("Video URL (video field):", course.video);
    console.log("Thumbnail:", course.thumbnail);
    console.log("All fields:", Object.keys(course));
    console.log("====================");
    
    // Force set both fields
    const courseWithVideo = {
      ...course,
      url: course.url || course.video,
      video: course.url || course.video,
    };
    
    setSelectedCourse(courseWithVideo);
    setDetailModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const courseData = {
        ...values,
        steps: values.steps || [],
      };

      if (isEditMode) {
        // Update existing course
        await dispatch(
          updateCourse({
            courseId: selectedCourseId,
            courseData,
          })
        ).unwrap();
        message.success('Course updated successfully!');
      } else {
        // Create new course
        await dispatch(createCourse(courseData)).unwrap();
        message.success('Course created successfully!');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error(err || 'Failed to save course');
    }
  };

  // Handle delete
  const handleDeleteCourse = (courseId) => {
    dispatch(deleteCourse(courseId))
      .unwrap()
      .then(() => {
        message.success('Course deactivated successfully!');
      })
      .catch((err) => {
        message.error(err || 'Failed to delete course');
      });
  };

  // Handle view steps
  const handleViewSteps = (course) => {
    stepsForm.setFieldsValue({
      steps: course.steps || [],
    });
    setStepsModalVisible(true);
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rankNumber',
      key: 'rankNumber',
      width: 70,
      sorter: (a, b) => (a.rankNumber || 0) - (b.rankNumber || 0),
      render: (rank) => <Tag color="purple">#{rank || 1}</Tag>,
    },
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 110,
      render: (text) => {
        let color = 'green';
        if (text === 'Intermediate') color = 'orange';
        if (text === 'Advanced') color = 'red';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Steps',
      dataIndex: 'steps',
      key: 'steps',
      width: 70,
      render: (steps, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => handleViewSteps(record)}
        >
          {steps?.length || 0}
        </Button>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      width: 90,
      render: (isActive) => (
        <Tag color={isActive !== false ? 'green' : 'red'}>
          {isActive !== false ? 'Active' : 'Deactivated'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditCourse(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Course"
              description="Are you sure you want to deactivate this course?"
              onConfirm={() => handleDeleteCourse(record.id)}
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
          placeholder="Search by name, category, or instructor..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: '300px' }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCourse}>
          Add Course
        </Button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={filteredCourses}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={isEditMode ? 'Edit Course' : 'Create New Course'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setThumbnailUrl('');
          setVideoUrl('');
          setIsEditMode(false);
          setSelectedCourse(null);
        }}
        footer={null}
        width={950}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '24px' }}
        destroyOnClose={true}
        afterClose={() => {
          form.resetFields();
          setThumbnailUrl('');
          setVideoUrl('');
          setIsEditMode(false);
          setSelectedCourse(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Course Name"
            rules={[{ required: true, message: 'Please enter course name' }]}
          >
            <Input placeholder="e.g., Introduction to JavaScript" />
          </Form.Item>

          <Form.Item
            name="subtitle"
            label="Subtitle"
            rules={[{ required: false }]}
          >
            <Input placeholder="Course subtitle" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter course description' }]}
          >
            <Input.TextArea rows={3} placeholder="Course description" />
          </Form.Item>

          <Form.Item
            name="subdescription"
            label="Sub Description"
            rules={[{ required: false }]}
          >
            <Input.TextArea rows={2} placeholder="Additional description details" />
          </Form.Item>

          <Form.Item
            name="pro_tip"
            label="Pro Tip"
            rules={[{ required: false }]}
          >
            <Input.TextArea rows={2} placeholder="Helpful tip for this course" />
          </Form.Item>

          <Form.Item
            name="nextstop"
            label="Next Stop"
            rules={[{ required: false }]}
          >
            <Input.TextArea rows={2} placeholder="Information about the next step" />
          </Form.Item>

          <Form.Item
            name="rankNumber"
            label="Rank Number"
            rules={[{ required: true, message: 'Please enter rank number' }]}
          >
            <InputNumber min={1} placeholder="1" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category">
              <Select.Option value="Programming">Programming</Select.Option>
              <Select.Option value="Design">Design</Select.Option>
              <Select.Option value="Business">Business</Select.Option>
              <Select.Option value="Marketing">Marketing</Select.Option>
              <Select.Option value="Data Science">Data Science</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="Difficulty Level"
            rules={[{ required: true, message: 'Please select difficulty level' }]}
          >
            <Select placeholder="Select difficulty">
              <Select.Option value="Beginner">Beginner</Select.Option>
              <Select.Option value="Intermediate">Intermediate</Select.Option>
              <Select.Option value="Advanced">Advanced</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="estimatedDuration"
            label="Estimated Duration"
            rules={[{ required: true, message: 'Please enter duration' }]}
          >
            <Input placeholder="e.g., 4 hours" />
          </Form.Item>

          <Form.Item
            name="url"
            label="Video URL"
            rules={[{ required: true, message: 'Please enter video URL' }]}
          >
            <Input placeholder="e.g., https://example.com/video.mp4" />
          </Form.Item>

          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <>
                <div style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '16px', borderBottom: '2px solid #1890ff', paddingBottom: '8px' }}>
                  Course Steps
                </div>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div 
                    key={key} 
                    style={{ 
                      marginBottom: '20px',
                      padding: '20px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '8px',
                      background: '#fafafa',
                      position: 'relative'
                    }}
                  >
                    <div style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '10px',
                      cursor: 'pointer',
                      color: '#ff4d4f',
                      fontSize: '18px'
                    }}>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>

                    <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#1890ff' }}>
                      Step {index + 1}
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      label="Step Title"
                      rules={[{ required: true, message: 'Please enter step title' }]}
                    >
                      <Input placeholder="e.g., Python Basics" size="large" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'order']}
                      label="Order"
                      initialValue={index + 1}
                      hidden
                    >
                      <InputNumber />
                    </Form.Item>

                    <Form.List name={[name, 'description']}>
                      {(descFields, { add: addDesc, remove: removeDesc }) => (
                        <>
                          <div style={{ marginBottom: '10px', fontWeight: '500' }}>
                            Description Points
                          </div>
                          {descFields.map((descField, descIndex) => (
                            <Space 
                              key={descField.key} 
                              style={{ display: 'flex', marginBottom: 10, width: '100%' }} 
                              align="baseline"
                            >
                              <div style={{ 
                                width: '30px', 
                                height: '30px', 
                                background: '#1890ff', 
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '12px'
                              }}>
                                {descIndex + 1}
                              </div>
                              <Form.Item
                                {...descField}
                                style={{ marginBottom: 0, flex: 1 }}
                                rules={[{ required: true, message: 'Please enter description point' }]}
                              >
                                <Input.TextArea 
                                  rows={2} 
                                  placeholder="e.g., Variables, data types, and operators."
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                              <MinusCircleOutlined 
                                onClick={() => removeDesc(descField.name)}
                                style={{ color: '#ff4d4f', fontSize: '16px' }}
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button 
                              type="dashed" 
                              onClick={() => addDesc()} 
                              block 
                              icon={<PlusOutlined />}
                              style={{ marginTop: '10px' }}
                            >
                              Add Description Point
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                ))}
                <Form.Item>
                  <Button 
                    type="primary" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                    size="large"
                    style={{ marginTop: '10px' }}
                  >
                    Add New Step
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item label="Thumbnail Image">
            <Space.Compact style={{ width: '100%', marginBottom: '10px' }}>
              <Input 
                placeholder="Or paste Cloudinary URL here"
                value={thumbnailUrl}
                onChange={(e) => {
                  setThumbnailUrl(e.target.value);
                  form.setFieldsValue({ thumbnail: e.target.value });
                }}
              />
              <Upload
                accept="image/*"
                beforeUpload={handleThumbnailUpload}
                showUploadList={false}
                disabled={thumbnailUploading}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  loading={thumbnailUploading}
                >
                  {thumbnailUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </Upload>
            </Space.Compact>
            {thumbnailUrl && (
              <div style={{ marginTop: '10px' }}>
                <Image
                  src={thumbnailUrl}
                  alt="Thumbnail Preview"
                  style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                />
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
              💡 Tip: Backend endpoint /public/upload not available. Please paste Cloudinary URL manually or ask backend developer for correct endpoint.
            </div>
          </Form.Item>

          <Form.Item name="thumbnail" hidden>
            <Input />
          </Form.Item>

          <Form.Item label="Video Upload">
            <Space.Compact style={{ width: '100%', marginBottom: '10px' }}>
              <Input 
                placeholder="Or paste video URL here (will update the Video URL field above)"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  form.setFieldsValue({ url: e.target.value });
                }}
              />
              <Upload
                accept="video/*"
                beforeUpload={handleVideoUpload}
                showUploadList={false}
                disabled={videoUploading}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  loading={videoUploading}
                >
                  {videoUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </Upload>
            </Space.Compact>
            {videoUrl && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ 
                  padding: '10px', 
                  background: '#f0f0f0', 
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Video URL added</div>
                    <div style={{ fontSize: '12px', color: '#999', wordBreak: 'break-all' }}>
                      {videoUrl}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
              💡 Tip: Backend endpoint /public/upload not available. Please paste Cloudinary URL manually or ask backend developer for correct endpoint.
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isEditMode ? 'Update Course' : 'Create Course'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Steps Modal */}
      <Modal
        title="Course Steps"
        open={stepsModalVisible}
        onCancel={() => {
          setStepsModalVisible(false);
          setCurrentCourseSteps([]);
        }}
        footer={null}
        width={700}
        destroyOnClose={true}
        afterClose={() => {
          setCurrentCourseSteps([]);
        }}
      >
        <Form form={stepsForm} layout="vertical">
          <Form.List name="steps">
            {(fields) => (
              <div>
                {fields.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#999' }}>
                    No steps added to this course yet.
                  </p>
                ) : (
                  fields.map((field, index) => (
                    <div key={field.key} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                      <h4>Step {index + 1}</h4>
                      <Form.Item {...field} name={[field.name, 'title']} noStyle>
                        <Input
                          readOnly
                          placeholder="Title"
                          style={{ marginBottom: '10px' }}
                        />
                      </Form.Item>
                      <Form.Item {...field} name={[field.name, 'content']} noStyle>
                        <Input.TextArea
                          readOnly
                          rows={3}
                          placeholder="Content"
                        />
                      </Form.Item>
                    </div>
                  ))
                )}
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Course Detail Modal */}
      <Modal
        title="Course Details"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedCourse(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setDetailModalVisible(false);
              handleEditCourse(selectedCourse);
            }}
          >
            Edit Course
          </Button>,
        ]}
        width={800}
        destroyOnClose={true}
        afterClose={() => {
          setSelectedCourse(null);
        }}
      >
        {selectedCourse && (
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {/* Basic Information */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ borderBottom: '2px solid #1890ff', paddingBottom: '10px' }}>
                Basic Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <div>
                  <strong>Course Name:</strong>
                  <div>{selectedCourse.name}</div>
                </div>
                <div>
                  <strong>Subtitle:</strong>
                  <div>{selectedCourse.subtitle || 'N/A'}</div>
                </div>
                <div>
                  <strong>Rank Number:</strong>
                  <div>
                    <Tag color="purple">#{selectedCourse.rankNumber || 1}</Tag>
                  </div>
                </div>
                <div>
                  <strong>Category:</strong>
                  <div>
                    <Tag color="blue">{selectedCourse.category}</Tag>
                  </div>
                </div>
                <div>
                  <strong>Difficulty:</strong>
                  <div>
                    <Tag color={
                      selectedCourse.difficulty === 'Beginner' ? 'green' :
                      selectedCourse.difficulty === 'Intermediate' ? 'orange' : 'red'
                    }>
                      {selectedCourse.difficulty}
                    </Tag>
                  </div>
                </div>
                <div>
                  <strong>Duration:</strong>
                  <div>{selectedCourse.estimatedDuration || 'N/A'}</div>
                </div>
                <div>
                  <strong>Status:</strong>
                  <div>
                    <Tag color={selectedCourse.isActive !== false ? 'green' : 'red'}>
                      {selectedCourse.isActive !== false ? 'Active' : 'Inactive'}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ borderBottom: '2px solid #1890ff', paddingBottom: '10px' }}>
                Description
              </h3>
              <div style={{ marginTop: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
                {selectedCourse.description || 'No description available'}
              </div>
            </div>

            {/* Sub Description */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ borderBottom: '2px solid #1890ff', paddingBottom: '10px' }}>
                Sub Description
              </h3>
              <div style={{ marginTop: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
                {selectedCourse.subdescription || 'No sub description available'}
              </div>
            </div>

            {/* Pro Tip */}
            {selectedCourse.pro_tip && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '2px solid #1890ff', paddingBottom: '10px' }}>
                  💡 Pro Tip
                </h3>
                <div style={{ marginTop: '15px', padding: '15px', background: '#fff7e6', borderRadius: '5px', borderLeft: '4px solid #faad14' }}>
                  {selectedCourse.pro_tip}
                </div>
              </div>
            )}

            {/* Next Stop */}
            {selectedCourse.nextstop && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '2px solid #1890ff', paddingBottom: '10px' }}>
                  🎯 Next Stop
                </h3>
                <div style={{ marginTop: '15px', padding: '15px', background: '#e6f7ff', borderRadius: '5px', borderLeft: '4px solid #1890ff' }}>
                  {selectedCourse.nextstop}
                </div>
              </div>
            )}

            {/* Media */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ borderBottom: '2px solid #1890ff', paddingBottom: '10px' }}>
                Media
              </h3>
              
              {/* Thumbnail */}
              <div style={{ marginTop: '15px', marginBottom: '20px' }}>
                <strong style={{ display: 'block', marginBottom: '10px' }}>Thumbnail:</strong>
                {selectedCourse.thumbnail ? (
                  <Image
                    src={selectedCourse.thumbnail}
                    alt="Course thumbnail"
                    style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
                  />
                ) : (
                  <div style={{ color: '#999', padding: '20px', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center' }}>
                    No thumbnail available
                  </div>
                )}
              </div>

              {/* Video Player */}
              <div style={{ marginTop: '15px' }}>
                <strong style={{ display: 'block', marginBottom: '10px' }}>Course Video:</strong>
                {(selectedCourse.url || selectedCourse.video) ? (
                  <div>
                    <video 
                      controls 
                      style={{ 
                        width: '100%', 
                        maxHeight: '400px',
                        borderRadius: '8px',
                        background: '#000',
                        marginBottom: '10px'
                      }}
                      preload="metadata"
                    >
                      <source src={selectedCourse.url || selectedCourse.video} type="video/mp4" />
                      <source src={selectedCourse.url || selectedCourse.video} type="video/webm" />
                      <source src={selectedCourse.url || selectedCourse.video} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                    <div style={{ 
                      padding: '10px', 
                      background: '#f0f0f0', 
                      borderRadius: '5px',
                      fontSize: '12px'
                    }}>
                      <PlayCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                      <span style={{ color: '#666', wordBreak: 'break-all' }}>
                        {selectedCourse.url || selectedCourse.video}
                      </span>
                      <a 
                        href={selectedCourse.url || selectedCourse.video} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ marginLeft: '10px', fontSize: '12px' }}
                      >
                        Open in new tab →
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    color: '#999', 
                    padding: '40px', 
                    background: '#f5f5f5', 
                    borderRadius: '8px', 
                    textAlign: 'center'
                  }}>
                    <PlayCircleOutlined style={{ fontSize: '48px', marginBottom: '10px', opacity: 0.3 }} />
                    <div>No video available</div>
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>
                      (Checked both 'url' and 'video' fields)
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Course Steps */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ borderBottom: '2px solid #1890ff', paddingBottom: '10px' }}>
                Course Steps ({selectedCourse.steps?.length || 0})
              </h3>
              {selectedCourse.steps && selectedCourse.steps.length > 0 ? (
                <div style={{ marginTop: '15px' }}>
                  {selectedCourse.steps.map((step, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        marginBottom: '20px', 
                        padding: '20px', 
                        border: '2px solid #e6f7ff', 
                        borderRadius: '8px',
                        background: '#fafafa'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <Tag color="blue" style={{ marginRight: '10px', fontSize: '14px', padding: '4px 12px' }}>
                          Step {step.order || index + 1}
                        </Tag>
                        <strong style={{ fontSize: '16px', color: '#1890ff' }}>{step.title}</strong>
                      </div>
                      
                      {/* Description Points */}
                      <div style={{ paddingLeft: '15px' }}>
                        {Array.isArray(step.description) ? (
                          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
                            {step.description.map((point, pointIndex) => (
                              <li 
                                key={pointIndex} 
                                style={{ 
                                  marginBottom: '8px', 
                                  lineHeight: '1.6',
                                  fontSize: '14px'
                                }}
                              >
                                {point}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div style={{ color: '#666', lineHeight: '1.6' }}>
                            {step.description || step.content || 'No description'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#999', marginTop: '15px', padding: '20px' }}>
                  No steps added to this course yet.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourseList;
