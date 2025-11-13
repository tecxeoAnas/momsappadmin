// import React, { Component } from 'react'
// import { UserOutlined, LockOutlined, CreditCardOutlined, BellOutlined } from '@ant-design/icons';
// import { Menu } from 'antd';
// import { Link, Route, Navigate, useLocation, Routes } from 'react-router-dom';
// import InnerAppLayout from 'layouts/inner-app-layout';
// import EditProfile from './EditProfile';
// import ChangePassword from './ChangePassword';
// import Billing from './Billing';
// import Notification from './Notification';

// const url = '/app/pages/setting'

// const MenuItem = ({icon, path, label}) => {

// 	return (
// 		<>
// 			{icon}
// 			<span>{label}</span>
// 			<Link to={`${url}/${path}`} />
// 		</>
// 	)
// }

// const SettingOption = () => {

// 	const location = useLocation();

// 	const locationPath = location.pathname.split('/')

// 	const currentpath = locationPath[locationPath.length - 1]

// 	return (
// 		<Menu
// 			mode="inline"
// 			selectedKeys={[currentpath]}
// 			items={[
// 				{
// 					key: 'edit-profile',
// 					label: <MenuItem label="Edit Profile" icon={<UserOutlined />} path="edit-profile" />
// 				},
// 				{
// 					key: 'change-password',
// 					label: <MenuItem label="Change Password" icon={<LockOutlined />} path="change-password" />
// 				},
// 				{
// 					key: 'billing',
// 					label: <MenuItem label="Billing" icon={<CreditCardOutlined />} path="billing" />
// 				},
// 				{
// 					key: 'notification',
// 					label: <MenuItem label="Notification" icon={<BellOutlined />} path="notification" />
// 				},
// 			]}
// 		/>
// 	);
// };

// const SettingContent = () => {

// 	return (
// 		<Routes>
// 			<Route path="edit-profile" element={<EditProfile />} />
// 			<Route path="change-password" element={<ChangePassword />} />
// 			<Route path="billing" element={<Billing />} />
// 			<Route path="notification" element={<Notification />} />
// 			<Route path="*" element={<Navigate to="edit-profile" replace />} />
// 		</Routes>
// 	)
// }

// export class Setting extends Component {
// 	render() {
// 		return (
// 			<InnerAppLayout 
// 				sideContentWidth={320}
// 				sideContent={<SettingOption />}
// 				mainContent={<SettingContent />}
// 			/>
//     	);
// 	}
// }

// export default Setting



// import React, { useState } from 'react';
// import {
//   Card,
//   Input,
//   Button,
//   Modal,
//   Table,
//   Tooltip,
//   Form,
//   Space,
//   message,
//   Upload,
//   Progress,
//   Tag,
//   Tabs,
//   Divider,
//   List,
//   Image,
// } from 'antd';
// import {
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   PlusCircleOutlined,
//   SearchOutlined,
//   UploadOutlined,
//   PlayCircleOutlined,
//   TrophyOutlined,
//   CheckCircleOutlined,
//   StarOutlined,
// } from '@ant-design/icons';
// import dayjs from 'dayjs';

// const { TextArea } = Input;
// const { TabPane } = Tabs;

// const CourseManagement = () => {
//   // State Management
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [searchValue, setSearchValue] = useState('');
  
//   const [addForm] = Form.useForm();
//   const [editForm] = Form.useForm();
//   const [stepForm] = Form.useForm();

//   // Steps and Badges State
//   const [currentSteps, setCurrentSteps] = useState([]);
//   const [currentBadges, setCurrentBadges] = useState([]);
//   const [isStepModalOpen, setIsStepModalOpen] = useState(false);
//   const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

//   // Search Handler
//   const onSearch = (e) => {
//     const value = e.target.value;
//     setSearchValue(value);

//     if (value.trim()) {
//       const filtered = courses.filter(
//         (course) =>
//           course.title.toLowerCase().includes(value.toLowerCase()) ||
//           course.description.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredCourses(filtered);
//     } else {
//       setFilteredCourses(courses);
//     }
//   };

//   // Add Course Handlers
//   const showAddCourseModal = () => {
//     setCurrentSteps([]);
//     setCurrentBadges([]);
//     setIsAddModalOpen(true);
//   };

//   const hideAddCourseModal = () => {
//     setIsAddModalOpen(false);
//     addForm.resetFields();
//     setCurrentSteps([]);
//     setCurrentBadges([]);
//   };

//   const addCourse = (values) => {
//     const newCourse = {
//       id: Date.now(),
//       title: values.title,
//       description: values.description,
//       thumbnail: values.thumbnail?.file?.response?.url || '/placeholder-thumbnail.jpg',
//       videoUrl: values.videoUrl,
//       progress: 0,
//       steps: currentSteps,
//       badges: currentBadges,
//       createdAt: new Date(),
//     };

//     const updatedCourses = [...courses, newCourse];
//     setCourses(updatedCourses);
//     setFilteredCourses(updatedCourses);
//     hideAddCourseModal();
//     message.success('Course added successfully!');
//   };

//   // Edit Course Handlers
//   const showEditCourseModal = (record) => {
//     setSelectedCourse(record);
//     setCurrentSteps(record.steps || []);
//     setCurrentBadges(record.badges || []);
//     setIsEditModalOpen(true);
    
//     setTimeout(() => {
//       editForm.setFieldsValue({
//         title: record.title,
//         description: record.description,
//         videoUrl: record.videoUrl,
//         progress: record.progress,
//       });
//     }, 100);
//   };

//   const hideEditCourseModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedCourse(null);
//     editForm.resetFields();
//     setCurrentSteps([]);
//     setCurrentBadges([]);
//   };

//   const editCourse = (values) => {
//     const updated = courses.map((c) =>
//       c.id === selectedCourse.id
//         ? {
//             ...c,
//             title: values.title,
//             description: values.description,
//             videoUrl: values.videoUrl,
//             progress: values.progress,
//             thumbnail: values.thumbnail?.file?.response?.url || c.thumbnail,
//             steps: currentSteps,
//             badges: currentBadges,
//           }
//         : c
//     );

//     setCourses(updated);
//     setFilteredCourses(updated);
//     hideEditCourseModal();
//     message.success('Course updated successfully!');
//   };

//   // Delete Course Handler
//   const handleDeleteCourse = (id, title) => {
//     Modal.confirm({
//       title: 'Delete Course',
//       content: `Are you sure you want to delete "${title}"?`,
//       okText: 'Delete',
//       okType: 'danger',
//       cancelText: 'Cancel',
//       onOk: () => {
//         const updated = courses.filter((c) => c.id !== id);
//         setCourses(updated);
//         setFilteredCourses(updated);
//         message.success('Course deleted successfully!');
//       },
//     });
//   };

//   // View Course Handler
//   const showCourseDetails = (record) => {
//     setSelectedCourse(record);
//     setIsViewModalOpen(true);
//   };

//   const closeCourseDetails = () => {
//     setIsViewModalOpen(false);
//     setSelectedCourse(null);
//   };

//   // Steps Management
//   const showAddStepModal = () => {
//     setIsStepModalOpen(true);
//   };

//   const addStep = (values) => {
//     const newStep = {
//       id: Date.now(),
//       title: values.stepTitle,
//       description: values.stepDescription,
//       completed: false,
//     };
//     setCurrentSteps([...currentSteps, newStep]);
//     stepForm.resetFields();
//     setIsStepModalOpen(false);
//     message.success('Step added successfully!');
//   };

//   const deleteStep = (stepId) => {
//     setCurrentSteps(currentSteps.filter((s) => s.id !== stepId));
//     message.success('Step deleted successfully!');
//   };

//   // Badges Management
//   const showAddBadgeModal = () => {
//     setIsBadgeModalOpen(true);
//   };

//   const addBadge = (values) => {
//     const newBadge = {
//       id: Date.now(),
//       name: values.badgeName,
//       icon: values.badgeIcon || 'star',
//     };
//     setCurrentBadges([...currentBadges, newBadge]);
//     setIsBadgeModalOpen(false);
//     message.success('Badge added successfully!');
//   };

//   const deleteBadge = (badgeId) => {
//     setCurrentBadges(currentBadges.filter((b) => b.id !== badgeId));
//     message.success('Badge deleted successfully!');
//   };

//   // Upload Props
//   const uploadProps = {
//     name: 'file',
//     action: '/api/upload',
//     onChange(info) {
//       if (info.file.status === 'done') {
//         message.success(`${info.file.name} file uploaded successfully`);
//       } else if (info.file.status === 'error') {
//         message.error(`${info.file.name} file upload failed.`);
//       }
//     },
//   };

