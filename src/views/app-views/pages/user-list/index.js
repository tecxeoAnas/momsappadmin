import React, { useState, useRef, useEffect } from 'react'
import { Card, Table, Tag, Tooltip, message, Button, Modal, Form, Input, Select, Row, Col, Descriptions } from 'antd';
import { EyeOutlined, DeleteOutlined, UserAddOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, createUser, updateUser, deleteUser as deleteUserThunk } from 'services/userService';
import { reactivateUser as reactivateUserThunk } from 'services/userService';
import { TIMEZONES } from 'constants/TimezoneConstant';

const { Option } = Select;
const { Search } = Input;

const UserList = () => {
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [userProfileVisible, setUserProfileVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [addUserModalVisible, setAddUserModalVisible] = useState(false);
	const [editUserModalVisible, setEditUserModalVisible] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [searchText, setSearchText] = useState('');

	const addUserFormRef = useRef();
	const editUserFormRef = useRef();

	const dispatch = useDispatch();
	const { users, loading, error } = useSelector((state) => state.user);

	useEffect(() => {
		dispatch(fetchAllUsers())
	}, [dispatch])

	useEffect(() => {
		// Show all users (both active and deactivated)
		setFilteredUsers(users);
	}, [users]);

	// Search functionality - Show all users
	const handleSearch = (value) => {
		setSearchText(value);
		
		if (!value) {
			setFilteredUsers(users);
			return;
		}

		const filtered = users.filter(user => {
			const fullName = `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase();
			return (
				fullName.includes(value.toLowerCase()) ||
				(user.email && user.email.toLowerCase().includes(value.toLowerCase())) ||
				(user.role && user.role.toLowerCase().includes(value.toLowerCase())) ||
				(user.phone && user.phone.includes(value))
			);
		});
		
		setFilteredUsers(filtered);
	};

	// Add User Modal
	const showAddUserModal = () => setAddUserModalVisible(true);
	
	const hideAddUserModal = () => {
		setAddUserModalVisible(false);
		addUserFormRef.current?.resetFields();
	};

	// Edit User Modal
	const showEditUserModal = (user) => {
		setEditUserModalVisible(true);
		setEditingUser(user);
	};

	const hideEditUserModal = () => {
		setEditUserModalVisible(false);
		setEditingUser(null);
		editUserFormRef.current?.resetFields();
	};

	// CRUD Operations
	
	const addUser = async (values) => {
		console.log("values ?>>>??...", values);
		try {
			await dispatch(createUser(values)).unwrap();
			hideAddUserModal();
		} catch (error) {
			console.error('Add user failed:', error);
		}
	};

	const editUser = async (values) => {
		try {
			await dispatch(updateUser({ ...values, id: editingUser.id })).unwrap();
			hideEditUserModal();
		} catch (error) {
			console.error('Update user failed:', error);
		}
	};

	const deleteUserHandler = async (userId) => {
		Modal.confirm({
			title: 'Delete User',
			content: 'Are you sure you want to delete this user? This action cannot be undone.',
			okText: 'Yes',
			cancelText: 'No',
			okType: 'danger',
			onOk: async () => {
				try {
					console.log("🗑️ Confirming delete for user:", userId);
					await dispatch(deleteUserThunk(userId)).unwrap();
					console.log("✅ User deleted from database");
				} catch (error) {
					console.error('❌ Delete user failed:', error);
				}
			},
			onCancel: () => {
				console.log("❌ Delete cancelled");
			},
		});
	};

	// UserView Modal - Simple like ProductList
	const showUserProfile = (userInfo) => {
		setUserProfileVisible(true);
		setSelectedUser(userInfo);
	};
	
	const closeUserProfile = () => {
		setUserProfileVisible(false);
		setSelectedUser(null);
	};

	const tableColumns = [
		{
			title: 'User',
			dataIndex: 'firstname',
			render: (_, record) => {
				const fullName = `${record.firstname || ''} ${record.lastname || ''}`.trim();
				return (
					<div className="d-flex">
						<AvatarStatus
							src={record.img}
							name={fullName}
							subTitle={record.email}
							icon={!record?.img ? fullName?.charAt(0).toUpperCase() : null}
						/>
					</div>
				);
			},
			sorter: {
				compare: (a, b) => {
					const nameA = `${a.firstname || ''} ${a.lastname || ''}`.toLowerCase();
					const nameB = `${b.firstname || ''} ${b.lastname || ''}`.toLowerCase();
					return nameA > nameB ? -1 : nameB > nameA ? 1 : 0;
				},
			},
		},
		{
			title: 'Phone',
			dataIndex: 'phone',
			render: phone => <span>{phone || 'N/A'}</span>,
			sorter: {
				compare: (a, b) => {
					const phoneA = a.phone || '';
					const phoneB = b.phone || '';
					return phoneA.localeCompare(phoneB);
				},
			},
		},
		{
			title: 'Role',
			dataIndex: 'role',
			sorter: {
				compare: (a, b) => a.role.length - b.role.length,
			},
		},
		{
			title: 'Status',
			dataIndex: 'isActive',
			render: (isActive) => (
				<Tag color={isActive !== false ? 'green' : 'red'}>
					{isActive !== false ? 'Active' : 'Deactivated'}
				</Tag>
			),
			sorter: {
				compare: (a, b) => (b.isActive !== false ? 1 : 0) - (a.isActive !== false ? 1 : 0),
			},
		},
		{
			title: 'Date',
			dataIndex: 'date', // Make sure this matches your data structure
			render: date => {
				// Handle both unix timestamp and ISO string
				if (date) {
					return <span>{dayjs.unix(date).format("MM/DD/YYYY")}</span>;
				}
				return <span>N/A</span>;
			},
			sorter: (a, b) => (a.date || 0) - (b.date || 0)
		},
		{
			title: '',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right d-flex justify-content-end">
					<Tooltip title="View">
						<Button 
							type="primary" 
							className="mr-2" 
							icon={<EyeOutlined />} 
							onClick={() => showUserProfile(elm)} 
							size="small"
						/>
					</Tooltip>
					<Tooltip title="Edit">
						<Button 
							type="default" 
							className="mr-2" 
							icon={<EditOutlined />} 
							onClick={() => showEditUserModal(elm)} 
							size="small"
						/>
					</Tooltip>
					<Tooltip title="Delete">
						<Button 
							danger 
							icon={<DeleteOutlined />} 
							onClick={() => deleteUserHandler(elm.id)} 
							size="small"
						/>
					</Tooltip>
				</div>
			)
		}
	];

	return (
		<Card 
			bodyStyle={{'padding': '0px'}}
			title="User Management"
			extra={
				<Row gutter={[8, 8]} align="middle" justify="end">
					<Col xs={24} sm={16} md={12} lg={16} xl={16}>
						<Search
							placeholder="Search users..."
							allowClear
							prefix={<SearchOutlined />}
							onSearch={handleSearch}
							onChange={(e) => handleSearch(e.target.value)}
							style={{ width: '100%', marginBottom: "10px"}}
						/>
					</Col>
					<Col xs={24} sm={8} md={8} lg={8} xl={8}>
						<Button 
							type="primary" 
							icon={<UserAddOutlined />} 
							onClick={showAddUserModal}
							style={{ width: '100%', marginBottom: "10px" }}
							loading={loading}
						>
							Add User
						</Button>
					</Col>
				</Row>
			}
		>
			<div className="table-responsive">
				<Table 
					columns={tableColumns} 
					dataSource={filteredUsers} 
					rowKey='id' 
					loading={loading}
				/>
			</div>

			{/* View User Modal - Simple like ProductList */}
			<Modal
				title="User Details"
				open={userProfileVisible}
				onCancel={closeUserProfile}
				footer={[
					<Button key="close" onClick={closeUserProfile}>
						Close
					</Button>
				]}
				width={600}
			>
				{selectedUser && (
					<div>
						<div style={{ textAlign: 'center', marginBottom: 24 }}>
							<div 
								style={{
									width: 120,
									height: 120,
									borderRadius: '50%',
									background: '#cdd2d5',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: 48,
									color: 'white',
									fontWeight: 'bold',
									margin: '0 auto',
									border: '2px solid #d9d9d9'
								}}
							>
								{selectedUser.firstname ? selectedUser?.firstname?.charAt(0).toUpperCase() : 'U'}
							</div>
						</div>

						<Descriptions bordered column={1}>
							<Descriptions.Item label="First Name">
								<strong>{selectedUser.firstname || 'N/A'}</strong>
							</Descriptions.Item>
							<Descriptions.Item label="Last Name">
								<strong>{selectedUser.lastname || 'N/A'}</strong>
							</Descriptions.Item>
							<Descriptions.Item label="Email">
								{selectedUser.email}
							</Descriptions.Item>
							<Descriptions.Item label="Phone">
								{selectedUser.phone || 'N/A'}
							</Descriptions.Item>
							<Descriptions.Item label="Date of Birth">
								{selectedUser.dob ? dayjs(selectedUser.dob).format("DD/MM/YYYY") : 'N/A'}
							</Descriptions.Item>
							<Descriptions.Item label="Location">
								{selectedUser.location || 'N/A'}
							</Descriptions.Item>
							<Descriptions.Item label="Timezone">
								{selectedUser.timezone || 'N/A'}
							</Descriptions.Item>
							<Descriptions.Item label="Role">
								<Tag color="blue">{selectedUser.role}</Tag>
							</Descriptions.Item>
							<Descriptions.Item label="Verified">
								<Tag color={selectedUser.isVerified ? 'green' : 'red'}>
									{selectedUser.isVerified ? 'Verified' : 'Not Verified'}
								</Tag>
							</Descriptions.Item>
							<Descriptions.Item label="Date">
								{selectedUser.date ? dayjs.unix(selectedUser.date).format("DD/MM/YYYY hh:mm A") : 'N/A'}
							</Descriptions.Item>
						</Descriptions>
					</div>
				)}
			</Modal>

			{/* Add User Modal */}
			<Modal
				title="Add New User"
				open={addUserModalVisible}
				onCancel={hideAddUserModal}
				footer={null}
				destroyOnClose={true}
			>
				<Form
					ref={addUserFormRef}
					layout="vertical"
					onFinish={addUser}
					requiredMark={false}
				>
					<Row gutter={16}>
						<Col xs={24} sm={12}>
							<Form.Item
								label="First Name"
								name="firstname"
								rules={[
									{ required: true, message: 'Please enter first name!' },
									{ min: 2, message: 'First name must be at least 2 characters!' }
								]}
							>
								<Input placeholder="Enter first name" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item
								label="Last Name"
								name="lastname"
								rules={[
									{ required: true, message: 'Please enter last name!' },
									{ min: 2, message: 'Last name must be at least 2 characters!' }
								]}
							>
								<Input placeholder="Enter last name" />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						label="Email"
						name="email"
						rules={[
							{ required: true, message: 'Please enter email!' },
							{ type: 'email', message: 'Please enter valid email!' }
						]}
					>
						<Input placeholder="Enter email address" />
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[
							{ required: true, message: 'Please enter your password!' },
							{ min: 6, message: 'Password must be at least 6 characters!' },
						]}
					>
						<Input.Password placeholder="Enter password" />
					</Form.Item>

					<Form.Item
						label="Phone Number"
						name="phone"
						rules={[
							{ pattern: /^[+]?[\d\s\-\(\)]{10,15}$/, message: 'Please enter valid phone number!' }
						]}
					>
						<Input placeholder="Enter phone number" />
					</Form.Item>

					<Form.Item
						label="Date of Birth"
						name="dob"
					>
						<Input type="date" placeholder="Select date of birth" />
					</Form.Item>

					<Form.Item
						label="Location"
						name="location"
					>
						<Input placeholder="Enter location" />
					</Form.Item>

					<Form.Item
						label="Timezone"
						name="timezone"
						rules={[
							{ required: true, message: 'Please select timezone!' }
						]}
					>
						<Select 
							placeholder="Select timezone"
							showSearch
							optionFilterProp="label"
						>
							{TIMEZONES.map((tz) => (
								<Option key={tz.value} value={tz.value} label={tz.label}>
									{tz.label}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						label="Role"
						name="role"
						initialValue="user"
					>
						<Input type="hidden" />
					</Form.Item>

					<Form.Item className="text-right mb-0">
						<Button className="mr-2" onClick={hideAddUserModal} disabled={loading}>
							Cancel
						</Button>
						<Button type="primary" htmlType="submit" loading={loading}>
							Add User
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			{/* Edit User Modal */}
			<Modal
				title="Edit User"
				open={editUserModalVisible}
				onCancel={hideEditUserModal}
				footer={null}
				destroyOnClose={true}
			>
				{editingUser && (
					<Form
						ref={editUserFormRef}
						layout="vertical"
						onFinish={editUser}
						requiredMark={false}
						initialValues={{
							firstname: editingUser.firstname,
							lastname: editingUser.lastname,
							email: editingUser.email,
							phone: editingUser.phone || '',
							dob: editingUser.dob || '',
							location: editingUser.location || '',
							timezone: editingUser.timezone || '',
							role: editingUser.role,
						}}
					>
						<Row gutter={16}>
							<Col xs={24} sm={12}>
								<Form.Item
									label="First Name"
									name="firstname"
									rules={[
										{ required: true, message: 'Please enter first name!' },
										{ min: 2, message: 'First name must be at least 2 characters!' }
									]}
								>
									<Input placeholder="Enter first name" />
								</Form.Item>
							</Col>
							<Col xs={24} sm={12}>
								<Form.Item
									label="Last Name"
									name="lastname"
									rules={[
										{ required: true, message: 'Please enter last name!' },
										{ min: 2, message: 'Last name must be at least 2 characters!' }
									]}
								>
									<Input placeholder="Enter last name" />
								</Form.Item>
							</Col>
						</Row>

						<Form.Item
							label="Email"
							name="email"
							rules={[
								{ required: true, message: 'Please enter email!' },
								{ type: 'email', message: 'Please enter valid email!' }
							]}
						>
							<Input placeholder="Enter email address" />
						</Form.Item>

						<Form.Item
							label="Phone Number"
							name="phone"
						>
							<Input placeholder="Enter phone number" />
						</Form.Item>

						<Form.Item
							label="Date of Birth"
							name="dob"
						>
							<Input type="date" placeholder="Select date of birth" />
						</Form.Item>

						<Form.Item
							label="Location"
							name="location"
						>
							<Input placeholder="Enter location" />
						</Form.Item>

						<Form.Item
							label="Timezone"
							name="timezone"
							rules={[
								{ required: true, message: 'Please select timezone!' }
							]}
						>
							<Select 
								placeholder="Select timezone"
								showSearch
								optionFilterProp="label"
							>
								{TIMEZONES.map((tz) => (
									<Option key={tz.value} value={tz.value} label={tz.label}>
										{tz.label}
									</Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							label="Role"
							name="role"
							initialValue="user"
						>
							<Input type="hidden" />
						</Form.Item>

						<Form.Item className="text-right mb-0">
							<Button className="mr-2" onClick={hideEditUserModal} disabled={loading}>
								Cancel
							</Button>
							<Button type="primary" htmlType="submit" loading={loading}>
								Update User
							</Button>
						</Form.Item>
					</Form>
				)}
			</Modal>
		</Card>
	)
}

export default UserList