//   // Table Columns
//   const tableColumns = [
//     {
//       title: 'Thumbnail',
//       dataIndex: 'thumbnail',
//       width: 100,
//       render: (thumbnail) => (
//         <Image
//           src={thumbnail}
//           alt="course thumbnail"
//           width={60}
//           height={60}
//           style={{ objectFit: 'cover', borderRadius: 8 }}
//           fallback="/placeholder-thumbnail.jpg"
//         />
//       ),
//     },
//     {
//       title: 'Course Title',
//       dataIndex: 'title',
//       render: (_, record) => (
//         <div>
//           <div style={{ fontWeight: 500, fontSize: '14px' }}>
//             {record.title}
//           </div>
//           <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
//             {record.description?.substring(0, 50)}...
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: 'Progress',
//       dataIndex: 'progress',
//       width: 150,
//       render: (progress) => (
//         <Progress
//           percent={progress}
//           size="small"
//           strokeColor={{
//             '0%': '#ff85c0',
//             '100%': '#ff4d94',
//           }}
//         />
//       ),
//       sorter: (a, b) => a.progress - b.progress,
//     },
//     {
//       title: 'Steps',
//       dataIndex: 'steps',
//       width: 80,
//       align: 'center',
//       render: (steps) => (
//         <Tag color="blue">{steps?.length || 0}</Tag>
//       ),
//     },
//     {
//       title: 'Badges',
//       dataIndex: 'badges',
//       width: 80,
//       align: 'center',
//       render: (badges) => (
//         <Tag color="gold">{badges?.length || 0}</Tag>
//       ),
//     },
//     {
//       title: 'Date Added',
//       dataIndex: 'createdAt',
//       width: 150,
//       render: (date) => dayjs(date).format('DD MMM YYYY'),
//       sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
//     },
//     {
//       title: 'Actions',
//       dataIndex: 'actions',
//       align: 'right',
//       width: 150,
//       render: (_, record) => (
//         <Space size="small">
//           <Tooltip title="View">
//             <Button
//               type="primary"
//               icon={<EyeOutlined />}
//               onClick={() => showCourseDetails(record)}
//               size="small"
//             />
//           </Tooltip>
//           <Tooltip title="Edit">
//             <Button
//               icon={<EditOutlined />}
//               onClick={() => showEditCourseModal(record)}
//               size="small"
//             />
//           </Tooltip>
//           <Tooltip title="Delete">
//             <Button
//               danger
//               icon={<DeleteOutlined />}
//               onClick={() => handleDeleteCourse(record.id, record.title)}
//               size="small"
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   // Course Form Fields Component
//   const CourseFormFields = ({ form, isEdit = false }) => (
//     <>
//       <Form.Item
//         label="Course Title"
//         name="title"
//         rules={[
//           { required: true, message: 'Please enter course title!' },
//           { min: 3, message: 'Title must be at least 3 characters!' },
//         ]}
//       >
//         <Input placeholder="Enter course title" size="large" />
//       </Form.Item>

//       <Form.Item
//         label="Course Description"
//         name="description"
//         rules={[
//           { required: true, message: 'Please enter course description!' },
//           { min: 10, message: 'Description must be at least 10 characters!' },
//         ]}
//       >
//         <TextArea
//           placeholder="Enter course description"
//           rows={4}
//           size="large"
//         />
//       </Form.Item>

//       <Form.Item label="Thumbnail" name="thumbnail">
//         <Upload {...uploadProps} listType="picture" maxCount={1}>
//           <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
//         </Upload>
//       </Form.Item>

//       <Form.Item
//         label="Video URL"
//         name="videoUrl"
//         rules={[
//           { required: true, message: 'Please enter video URL!' },
//           { type: 'url', message: 'Please enter a valid URL!' },
//         ]}
//       >
//         <Input
//           placeholder="https://example.com/video.mp4"
//           prefix={<PlayCircleOutlined />}
//           size="large"
//         />
//       </Form.Item>

//       {isEdit && (
//         <Form.Item
//           label="Progress (%)"
//           name="progress"
//           rules={[{ required: true, message: 'Please enter progress!' }]}
//         >
//           <Input type="number" min={0} max={100} size="large" />
//         </Form.Item>
//       )}

//       <Divider>Steps Management</Divider>

//       <div style={{ marginBottom: 16 }}>
//         <Button
//           type="dashed"
//           icon={<PlusCircleOutlined />}
//           onClick={showAddStepModal}
//           block
//         >
//           Add Step
//         </Button>
//       </div>

//       {currentSteps.length > 0 && (
//         <List
//           size="small"
//           bordered
//           dataSource={currentSteps}
//           renderItem={(step) => (
//             <List.Item
//               actions={[
//                 <Button
//                   type="text"
//                   danger
//                   icon={<DeleteOutlined />}
//                   size="small"
//                   onClick={() => deleteStep(step.id)}
//                 />,
//               ]}
//             >
//               <List.Item.Meta
//                 avatar={<CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />}
//                 title={step.title}
//                 description={step.description}
//               />
//             </List.Item>
//           )}
//         />
//       )}

//       <Divider>Badges Management</Divider>

//       <div style={{ marginBottom: 16 }}>
//         <Button
//           type="dashed"
//           icon={<TrophyOutlined />}
//           onClick={showAddBadgeModal}
//           block
//         >
//           Add Badge
//         </Button>
//       </div>

//       {currentBadges.length > 0 && (
//         <Space wrap>
//           {currentBadges.map((badge) => (
//             <Tag
//               key={badge.id}
//               color="gold"
//               icon={<StarOutlined />}
//               closable
//               onClose={() => deleteBadge(badge.id)}
//               style={{ padding: '5px 10px', fontSize: '14px' }}
//             >
//               {badge.name}
//             </Tag>
//           ))}
//         </Space>
//       )}
//     </>
//   );

//   return (
//     <Card
//       bodyStyle={{ padding: '0px' }}
//       title="Course Management"
//       extra={
//         <Space>
//           <Input
//             placeholder="Search courses..."
//             prefix={<SearchOutlined />}
//             onChange={onSearch}
//             value={searchValue}
//             style={{ width: 250 }}
//             allowClear
//           />
//           <Button
//             type="primary"
//             icon={<PlusCircleOutlined />}
//             onClick={showAddCourseModal}
//           >
//             Add Course
//           </Button>
//         </Space>
//       }
//     >
//       <div className="table-responsive">
//         <Table
//           columns={tableColumns}
//           dataSource={searchValue.trim() ? filteredCourses : courses}
//           rowKey="id"
//           pagination={{
//             pageSize: 10,
//             showSizeChanger: true,
//             showTotal: (total) => `Total ${total} courses`,
//           }}
//         />
//       </div>

//       {/* View Course Modal */}
//       <Modal
//         title="Course Details"
//         open={isViewModalOpen}
//         onCancel={closeCourseDetails}
//         footer={[
//           <Button key="close" type="primary" onClick={closeCourseDetails}>
//             Close
//           </Button>,
//         ]}
//         width={800}
//       >
//         {selectedCourse && (
//           <Tabs defaultActiveKey="1">
//             <TabPane tab="Overview" key="1">
//               <div style={{ textAlign: 'center', marginBottom: 24 }}>
//                 <Image
//                   src={selectedCourse.thumbnail}
//                   alt={selectedCourse.title}
//                   width={200}
//                   style={{ borderRadius: 12 }}
//                 />
//               </div>

//               <div style={{ marginBottom: 16 }}>
//                 <h3>{selectedCourse.title}</h3>
//                 <p style={{ color: '#8c8c8c' }}>{selectedCourse.description}</p>
//               </div>

//               <div style={{ marginBottom: 16 }}>
//                 <strong>Progress:</strong>
//                 <Progress
//                   percent={selectedCourse.progress}
//                   strokeColor={{
//                     '0%': '#ff85c0',
//                     '100%': '#ff4d94',
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: 16 }}>
//                 <strong>Video URL:</strong>
//                 <div>
//                   <a href={selectedCourse.videoUrl} target="_blank" rel="noopener noreferrer">
//                     {selectedCourse.videoUrl}
//                   </a>
//                 </div>
//               </div>
//             </TabPane>

//             <TabPane tab={`Steps (${selectedCourse.steps?.length || 0})`} key="2">
//               <List
//                 dataSource={selectedCourse.steps || []}
//                 renderItem={(step) => (
//                   <List.Item>
//                     <List.Item.Meta
//                       avatar={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
//                       title={step.title}
//                       description={step.description}
//                     />
//                   </List.Item>
//                 )}
//               />
//             </TabPane>

//             <TabPane tab={`Badges (${selectedCourse.badges?.length || 0})`} key="3">
//               <Space wrap size="large">
//                 {selectedCourse.badges?.map((badge) => (
//                   <Tag
//                     key={badge.id}
//                     color="gold"
//                     icon={<StarOutlined />}
//                     style={{ padding: '10px 20px', fontSize: '16px' }}
//                   >
//                     {badge.name}
//                   </Tag>
//                 ))}
//               </Space>
//             </TabPane>
//           </Tabs>
//         )}
//       </Modal>

//       {/* Add Course Modal */}
//       <Modal
//         title="Add New Course"
//         open={isAddModalOpen}
//         onCancel={hideAddCourseModal}
//         footer={null}
//         destroyOnClose
//         width={700}
//       >
//         <Form form={addForm} layout="vertical" onFinish={addCourse} requiredMark>
//           <CourseFormFields form={addForm} />

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
//             <Space>
//               <Button onClick={hideAddCourseModal}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Add Course
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Edit Course Modal */}
//       <Modal
//         title="Edit Course"
//         open={isEditModalOpen}
//         onCancel={hideEditCourseModal}
//         footer={null}
//         destroyOnClose
//         width={700}
//       >
//         <Form form={editForm} layout="vertical" onFinish={editCourse} requiredMark>
//           <CourseFormFields form={editForm} isEdit={true} />

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
//             <Space>
//               <Button onClick={hideEditCourseModal}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Update Course
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Add Step Modal */}
//       <Modal
//         title="Add Step"
//         open={isStepModalOpen}
//         onCancel={() => {
//           setIsStepModalOpen(false);
//           stepForm.resetFields();
//         }}
//         footer={null}
//         destroyOnClose
//       >
//         <Form form={stepForm} layout="vertical" onFinish={addStep} requiredMark>
//           <Form.Item
//             label="Step Title"
//             name="stepTitle"
//             rules={[{ required: true, message: 'Please enter step title!' }]}
//           >
//             <Input placeholder="Enter step title" size="large" />
//           </Form.Item>

//           <Form.Item
//             label="Step Description"
//             name="stepDescription"
//             rules={[{ required: true, message: 'Please enter step description!' }]}
//           >
//             <TextArea placeholder="Enter step description" rows={3} />
//           </Form.Item>

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
//             <Space>
//               <Button onClick={() => {
//                 setIsStepModalOpen(false);
//                 stepForm.resetFields();
//               }}>
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit">
//                 Add Step
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Add Badge Modal */}
//       <Modal
//         title="Add Badge"
//         open={isBadgeModalOpen}
//         onCancel={() => setIsBadgeModalOpen(false)}
//         footer={null}
//         destroyOnClose
//       >
//         <Form layout="vertical" onFinish={addBadge} requiredMark>
//           <Form.Item
//             label="Badge Name"
//             name="badgeName"
//             rules={[{ required: true, message: 'Please enter badge name!' }]}
//           >
//             <Input placeholder="Enter badge name" size="large" prefix={<TrophyOutlined />} />
//           </Form.Item>

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
//             <Space>
//               <Button onClick={() => setIsBadgeModalOpen(false)}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Add Badge
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </Card>
//   );
// };

// export default CourseManagement;


// import React, { useState } from 'react';
// import {
//   Card,
//   Input,
//   Button,
//   Modal,
//   Table,
//   Tooltip,
//   Form,
//   Space,
//   message,
//   Upload,
//   Progress,
//   Tag,
//   Tabs,
//   Divider,
//   List,
//   Image,
// } from 'antd';
// import {
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   PlusCircleOutlined,
//   SearchOutlined,
//   UploadOutlined,
//   PlayCircleOutlined,
//   TrophyOutlined,
//   CheckCircleOutlined,
//   StarOutlined,
// } from '@ant-design/icons';
// import dayjs from 'dayjs';

// const { TextArea } = Input;
// const { TabPane } = Tabs;

// const CourseManagement = () => {
//   // State Management
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [searchValue, setSearchValue] = useState('');
  
//   const [addForm] = Form.useForm();
//   const [editForm] = Form.useForm();
//   const [stepForm] = Form.useForm();

//   // Steps and Badges State
//   const [currentSteps, setCurrentSteps] = useState([]);
//   const [currentBadges, setCurrentBadges] = useState([]);
//   const [isStepModalOpen, setIsStepModalOpen] = useState(false);
//   const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

//   // Search Handler
//   const onSearch = (e) => {
//     const value = e.target.value;
//     setSearchValue(value);

//     if (value.trim()) {
//       const filtered = courses.filter(
//         (course) =>
//           course.title.toLowerCase().includes(value.toLowerCase()) ||
//           course.description.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredCourses(filtered);
//     } else {
//       setFilteredCourses(courses);
//     }
//   };

//   // Add Course Handlers
//   const showAddCourseModal = () => {
//     setCurrentSteps([]);
//     setCurrentBadges([]);
//     setIsAddModalOpen(true);
//   };

//   const hideAddCourseModal = () => {
//     setIsAddModalOpen(false);
//     addForm.resetFields();
//     setCurrentSteps([]);
//     setCurrentBadges([]);
//   };

//   const addCourse = (values) => {
//     const newCourse = {
//       id: Date.now(),
//       title: values.title,
//       description: values.description,
//       thumbnail: values.thumbnail?.file?.response?.urls?.[0] || values.thumbnail?.fileList?.[0]?.response?.url,
//       videoUrl: values.video?.file?.response?.urls?.[0] || values.video?.fileList?.[0]?.response?.url,
//       steps: currentSteps,
//       badges: currentBadges,
//       createdAt: new Date(),
//     };

//     const updatedCourses = [...courses, newCourse];
//     setCourses(updatedCourses);
//     setFilteredCourses(updatedCourses);
//     hideAddCourseModal();
//     message.success('Course added successfully!');
//   };

//   // Edit Course Handlers
//   const showEditCourseModal = (record) => {
//     setSelectedCourse(record);
//     setCurrentSteps(record.steps || []);
//     setCurrentBadges(record.badges || []);
//     setIsEditModalOpen(true);
    
//     setTimeout(() => {
//       editForm.setFieldsValue({
//         title: record.title,
//         description: record.description,
//       });
//     }, 100);
//   };

//   const hideEditCourseModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedCourse(null);
//     editForm.resetFields();
//     setCurrentSteps([]);
//     setCurrentBadges([]);
//   };

//   const editCourse = (values) => {
//     const updated = courses.map((c) =>
//       c.id === selectedCourse.id
//         ? {
//             ...c,
//             title: values.title,
//             description: values.description,
//             thumbnail: values.thumbnail?.file?.response?.urls?.[0] || values.thumbnail?.fileList?.[0]?.response?.url || c.thumbnail,
//             videoUrl: values.video?.file?.response?.urls?.[0] || values.video?.fileList?.[0]?.response?.url || c.videoUrl,
//             steps: currentSteps,
//             badges: currentBadges,
//           }
//         : c
//     );

//     setCourses(updated);
//     setFilteredCourses(updated);
//     hideEditCourseModal();
//     message.success('Course updated successfully!');
//   };

//   // Delete Course Handler
//   const handleDeleteCourse = (id, title) => {
//     Modal.confirm({
//       title: 'Delete Course',
//       content: `Are you sure you want to delete "${title}"?`,
//       okText: 'Delete',
//       okType: 'danger',
//       cancelText: 'Cancel',
//       onOk: () => {
//         const updated = courses.filter((c) => c.id !== id);
//         setCourses(updated);
//         setFilteredCourses(updated);
//         message.success('Course deleted successfully!');
//       },
//     });
//   };

//   // View Course Handler
//   const showCourseDetails = (record) => {
//     setSelectedCourse(record);
//     setIsViewModalOpen(true);
//   };

//   const closeCourseDetails = () => {
//     setIsViewModalOpen(false);
//     setSelectedCourse(null);
//   };

//   // Steps Management
//   const showAddStepModal = () => {
//     setIsStepModalOpen(true);
//   };

//   const addStep = (values) => {
//     const newStep = {
//       id: Date.now(),
//       title: values.stepTitle,
//       description: values.stepDescription,
//       completed: false,
//     };
//     setCurrentSteps([...currentSteps, newStep]);
//     stepForm.resetFields();
//     setIsStepModalOpen(false);
//     message.success('Step added successfully!');
//   };

//   const deleteStep = (stepId) => {
//     setCurrentSteps(currentSteps.filter((s) => s.id !== stepId));
//     message.success('Step deleted successfully!');
//   };

//   // Badges Management
//   const showAddBadgeModal = () => {
//     setIsBadgeModalOpen(true);
//   };

//   const addBadge = (values) => {
//     const newBadge = {
//       id: Date.now(),
//       name: values.badgeName,
//       icon: values.badgeIcon || 'star',
//     };
//     setCurrentBadges([...currentBadges, newBadge]);
//     setIsBadgeModalOpen(false);
//     message.success('Badge added successfully!');
//   };

//   const deleteBadge = (badgeId) => {
//     setCurrentBadges(currentBadges.filter((b) => b.id !== badgeId));
//     message.success('Badge deleted successfully!');
//   };

//   // AWS Upload Props for Images
//   const imageUploadProps = {
//     name: 'file',
//     action: 'YOUR_AWS_IMAGE_UPLOAD_ENDPOINT',
//     onChange(info) {
//       if (info.file.status === 'uploading') {
//         message.loading({ content: 'Uploading image...', key: 'imageUpload' });
//       }
//       if (info.file.status === 'done') {
//         message.success({ content: 'Image uploaded successfully!', key: 'imageUpload' });
//       } else if (info.file.status === 'error') {
//         message.error({ content: 'Image upload failed!', key: 'imageUpload' });
//       }
//     },
//   };

//   // AWS Upload Props for Videos
//   const videoUploadProps = {
//     name: 'file',
//     action: 'YOUR_AWS_VIDEO_UPLOAD_ENDPOINT',
//     accept: 'video/*',
//     onChange(info) {
//       if (info.file.status === 'uploading') {
//         message.loading({ content: 'Uploading video...', key: 'videoUpload' });
//       }
//       if (info.file.status === 'done') {
//         message.success({ content: 'Video uploaded successfully!', key: 'videoUpload' });
//       } else if (info.file.status === 'error') {
//         message.error({ content: 'Video upload failed!', key: 'videoUpload' });
//       }
//     },
//   };

//   // Table Columns
//   const tableColumns = [
//     {
//       title: 'Thumbnail',
//       dataIndex: 'thumbnail',
//       width: 100,
//       render: (thumbnail) => (
//         <Image
//           src={thumbnail}
//           alt="course thumbnail"
//           width={60}
//           height={60}
//           style={{ objectFit: 'cover', borderRadius: 8 }}
//           fallback="/placeholder-thumbnail.jpg"
//         />
//       ),
//     },
//     {
//       title: 'Course Title',
//       dataIndex: 'title',
//       render: (_, record) => (
//         <div>
//           <div style={{ fontWeight: 500, fontSize: '14px' }}>
//             {record.title}
//           </div>
//           <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
//             {record.description?.substring(0, 50)}...
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: 'Steps',
//       dataIndex: 'steps',
//       width: 80,
//       align: 'center',
//       render: (steps) => (
//         <Tag color="blue">{steps?.length || 0}</Tag>
//       ),
//     },
//     {
//       title: 'Badges',
//       dataIndex: 'badges',
//       width: 80,
//       align: 'center',
//       render: (badges) => (
//         <Tag color="gold">{badges?.length || 0}</Tag>
//       ),
//     },
//     {
//       title: 'Date Added',
//       dataIndex: 'createdAt',
//       width: 150,
//       render: (date) => dayjs(date).format('DD MMM YYYY'),
//       sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
//     },
//     {
//       title: 'Actions',
//       dataIndex: 'actions',
//       align: 'right',
//       width: 150,
//       render: (_, record) => (
//         <Space size="small">
//           <Tooltip title="View">
//             <Button
//               type="primary"
//               icon={<EyeOutlined />}
//               onClick={() => showCourseDetails(record)}
//               size="small"
//             />
//           </Tooltip>
//           <Tooltip title="Edit">
//             <Button
//               icon={<EditOutlined />}
//               onClick={() => showEditCourseModal(record)}
//               size="small"
//             />
//           </Tooltip>
//           <Tooltip title="Delete">
//             <Button
//               danger
//               icon={<DeleteOutlined />}
//               onClick={() => handleDeleteCourse(record.id, record.title)}
//               size="small"
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   // Course Form Fields Component
//   const CourseFormFields = ({ form, isEdit = false }) => (
//     <>
//       <Form.Item
//         label="Course Title"
//         name="title"
//         rules={[
//           { required: true, message: 'Please enter course title!' },
//           { min: 3, message: 'Title must be at least 3 characters!' },
//         ]}
//       >
//         <Input placeholder="Enter course title" size="large" />
//       </Form.Item>

//       <Form.Item
//         label="Course Description"
//         name="description"
//         rules={[
//           { required: true, message: 'Please enter course description!' },
//           { min: 10, message: 'Description must be at least 10 characters!' },
//         ]}
//       >
//         <TextArea
//           placeholder="Enter course description"
//           rows={4}
//           size="large"
//         />
//       </Form.Item>

//       <Form.Item 
//         label="Thumbnail Image" 
//         name="thumbnail"
//         rules={[{ required: !isEdit, message: 'Please upload thumbnail image!' }]}
//       >
//         <Upload {...imageUploadProps} listType="picture-card" maxCount={1}>
//           <div>
//             <UploadOutlined />
//             <div style={{ marginTop: 8 }}>Upload Image</div>
//           </div>
//         </Upload>
//       </Form.Item>

//       <Form.Item
//         label="Course Video"
//         name="video"
//         rules={[{ required: !isEdit, message: 'Please upload course video!' }]}
//       >
//         <Upload {...videoUploadProps} maxCount={1}>
//           <Button icon={<UploadOutlined />} size="large">
//             Upload Video to AWS
//           </Button>
//         </Upload>
//       </Form.Item>

//       <Divider>Steps Management</Divider>

//       <div style={{ marginBottom: 16 }}>
//         <Button
//           type="dashed"
//           icon={<PlusCircleOutlined />}
//           onClick={showAddStepModal}
//           block
//         >
//           Add Step
//         </Button>
//       </div>

//       {currentSteps.length > 0 && (
//         <List
//           size="small"
//           bordered
//           dataSource={currentSteps}
//           renderItem={(step) => (
//             <List.Item
//               actions={[
//                 <Button
//                   type="text"
//                   danger
//                   icon={<DeleteOutlined />}
//                   size="small"
//                   onClick={() => deleteStep(step.id)}
//                 />,
//               ]}
//             >
//               <List.Item.Meta
//                 avatar={<CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />}
//                 title={step.title}
//                 description={step.description}
//               />
//             </List.Item>
//           )}
//         />
//       )}

//       <Divider>Badges Management</Divider>

//       <div style={{ marginBottom: 16 }}>
//         <Button
//           type="dashed"
//           icon={<TrophyOutlined />}
//           onClick={showAddBadgeModal}
//           block
//         >
//           Add Badge
//         </Button>
//       </div>

//       {currentBadges.length > 0 && (
//         <Space wrap>
//           {currentBadges.map((badge) => (
//             <Tag
//               key={badge.id}
//               color="gold"
//               icon={<StarOutlined />}
//               closable
//               onClose={() => deleteBadge(badge.id)}
//               style={{ padding: '5px 10px', fontSize: '14px' }}
//             >
//               {badge.name}
//             </Tag>
//           ))}
//         </Space>
//       )}
//     </>
//   );

//   return (
//     <Card
//       bodyStyle={{ padding: '0px' }}
//       title="Course Management"
//       extra={
//         <Space>
//           <Input
//             placeholder="Search courses..."
//             prefix={<SearchOutlined />}
//             onChange={onSearch}
//             value={searchValue}
//             style={{ width: 250 }}
//             allowClear
//           />
//           <Button
//             type="primary"
//             icon={<PlusCircleOutlined />}
//             onClick={showAddCourseModal}
//           >
//             Add Course
//           </Button>
//         </Space>
//       }
//     >
//       <div className="table-responsive">
//         <Table
//           columns={tableColumns}
//           dataSource={searchValue.trim() ? filteredCourses : courses}
//           rowKey="id"
//           pagination={{
//             pageSize: 10,
//             showSizeChanger: true,
//             showTotal: (total) => `Total ${total} courses`,
//           }}
//         />
//       </div>

//       {/* View Course Modal */}
//       <Modal
//         title="Course Details"
//         open={isViewModalOpen}
//         onCancel={closeCourseDetails}
//         footer={[
//           <Button key="close" type="primary" onClick={closeCourseDetails}>
//             Close
//           </Button>,
//         ]}
//         width={800}
//       >
//         {selectedCourse && (
//           <Tabs defaultActiveKey="1">
//             <TabPane tab="Overview" key="1">
//               <div style={{ textAlign: 'center', marginBottom: 24 }}>
//                 <Image
//                   src={selectedCourse.thumbnail}
//                   alt={selectedCourse.title}
//                   width={200}
//                   style={{ borderRadius: 12 }}
//                 />
//               </div>

//               <div style={{ marginBottom: 16 }}>
//                 <h3>{selectedCourse.title}</h3>
//                 <p style={{ color: '#8c8c8c' }}>{selectedCourse.description}</p>
//               </div>

//               <div style={{ marginBottom: 16 }}>
//                 <strong>Video URL:</strong>
//                 <div>
//                   <a href={selectedCourse.videoUrl} target="_blank" rel="noopener noreferrer">
//                     {selectedCourse.videoUrl}
//                   </a>
//                 </div>
//               </div>
//             </TabPane>

//             <TabPane tab={`Steps (${selectedCourse.steps?.length || 0})`} key="2">
//               <List
//                 dataSource={selectedCourse.steps || []}
//                 renderItem={(step) => (
//                   <List.Item>
//                     <List.Item.Meta
//                       avatar={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
//                       title={step.title}
//                       description={step.description}
//                     />
//                   </List.Item>
//                 )}
//               />
//             </TabPane>

//             <TabPane tab={`Badges (${selectedCourse.badges?.length || 0})`} key="3">
//               <Space wrap size="large">
//                 {selectedCourse.badges?.map((badge) => (
//                   <Tag
//                     key={badge.id}
//                     color="gold"
//                     icon={<StarOutlined />}
//                     style={{ padding: '10px 20px', fontSize: '16px' }}
//                   >
//                     {badge.name}
//                   </Tag>
//                 ))}
//               </Space>
//             </TabPane>
//           </Tabs>
//         )}
//       </Modal>

//       {/* Add Course Modal */}
//       <Modal
//         title="Add New Course"
//         open={isAddModalOpen}
//         onCancel={hideAddCourseModal}
//         footer={null}
//         destroyOnClose
//         width={700}
//       >
//         <Form form={addForm} layout="vertical" onFinish={addCourse} requiredMark>
//           <CourseFormFields form={addForm} />

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
//             <Space>
//               <Button onClick={hideAddCourseModal}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Add Course
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Edit Course Modal */}
//       <Modal
//         title="Edit Course"
//         open={isEditModalOpen}
//         onCancel={hideEditCourseModal}
//         footer={null}
//         destroyOnClose
//         width={700}
//       >
//         <Form form={editForm} layout="vertical" onFinish={editCourse} requiredMark>
//           <CourseFormFields form={editForm} isEdit={true} />

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
//             <Space>
//               <Button onClick={hideEditCourseModal}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Update Course
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Add Step Modal */}
//       <Modal
//         title="Add Step"
//         open={isStepModalOpen}
//         onCancel={() => {
//           setIsStepModalOpen(false);
//           stepForm.resetFields();
//         }}
//         footer={null}
//         destroyOnClose
//       >
//         <Form form={stepForm} layout="vertical" onFinish={addStep} requiredMark>
//           <Form.Item
//             label="Step Title"
//             name="stepTitle"
//             rules={[{ required: true, message: 'Please enter step title!' }]}
//           >
//             <Input placeholder="Enter step title" size="large" />
//           </Form.Item>

//           <Form.Item
//             label="Step Description"
//             name="stepDescription"
//             rules={[{ required: true, message: 'Please enter step description!' }]}
//           >
//             <TextArea placeholder="Enter step description" rows={3} />
//           </Form.Item>

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
//             <Space>
//               <Button onClick={() => {
//                 setIsStepModalOpen(false);
//                 stepForm.resetFields();
//               }}>
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit">
//                 Add Step
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Add Badge Modal */}
//       <Modal
//         title="Add Badge"
//         open={isBadgeModalOpen}
//         onCancel={() => setIsBadgeModalOpen(false)}
//         footer={null}
//         destroyOnClose
//       >
//         <Form layout="vertical" onFinish={addBadge} requiredMark>
//           <Form.Item
//             label="Badge Name"
//             name="badgeName"
//             rules={[{ required: true, message: 'Please enter badge name!' }]}
//           >
//             <Input placeholder="Enter badge name" size="large" prefix={<TrophyOutlined />} />
//           </Form.Item>

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
//             <Space>
//               <Button onClick={() => setIsBadgeModalOpen(false)}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Add Badge
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </Card>
//   );
// };

// export default CourseManagement;


// import React, { useState } from 'react';
// import {
//   Card,
//   Input,
//   Button,
//   Modal,
//   Table,
//   Tooltip,
//   Form,
//   Space,
//   message,
//   Upload,
//   Progress,
//   Tag,
//   Tabs,
//   Divider,
//   List,
//   Image,
// } from 'antd';
// import {
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   PlusCircleOutlined,
//   SearchOutlined,
//   UploadOutlined,
//   PlayCircleOutlined,
//   TrophyOutlined,
//   CheckCircleOutlined,
//   StarOutlined,
// } from '@ant-design/icons';
// import dayjs from 'dayjs';

// const { TextArea } = Input;
// const { TabPane } = Tabs;

// const CourseManagement = () => {
//   // State Management
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [searchValue, setSearchValue] = useState('');
  
//   const [addForm] = Form.useForm();
//   const [editForm] = Form.useForm();
//   const [stepForm] = Form.useForm();

//   // Steps and Badges State
//   const [currentSteps, setCurrentSteps] = useState([]);
//   const [currentBadges, setCurrentBadges] = useState([]);
//   const [isStepModalOpen, setIsStepModalOpen] = useState(false);
//   const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  
//   // Upload State
//   const [uploadedImageUrl, setUploadedImageUrl] = useState('');
//   const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');

//   // Search Handler
//   const onSearch = (e) => {
//     const value = e.target.value;
//     setSearchValue(value);

//     if (value.trim()) {
//       const filtered = courses.filter(
//         (course) =>
//           course.title.toLowerCase().includes(value.toLowerCase()) ||
//           course.description.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredCourses(filtered);
//     } else {
//       setFilteredCourses(courses);
//     }
//   };

//   // Add Course Handlers
//   const showAddCourseModal = () => {
//     setCurrentSteps([]);
//     setCurrentBadges([]);
//     setUploadedImageUrl('');
//     setUploadedVideoUrl('');
//     setIsAddModalOpen(true);
//   };

//   const hideAddCourseModal = () => {
//     setIsAddModalOpen(false);
//     addForm.resetFields();
//     setCurrentSteps([]);
//     setCurrentBadges([]);
//     setUploadedImageUrl('');
//     setUploadedVideoUrl('');
//   };

//   const addCourse = (values) => {
//     if (!uploadedImageUrl) {
//       message.error('Please upload thumbnail image!');
//       return;
//     }
//     if (!uploadedVideoUrl) {
//       message.error('Please upload course video!');
//       return;
//     }

//     const newCourse = {
//       id: Date.now(),
//       title: values.title,
//       description: values.description,
//       thumbnail: uploadedImageUrl,
//       videoUrl: uploadedVideoUrl,
//       steps: currentSteps,
//       badges: currentBadges,
//       createdAt: new Date(),
//     };

//     const updatedCourses = [...courses, newCourse];
//     setCourses(updatedCourses);
//     setFilteredCourses(updatedCourses);
//     hideAddCourseModal();
//     message.success('Course added successfully!');
//   };

//   // Edit Course Handlers
//   const showEditCourseModal = (record) => {
//     setSelectedCourse(record);
//     setCurrentSteps(record.steps || []);
//     setCurrentBadges(record.badges || []);
//     setUploadedImageUrl(record.thumbnail || '');
//     setUploadedVideoUrl(record.videoUrl || '');
//     setIsEditModalOpen(true);
    
//     setTimeout(() => {
//       editForm.setFieldsValue({
//         title: record.title,
//         description: record.description,
//       });
//     }, 100);
//   };

//   const hideEditCourseModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedCourse(null);
//     editForm.resetFields();
//     setCurrentSteps([]);
//     setCurrentBadges([]);
//     setUploadedImageUrl('');
//     setUploadedVideoUrl('');
//   };

//   const editCourse = (values) => {
//     const updated = courses.map((c) =>
//       c.id === selectedCourse.id
//         ? {
//             ...c,
//             title: values.title,
//             description: values.description,
//             thumbnail: values.thumbnail?.file?.response?.urls?.[0] || values.thumbnail?.fileList?.[0]?.response?.url || c.thumbnail,
//             videoUrl: values.video?.file?.response?.urls?.[0] || values.video?.fileList?.[0]?.response?.url || c.videoUrl,
//             steps: currentSteps,
//             badges: currentBadges,
//           }
//         : c
//     );

//     setCourses(updated);
//     setFilteredCourses(updated);
//     hideEditCourseModal();
//     message.success('Course updated successfully!');
//   };

//   // Delete Course Handler
//   const handleDeleteCourse = (id, title) => {
//     Modal.confirm({
//       title: 'Delete Course',
//       content: `Are you sure you want to delete "${title}"?`,
//       okText: 'Delete',
//       okType: 'danger',
//       cancelText: 'Cancel',
//       onOk: () => {
//         const updated = courses.filter((c) => c.id !== id);
//         setCourses(updated);
//         setFilteredCourses(updated);
//         message.success('Course deleted successfully!');
//       },
//     });
//   };

//   // View Course Handler
//   const showCourseDetails = (record) => {
//     setSelectedCourse(record);
//     setIsViewModalOpen(true);
//   };

//   const closeCourseDetails = () => {
//     setIsViewModalOpen(false);
//     setSelectedCourse(null);
//   };

//   // Steps Management
//   const showAddStepModal = () => {
//     setIsStepModalOpen(true);
//   };

//   const addStep = (values) => {
//     const newStep = {
//       id: Date.now(),
//       title: values.stepTitle,
//       description: values.stepDescription,
//       completed: false,
//     };
//     setCurrentSteps([...currentSteps, newStep]);
//     stepForm.resetFields();
//     setIsStepModalOpen(false);
//     message.success('Step added successfully!');
//   };

//   const deleteStep = (stepId) => {
//     setCurrentSteps(currentSteps.filter((s) => s.id !== stepId));
//     message.success('Step deleted successfully!');
//   };

//   // Badges Management
//   const showAddBadgeModal = () => {
//     setIsBadgeModalOpen(true);
//   };

//   const addBadge = (values) => {
//     const newBadge = {
//       id: Date.now(),
//       name: values.badgeName,
//       icon: values.badgeIcon || 'star',
//     };
//     setCurrentBadges([...currentBadges, newBadge]);
//     setIsBadgeModalOpen(false);
//     message.success('Badge added successfully!');
//   };

//   const deleteBadge = (badgeId) => {
//     setCurrentBadges(currentBadges.filter((b) => b.id !== badgeId));
//     message.success('Badge deleted successfully!');
//   };

//   // AWS Upload Props for Images
//   const imageUploadProps = {
//     name: 'file',
//     action: 'YOUR_AWS_IMAGE_UPLOAD_ENDPOINT',
//     onChange(info) {
//       if (info.file.status === 'uploading') {
//         message.loading({ content: 'Uploading image...', key: 'imageUpload' });
//       }
//       if (info.file.status === 'done') {
//         message.success({ content: 'Image uploaded successfully!', key: 'imageUpload' });
//       } else if (info.file.status === 'error') {
//         message.error({ content: 'Image upload failed!', key: 'imageUpload' });
//       }
//     },
//   };

//   // AWS Upload Props for Videos
//   const videoUploadProps = {
//     name: 'file',
//     action: 'YOUR_AWS_VIDEO_UPLOAD_ENDPOINT',
//     accept: 'video/*',
//     onChange(info) {
//       if (info.file.status === 'uploading') {
//         message.loading({ content: 'Uploading video...', key: 'videoUpload' });
//       }
//       if (info.file.status === 'done') {
//         message.success({ content: 'Video uploaded successfully!', key: 'videoUpload' });
//       } else if (info.file.status === 'error') {
//         message.error({ content: 'Video upload failed!', key: 'videoUpload' });
//       }
//     },
//   };

//   // Table Columns
//   const tableColumns = [
//     {
//       title: 'Thumbnail',
//       dataIndex: 'thumbnail',
//       width: 100,
//       render: (thumbnail) => (
//         <Image
//           src={thumbnail}
//           alt="course thumbnail"
//           width={60}
//           height={60}
//           style={{ objectFit: 'cover', borderRadius: 8 }}
//           fallback="/placeholder-thumbnail.jpg"
//         />
//       ),
//     },
//     {
//       title: 'Course Title',
//       dataIndex: 'title',
//       render: (_, record) => (
//         <div>
//           <div style={{ fontWeight: 500, fontSize: '14px' }}>
//             {record.title}
//           </div>
//           <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
//             {record.description?.substring(0, 50)}...
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: 'Steps',
//       dataIndex: 'steps',
//       width: 80,
//       align: 'center',
//       render: (steps) => (
//         <Tag color="blue">{steps?.length || 0}</Tag>
//       ),
//     },
//     {
//       title: 'Badges',
//       dataIndex: 'badges',
//       width: 80,
//       align: 'center',
//       render: (badges) => (
//         <Tag color="gold">{badges?.length || 0}</Tag>
//       ),
//     },
//     {
//       title: 'Date Added',
//       dataIndex: 'createdAt',
//       width: 150,
//       render: (date) => dayjs(date).format('DD MMM YYYY'),
//       sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
//     },
//     {
//       title: 'Actions',
//       dataIndex: 'actions',
//       align: 'right',
//       width: 150,
//       render: (_, record) => (
//         <Space size="small">
//           <Tooltip title="View">
//             <Button
//               type="primary"
//               icon={<EyeOutlined />}
//               onClick={() => showCourseDetails(record)}
//               size="small"
//             />
//           </Tooltip>
//           <Tooltip title="Edit">
//             <Button
//               icon={<EditOutlined />}
//               onClick={() => showEditCourseModal(record)}
//               size="small"
//             />
//           </Tooltip>
//           <Tooltip title="Delete">
//             <Button
//               danger
//               icon={<DeleteOutlined />}
//               onClick={() => handleDeleteCourse(record.id, record.title)}
//               size="small"
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   // Course Form Fields Component
//   const CourseFormFields = ({ form, isEdit = false }) => (
//     <>
//       <Form.Item
//         label="Course Title"
//         name="title"
//         rules={[
//           { required: true, message: 'Please enter course title!' },
//           { min: 3, message: 'Title must be at least 3 characters!' },
//         ]}
//       >
//         <Input placeholder="Enter course title" size="large" />
//       </Form.Item>

//       <Form.Item
//         label="Course Description"
//         name="description"
//         rules={[
//           { required: true, message: 'Please enter course description!' },
//           { min: 10, message: 'Description must be at least 10 characters!' },
//         ]}
//       >
//         <TextArea
//           placeholder="Enter course description"
//           rows={4}
//           size="large"
//         />
//       </Form.Item>

//       <Form.Item 
//         label="Thumbnail Image" 
//         name="thumbnail"
//         rules={[{ required: !isEdit, message: 'Please upload thumbnail image!' }]}
//       >
//         <Upload {...imageUploadProps} listType="picture-card" maxCount={1}>
//           <div>
//             <UploadOutlined />
//             <div style={{ marginTop: 8 }}>Upload Image</div>
//           </div>
//         </Upload>
//       </Form.Item>

//       <Form.Item
//         label="Course Video"
//         name="video"
//         rules={[{ required: !isEdit, message: 'Please upload course video!' }]}
//       >
//         <Upload {...videoUploadProps} maxCount={1}>
//           <Button icon={<UploadOutlined />} size="large">
//             Upload Video to AWS
//           </Button>
//         </Upload>
//       </Form.Item>

//       <Divider>Steps Management</Divider>

//       <div style={{ marginBottom: 16 }}>
//         <Button
//           type="dashed"
//           icon={<PlusCircleOutlined />}
//           onClick={showAddStepModal}
//           block
//         >
//           Add Step
//         </Button>
//       </div>

//       {currentSteps.length > 0 && (
//         <List
//           size="small"
//           bordered
//           dataSource={currentSteps}
//           renderItem={(step) => (
//             <List.Item
//               actions={[
//                 <Button
//                   type="text"
//                   danger
//                   icon={<DeleteOutlined />}
//                   size="small"
//                   onClick={() => deleteStep(step.id)}
//                 />,
//               ]}
//             >
//               <List.Item.Meta
//                 avatar={<CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />}
//                 title={step.title}
//                 description={step.description}
//               />
//             </List.Item>
//           )}
//         />
//       )}

//       <Divider>Badges Management</Divider>

//       <div style={{ marginBottom: 16 }}>
//         <Button
//           type="dashed"
//           icon={<TrophyOutlined />}
//           onClick={showAddBadgeModal}
//           block
//         >
//           Add Badge
//         </Button>
//       </div>

//       {currentBadges.length > 0 && (
//         <Space wrap>
//           {currentBadges.map((badge) => (
//             <Tag
//               key={badge.id}
//               color="gold"
//               icon={<StarOutlined />}
//               closable
//               onClose={() => deleteBadge(badge.id)}
//               style={{ padding: '5px 10px', fontSize: '14px' }}
//             >
//               {badge.name}
//             </Tag>
//           ))}
//         </Space>
//       )}
//     </>
//   );

//   return (
//     <Card
//       bodyStyle={{ padding: '0px' }}
//       title="Course Management"
//       extra={
//         <Space>
//           <Input
//             placeholder="Search courses..."
//             prefix={<SearchOutlined />}
//             onChange={onSearch}
//             value={searchValue}
//             style={{ width: 250 }}
//             allowClear
//           />
//           <Button
//             type="primary"
//             icon={<PlusCircleOutlined />}
//             onClick={showAddCourseModal}
//           >
//             Add Course
//           </Button>
//         </Space>
//       }
//     >
//       <div className="table-responsive">
//         <Table
//           columns={tableColumns}
//           dataSource={searchValue.trim() ? filteredCourses : courses}
//           rowKey="id"
//           pagination={{
//             pageSize: 10,
//             showSizeChanger: true,
//             showTotal: (total) => `Total ${total} courses`,
//           }}
//         />
//       </div>

//       {/* View Course Modal */}
//       <Modal
//         title="Course Details"
//         open={isViewModalOpen}
//         onCancel={closeCourseDetails}
//         footer={[
//           <Button key="close" type="primary" onClick={closeCourseDetails}>
//             Close
//           </Button>,
//         ]}
//         width={800}
//       >
//         {selectedCourse && (
//           <Tabs defaultActiveKey="1">
//             <TabPane tab="Overview" key="1">
//               <div style={{ textAlign: 'center', marginBottom: 24 }}>
//                 <Image
//                   src={selectedCourse.thumbnail}
//                   alt={selectedCourse.title}
//                   width={200}
//                   style={{ borderRadius: 12 }}
//                 />
//               </div>

//               <div style={{ marginBottom: 16 }}>
//                 <h3>{selectedCourse.title}</h3>
//                 <p style={{ color: '#8c8c8c' }}>{selectedCourse.description}</p>
//               </div>

//               <div style={{ marginBottom: 16 }}>
//                 <strong>Video URL:</strong>
//                 <div>
//                   <a href={selectedCourse.videoUrl} target="_blank" rel="noopener noreferrer">
//                     {selectedCourse.videoUrl}
//                   </a>
//                 </div>
//               </div>
//             </TabPane>

//             <TabPane tab={`Steps (${selectedCourse.steps?.length || 0})`} key="2">
//               <List
//                 dataSource={selectedCourse.steps || []}
//                 renderItem={(step) => (
//                   <List.Item>
//                     <List.Item.Meta
//                       avatar={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
//                       title={step.title}
//                       description={step.description}
//                     />
//                   </List.Item>
//                 )}
//               />
//             </TabPane>

//             <TabPane tab={`Badges (${selectedCourse.badges?.length || 0})`} key="3">
//               <Space wrap size="large">
//                 {selectedCourse.badges?.map((badge) => (
//                   <Tag
//                     key={badge.id}
//                     color="gold"
//                     icon={<StarOutlined />}
//                     style={{ padding: '10px 20px', fontSize: '16px' }}
//                   >
//                     {badge.name}
//                   </Tag>
//                 ))}
//               </Space>
//             </TabPane>
//           </Tabs>
//         )}
//       </Modal>

//       {/* Add Course Modal */}
//       <Modal
//         title="Add New Course"
//         open={isAddModalOpen}
//         onCancel={hideAddCourseModal}
//         footer={null}
//         destroyOnClose
//         width={700}
//       >
//         <Form form={addForm} layout="vertical" onFinish={addCourse} requiredMark>
//           <CourseFormFields form={addForm} />

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
//             <Space>
//               <Button onClick={hideAddCourseModal}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Add Course
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Edit Course Modal */}
//       <Modal
//         title="Edit Course"
//         open={isEditModalOpen}
//         onCancel={hideEditCourseModal}
//         footer={null}
//         destroyOnClose
//         width={700}
//       >
//         <Form form={editForm} layout="vertical" onFinish={editCourse} requiredMark>
//           <CourseFormFields form={editForm} isEdit={true} />

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
//             <Space>
//               <Button onClick={hideEditCourseModal}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Update Course
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Add Step Modal */}
//       <Modal
//         title="Add Step"
//         open={isStepModalOpen}
//         onCancel={() => {
//           setIsStepModalOpen(false);
//           stepForm.resetFields();
//         }}
//         footer={null}
//         destroyOnClose
//       >
//         <Form form={stepForm} layout="vertical" onFinish={addStep} requiredMark>
//           <Form.Item
//             label="Step Title"
//             name="stepTitle"
//             rules={[{ required: true, message: 'Please enter step title!' }]}
//           >
//             <Input placeholder="Enter step title" size="large" />
//           </Form.Item>

//           <Form.Item
//             label="Step Description"
//             name="stepDescription"
//             rules={[{ required: true, message: 'Please enter step description!' }]}
//           >
//             <TextArea placeholder="Enter step description" rows={3} />
//           </Form.Item>

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
//             <Space>
//               <Button onClick={() => {
//                 setIsStepModalOpen(false);
//                 stepForm.resetFields();
//               }}>
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit">
//                 Add Step
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Add Badge Modal */}
//       <Modal
//         title="Add Badge"
//         open={isBadgeModalOpen}
//         onCancel={() => setIsBadgeModalOpen(false)}
//         footer={null}
//         destroyOnClose
//       >
//         <Form layout="vertical" onFinish={addBadge} requiredMark>
//           <Form.Item
//             label="Badge Name"
//             name="badgeName"
//             rules={[{ required: true, message: 'Please enter badge name!' }]}
//           >
//             <Input placeholder="Enter badge name" size="large" prefix={<TrophyOutlined />} />
//           </Form.Item>

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
//             <Space>
//               <Button onClick={() => setIsBadgeModalOpen(false)}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Add Badge
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </Card>
//   );
// };

// export default CourseManagement;

import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Modal,
  Table,
  Tooltip,
  Form,
  Space,
  message,
  Upload,
  Progress,
  Tag,
  Tabs,
  Divider,
  List,
  Image,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UploadOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { TabPane } = Tabs;

const CourseManagement = () => {
  // Static Demo Data
  const demoData = [
    {
      id: 1,
      title: 'Scheduling Headquarter',
      description: 'This lesson will teach you how to organize your tasks and plan your family\'s schedule in a few simple steps.',
      thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
      videoUrl: 'https://www.example.com/videos/scheduling.mp4',
      steps: [
        {
          id: 101,
          title: 'Create Your Daily To-Do List',
          description: 'Use the "Create New Task" button to add items to your day.',
          completed: false,
        },
        {
          id: 102,
          title: 'Sync External Calendars',
          description: 'Link your Google or Outlook calendar to keep everything in sync.',
          completed: false,
        },
        {
          id: 103,
          title: 'Set Reminders',
          description: 'Set up customizable notifications. Use customizable notifications.',
          completed: false,
        },
      ],
      badges: [
        { id: 201, name: 'Organizer Star', icon: 'star' },
      ],
      createdAt: new Date('2025-01-15'),
    },
    {
      id: 2,
      title: 'Kitchen Headquarter',
      description: 'Master meal planning, grocery shopping, and kitchen organization with this comprehensive course.',
      thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
      videoUrl: 'https://www.example.com/videos/kitchen.mp4',
      steps: [
        {
          id: 103,
          title: 'Plan Weekly Meals',
          description: 'Create a balanced meal plan for the entire week.',
          completed: false,
        },
        {
          id: 104,
          title: 'Generate Shopping List',
          description: 'Automatically generate grocery lists from your meal plans.',
          completed: false,
        },
      ],
      badges: [
        { id: 202, name: 'Master Chef', icon: 'star' },
        { id: 203, name: 'Meal Planner', icon: 'star' },
      ],
      createdAt: new Date('2025-02-10'),
    },
    {
      id: 3,
      title: 'Wealth Headquarter',
      description: 'Learn to manage your family finances, track expenses, and build wealth through smart budgeting.',
      thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400',
      videoUrl: 'https://www.example.com/videos/wealth.mp4',
      steps: [
        {
          id: 105,
          title: 'Set Budget Goals',
          description: 'Define monthly budgets for different categories.',
          completed: false,
        },
        {
          id: 106,
          title: 'Track Expenses',
          description: 'Log daily expenses and monitor spending patterns.',
          completed: false,
        },
        {
          id: 107,
          title: 'Review Financial Reports',
          description: 'Analyze monthly reports to improve financial health.',
          completed: false,
        },
      ],
      badges: [
        { id: 204, name: 'Money Master', icon: 'star' },
        { id: 205, name: 'Budget Pro', icon: 'star' },
        { id: 206, name: 'Savings Star', icon: 'star' },
      ],
      createdAt: new Date('2025-03-05'),
    },
  ];

  // State Management
  const [courses, setCourses] = useState(demoData);
  const [filteredCourses, setFilteredCourses] = useState(demoData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [stepForm] = Form.useForm();

  // Steps and Badges State
  const [currentSteps, setCurrentSteps] = useState([]);
  const [currentBadges, setCurrentBadges] = useState([]);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  
  // Upload State
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');

  // Search Handler
  const onSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim()) {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(value.toLowerCase()) ||
          course.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  };

  // Add Course Handlers
  const showAddCourseModal = () => {
    setCurrentSteps([]);
    setCurrentBadges([]);
    setUploadedImageUrl('');
    setUploadedVideoUrl('');
    setIsAddModalOpen(true);
  };

  const hideAddCourseModal = () => {
    setIsAddModalOpen(false);
    addForm.resetFields();
    setCurrentSteps([]);
    setCurrentBadges([]);
    setUploadedImageUrl('');
    setUploadedVideoUrl('');
  };

  const addCourse = (values) => {
    if (!uploadedImageUrl) {
      message.error('Please upload thumbnail image!');
      return;
    }
    if (!uploadedVideoUrl) {
      message.error('Please upload course video!');
      return;
    }

    const newCourse = {
      id: Date.now(),
      title: values.title,
      description: values.description,
      thumbnail: uploadedImageUrl,
      videoUrl: uploadedVideoUrl,
      steps: currentSteps,
      badges: currentBadges,
      createdAt: new Date(),
    };

    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    setFilteredCourses(updatedCourses);
    hideAddCourseModal();
    message.success('Course added successfully!');
  };

  // Edit Course Handlers
  const showEditCourseModal = (record) => {
    setSelectedCourse(record);
    setCurrentSteps(record.steps || []);
    setCurrentBadges(record.badges || []);
    setUploadedImageUrl(record.thumbnail || '');
    setUploadedVideoUrl(record.videoUrl || '');
    setIsEditModalOpen(true);
    
    setTimeout(() => {
      editForm.setFieldsValue({
        title: record.title,
        description: record.description,
      });
    }, 100);
  };

  const hideEditCourseModal = () => {
    setIsEditModalOpen(false);
    setSelectedCourse(null);
    editForm.resetFields();
    setCurrentSteps([]);
    setCurrentBadges([]);
    setUploadedImageUrl('');
    setUploadedVideoUrl('');
  };

  const editCourse = (values) => {
    const updated = courses.map((c) =>
      c.id === selectedCourse.id
        ? {
            ...c,
            title: values.title,
            description: values.description,
            thumbnail: uploadedImageUrl || c.thumbnail,
            videoUrl: uploadedVideoUrl || c.videoUrl,
            steps: currentSteps,
            badges: currentBadges,
          }
        : c
    );

    setCourses(updated);
    setFilteredCourses(updated);
    hideEditCourseModal();
    message.success('Course updated successfully!');
  };

  // Delete Course Handler
  const handleDeleteCourse = (id, title) => {
    Modal.confirm({
      title: 'Delete Course',
      content: `Are you sure you want to delete "${title}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        const updated = courses.filter((c) => c.id !== id);
        setCourses(updated);
        setFilteredCourses(updated);
        message.success('Course deleted successfully!');
      },
    });
  };

  // View Course Handler
  const showCourseDetails = (record) => {
    setSelectedCourse(record);
    setIsViewModalOpen(true);
  };

  const closeCourseDetails = () => {
    setIsViewModalOpen(false);
    setSelectedCourse(null);
  };

  // Steps Management
  const showAddStepModal = () => {
    setIsStepModalOpen(true);
  };

  const addStep = (values) => {
    const newStep = {
      id: Date.now(),
      title: values.stepTitle,
      description: values.stepDescription,
      completed: false,
    };
    setCurrentSteps([...currentSteps, newStep]);
    stepForm.resetFields();
    setIsStepModalOpen(false);
    message.success('Step added successfully!');
  };

  const deleteStep = (stepId) => {
    setCurrentSteps(currentSteps.filter((s) => s.id !== stepId));
    message.success('Step deleted successfully!');
  };

  // Badges Management
  const showAddBadgeModal = () => {
    setIsBadgeModalOpen(true);
  };

  const addBadge = (values) => {
    const newBadge = {
      id: Date.now(),
      name: values.badgeName,
      icon: values.badgeIcon || 'star',
    };
    setCurrentBadges([...currentBadges, newBadge]);
    setIsBadgeModalOpen(false);
    message.success('Badge added successfully!');
  };

  const deleteBadge = (badgeId) => {
    setCurrentBadges(currentBadges.filter((b) => b.id !== badgeId));
    message.success('Badge deleted successfully!');
  };

  // Handle Image Upload
  const handleImageUpload = async (file) => {
    // Yahan aap apna upload logic likho
    // Example ke liye temporary URL use kar rahe hain
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Replace this with your actual AWS upload logic
      // const response = await fetch('YOUR_AWS_UPLOAD_ENDPOINT', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // setUploadedImageUrl(data.url);
      
      // Temporary: creating object URL for preview
      const tempUrl = URL.createObjectURL(file);
      setUploadedImageUrl(tempUrl);
      message.success('Image uploaded successfully!');
      return false; // Prevent default upload behavior
    } catch (error) {
      message.error('Image upload failed!');
      return false;
    }
  };

  // Handle Video Upload
  const handleVideoUpload = async (file) => {
    // Yahan aap apna upload logic likho
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Replace this with your actual AWS upload logic
      // const response = await fetch('YOUR_AWS_VIDEO_UPLOAD_ENDPOINT', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // setUploadedVideoUrl(data.url);
      
      // Temporary: creating object URL
      const tempUrl = URL.createObjectURL(file);
      setUploadedVideoUrl(tempUrl);
      message.success('Video uploaded successfully!');
      return false; // Prevent default upload behavior
    } catch (error) {
      message.error('Video upload failed!');
      return false;
    }
  };

  // AWS Upload Props for Images
  const imageUploadProps = {
    beforeUpload: handleImageUpload,
    showUploadList: false,
    accept: 'image/*',
  };

  // AWS Upload Props for Videos
  const videoUploadProps = {
    beforeUpload: handleVideoUpload,
    showUploadList: false,
    accept: 'video/*',
  };

  // Table Columns
  const tableColumns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      width: 100,
      render: (thumbnail) => (
        <Image
          src={thumbnail}
          alt="course thumbnail"
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 8 }}
          fallback="/placeholder-thumbnail.jpg"
        />
      ),
    },
    {
      title: 'Course Title',
      dataIndex: 'title',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: '14px' }}>
            {record.title}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.description?.substring(0, 50)}...
          </div>
        </div>
      ),
    },
    {
      title: 'Steps',
      dataIndex: 'steps',
      width: 80,
      align: 'center',
      render: (steps) => (
        <Tag color="blue">{steps?.length || 0}</Tag>
      ),
    },
    {
      title: 'Badges',
      dataIndex: 'badges',
      width: 80,
      align: 'center',
      render: (badges) => (
        <Tag color="gold">{badges?.length || 0}</Tag>
      ),
    },
    {
      title: 'Date Added',
      dataIndex: 'createdAt',
      width: 150,
      render: (date) => dayjs(date).format('DD MMM YYYY'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      align: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => showCourseDetails(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditCourseModal(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteCourse(record.id, record.title)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Course Form Fields Component
  const CourseFormFields = ({ form, isEdit = false }) => (
    <>
      <Form.Item
        label="Course Title"
        name="title"
        rules={[
          { required: true, message: 'Please enter course title!' },
          { min: 3, message: 'Title must be at least 3 characters!' },
        ]}
      >
        <Input placeholder="Enter course title" size="large" />
      </Form.Item>

      <Form.Item
        label="Course Description"
        name="description"
        rules={[
          { required: true, message: 'Please enter course description!' },
          { min: 10, message: 'Description must be at least 10 characters!' },
        ]}
      >
        <TextArea
          placeholder="Enter course description"
          rows={4}
          size="large"
        />
      </Form.Item>

      <Form.Item 
        label="Thumbnail Image" 
        name="thumbnail"
      >
        <Upload {...imageUploadProps} listType="picture-card" maxCount={1}>
          {uploadedImageUrl ? (
            <img src={uploadedImageUrl} alt="thumbnail" style={{ width: '100%' }} />
          ) : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload Image</div>
            </div>
          )}
        </Upload>
        {uploadedImageUrl && (
          <div style={{ marginTop: 8, color: '#52c41a' }}>
            ✓ Image uploaded successfully
          </div>
        )}
      </Form.Item>

      <Form.Item
        label="Course Video"
        name="video"
      >
        <Upload {...videoUploadProps} maxCount={1}>
          <Button icon={<UploadOutlined />} size="large">
            {uploadedVideoUrl ? 'Change Video' : 'Upload Video'}
          </Button>
        </Upload>
        {uploadedVideoUrl && (
          <div style={{ marginTop: 8, color: '#52c41a' }}>
            ✓ Video uploaded successfully
          </div>
        )}
      </Form.Item>

      <Divider>Steps Management</Divider>

      <div style={{ marginBottom: 16 }}>
        <Button
          type="dashed"
          icon={<PlusCircleOutlined />}
          onClick={showAddStepModal}
          block
        >
          Add Step
        </Button>
      </div>

      {currentSteps.length > 0 && (
        <List
          size="small"
          bordered
          dataSource={currentSteps}
          renderItem={(step) => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => deleteStep(step.id)}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />}
                title={step.title}
                description={step.description}
              />
            </List.Item>
          )}
        />
      )}

      <Divider>Badges Management</Divider>

      <div style={{ marginBottom: 16 }}>
        <Button
          type="dashed"
          icon={<TrophyOutlined />}
          onClick={showAddBadgeModal}
          block
        >
          Add Badge
        </Button>
      </div>

      {currentBadges.length > 0 && (
        <Space wrap>
          {currentBadges.map((badge) => (
            <Tag
              key={badge.id}
              color="gold"
              icon={<StarOutlined />}
              closable
              onClose={() => deleteBadge(badge.id)}
              style={{ padding: '5px 10px', fontSize: '14px' }}
            >
              {badge.name}
            </Tag>
          ))}
        </Space>
      )}
    </>
  );

  return (
    <Card
      bodyStyle={{ padding: '0px' }}
      title="Course Management"
      extra={
        <Space style={{marginBottom: "20px", display: "flex", flexWrap:"wrap",}}>

          <Input
            placeholder="Search courses..."
            prefix={<SearchOutlined />}
            onChange={onSearch}
            value={searchValue}
            style={{ width: 250 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={showAddCourseModal}
          >
            Add Course
          </Button>
        </Space>
      }
    >
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={searchValue.trim() ? filteredCourses : courses}
          rowKey="id"
        //   pagination={{
        //     pageSize: 10,
        //     showSizeChanger: true,
        //     showTotal: (total) => `Total ${total} courses`,
        //   }}
        />
      </div>

      {/* View Course Modal */}
      <Modal
        title="Course Details"
        open={isViewModalOpen}
        onCancel={closeCourseDetails}
        footer={[
          <Button key="close" type="primary" onClick={closeCourseDetails}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedCourse && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Overview" key="1">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Image
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title}
                  width={200}
                  style={{ borderRadius: 12 }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <h3>{selectedCourse.title}</h3>
                <p style={{ color: '#8c8c8c' }}>{selectedCourse.description}</p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <strong>Video URL:</strong>
                <div>
                  <a href={selectedCourse.videoUrl} target="_blank" rel="noopener noreferrer">
                    {selectedCourse.videoUrl}
                  </a>
                </div>
              </div>
            </TabPane>

            <TabPane tab={`Steps (${selectedCourse.steps?.length || 0})`} key="2">
              <List
                dataSource={selectedCourse.steps || []}
                renderItem={(step) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
                      title={step.title}
                      description={step.description}
                    />
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab={`Badges (${selectedCourse.badges?.length || 0})`} key="3">
              <Space wrap size="large">
                {selectedCourse.badges?.map((badge) => (
                  <Tag
                    key={badge.id}
                    color="gold"
                    icon={<StarOutlined />}
                    style={{ padding: '10px 20px', fontSize: '16px' }}
                  >
                    {badge.name}
                  </Tag>
                ))}
              </Space>
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* Add Course Modal */}
      <Modal
        title="Add New Course"
        open={isAddModalOpen}
        onCancel={hideAddCourseModal}
        footer={null}
        destroyOnClose
        width={700}
      >
        <Form form={addForm} layout="vertical" onFinish={addCourse} requiredMark>
          <CourseFormFields form={addForm} />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={hideAddCourseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Add Course
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        title="Edit Course"
        open={isEditModalOpen}
        onCancel={hideEditCourseModal}
        footer={null}
        destroyOnClose
        width={700}
      >
        <Form form={editForm} layout="vertical" onFinish={editCourse} requiredMark>
          <CourseFormFields form={editForm} isEdit={true} />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={hideEditCourseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Update Course
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Step Modal */}
      <Modal
        title="Add Step"
        open={isStepModalOpen}
        onCancel={() => {
          setIsStepModalOpen(false);
          stepForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={stepForm} layout="vertical" onFinish={addStep} requiredMark>
          <Form.Item
            label="Step Title"
            name="stepTitle"
            rules={[{ required: true, message: 'Please enter step title!' }]}
          >
            <Input placeholder="Enter step title" size="large" />
          </Form.Item>

          <Form.Item
            label="Step Description"
            name="stepDescription"
            rules={[{ required: true, message: 'Please enter step description!' }]}
          >
            <TextArea placeholder="Enter step description" rows={3} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsStepModalOpen(false);
                stepForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Add Step
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Badge Modal */}
      <Modal
        title="Add Badge"
        open={isBadgeModalOpen}
        onCancel={() => setIsBadgeModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={addBadge} requiredMark>
          <Form.Item
            label="Badge Name"
            name="badgeName"
            rules={[{ required: true, message: 'Please enter badge name!' }]}
          >
            <Input placeholder="Enter badge name" size="large" prefix={<TrophyOutlined />} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsBadgeModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Add Badge
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CourseManagement;