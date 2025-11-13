// import React, { useMemo, lazy, Suspense } from 'react';
// import { Menu } from 'antd';
// import InnerAppLayout from 'layouts/inner-app-layout';
// import { Route, Routes, useLocation, Link, Navigate } from 'react-router-dom';
// import Loading from 'components/shared-components/Loading';

// const url = '/app/docs'

// const menuList = [
// 	{ 
// 		name: 'Introduction', 
// 		key: 'introduction',
// 		sub: []
// 	},
// 	{ 
// 		name: 'Product Content', 
// 		key: 'product-content',
// 		sub: []
// 	},
// 	{ 
// 		name: 'Folder Structure', 
// 		key: 'folder-structure',
// 		sub: []
// 	},
// 	{ 
// 		name: 'Layout Overview', 
// 		key: 'layout-overview',
// 		sub: []
// 	},
// 	{ 
// 		name: 'Installation', 
// 		key: 'installation',
// 		sub: []
// 	},
// 	{ 
// 		name: 'Development', 
// 		key: 'development',
// 		sub: []
// 	},
// 	{ 
// 		name: 'Updating', 
// 		key: 'updating',
// 		sub: []
// 	},
// 	{ 
// 		name: 'TemplateSetting', 
// 		key: 'template-setting',
// 		sub: []
// 	},
// 	{ 
// 		name: 'Routing', 
// 		key: 'routing',
// 		sub: [] 
// 	},
// 	{ 
// 		name: 'Redux', 
// 		key: 'redux',
// 		sub: [] 
// 	},
// 	{
// 		name: 'Api Integration',
// 		key: 'apiIntegration',
// 		sub: [] 
// 	},
// 	{
// 		name: 'Mock Api',
// 		key: 'mockApi',
// 		sub: [] 
// 	},
// 	{ 
// 		name: 'Authentication', 
// 		key: 'authentication',
// 		sub: [
// 			{
// 				name: 'JWT', 
// 				key: 'jwt',
// 				sub: [] 
// 			},
// 			{
// 				name: 'Firebase', 
// 				key: 'firebase',
// 				sub: [] 
// 			}
// 		] 
// 	},
// 	{ 
// 		name: 'Localization', 
// 		key: 'localization',
// 		sub: [] 
// 	},
// 	{ 
// 		name: 'Components', 
// 		key: 'components',
// 		sub: [
// 			{
// 				name: 'AvatarStatusDemo', 
// 				key: 'avatar-status-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'ChartWidgetDemo', 
// 				key: 'chart-widget-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'CustomStatisticDemo', 
// 				key: 'custom-statistic-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'ColorPickerDemo', 
// 				key: 'color-picker-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'DataDisplayWidgetDemo', 
// 				key: 'data-display-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'DonutChartWidgetDemo', 
// 				key: 'donut-chart-Widget-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'EllipsisDropdownDemo', 
// 				key: 'ellipsis-dropdown-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'FlexDemo', 
// 				key: 'flex-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'GoalWidgetDemo', 
// 				key: 'goal-widget-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'LoadingDemo', 
// 				key: 'loading-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'RegiondataWidgetDemo', 
// 				key: 'regiondata-widget-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'StatisticWidgetDemo', 
// 				key: 'statistic-widget-demo',
// 				sub: [] 
// 			},
// 			{
// 				name: 'CustomIconDemo', 
// 				key: 'custom-icon-demo',
// 				sub: [] 
// 			}
// 		] 
// 	},
// 	{ 
// 		name: 'UtilityClasses', 
// 		key: 'utility-classes',
// 		sub: [] 
// 	},
// 	{ 
// 		name: 'Changelog', 
// 		key: 'changelog',
// 		sub: [] 
// 	}
// ]

// const prefix = 'documentation/'

// const MenuItem = ({title, path}) => {

// 	return (
// 		<>
// 			<span>{title}</span>
// 			<Link to={`${path}`}/>
// 		</>
// 	)
// }


// const getMenuItem = (navItem) => navItem.map(nav => {
// 	return {
// 		key: nav.key,
// 		label: nav.sub.length > 0 ? nav.name : <MenuItem title={nav.name} path={nav.key} />,
// 		...(nav.sub.length > 0 ? {children: getMenuItem(nav.sub)} : {})
// 	}
// })


// const DocsMenu = () => {

// 	const location = useLocation();

// 	const menuItems = useMemo(() => getMenuItem(menuList), []);

// 	const locationPath = location.pathname.split('/');

// 	const currentpath = locationPath[locationPath.length - 1];

// 	return (
// 		<div className="w-100">
// 			<Menu
// 				defaultSelectedKeys={`${url}/introduction`}
// 				mode="inline"
// 				style={{ borderInlineEnd: 0 }}
// 				selectedKeys={[currentpath]}
// 				items={menuItems}
// 			/>
// 		</div>
// 	)
// }

// const ElementRoute = ({ component: Component, routeKey, ...props }) => {
// 	return (
// 		<Component {...props} />
// 	)
// }

// const Docs = props => {
// 	return (
// 		<InnerAppLayout 
// 			sideContent={<DocsMenu {...props}/>}
// 			mainContent={
// 				<div className="p-4">
// 					<div className="container-fluid">
// 						<Suspense fallback={<Loading />}>
// 							<Routes>
// 								{menuList.map(elm => (
// 									elm.sub.length === 0 ?
// 									<Route 
// 										key={elm.key}
// 										path={`${elm.key}`} 
// 										element={
// 											<ElementRoute 
// 												component={lazy(() => import(`./components/${elm.name.replace(/\s/g, '')}`))}
// 											/>
// 										}	
// 									/>
// 									:
// 									elm.sub.map(item => (
// 										<Route 
// 											key={item.key}
// 											path={`${item.key}`} 
// 											element={
// 												<ElementRoute 
// 													component={lazy(() => import(`./components/${item.name.replace(/\s/g, '')}`))}
// 												/>
// 											}	
// 										/>
// 									))
// 								))}
// 								<Route path="*" element={<Navigate to="introduction" replace />} />
// 							</Routes>
// 						</Suspense>
// 					</div>
// 				</div>
// 			}
// 			sideContentWidth={300}
// 			sideContentGutter={false}
// 			border
// 		/>
// 	)
// }

// export default Docs
// import React, { useEffect, useState } from 'react'
// import { Card, Table, Input, Tag, message } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import api from 'configs/UniversityConfig';

// const JourneyReportsList = () => {
// 	const [journeyReports, setJourneyReports] = useState([]);
// 	const [filteredReports, setFilteredReports] = useState([]);
// 	const [loading, setLoading] = useState(false);
// 	const [searchValue, setSearchValue] = useState('');

// 	// Fetch journey reports from API
// 	const fetchJourneyReports = async () => {
// 		setLoading(true);
// 		try {
// 			// Fixed: Use api.get() instead of api.fetch()
// 			const response = await api.get('getalljourneyreports');
			
// 			// Fixed: Access response.data directly (axios response structure)
// 			const result = response.data;
			
// 			if (result.success) {
// 				setJourneyReports(result.data);
// 				setFilteredReports(result.data);
// 				// message.success(`${result.count || result.data.length} journey reports loaded successfully`);
// 			} else {
// 				message.error(result.message || 'Failed to load journey reports');
// 			}
// 		} catch (error) {
// 			console.error('Error fetching journey reports:', error);
// 			// Better error handling
// 			const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch journey reports';
// 			message.error(errorMessage);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchJourneyReports();
// 	}, []);

// 	// Update filtered reports when search value changes
// 	useEffect(() => {
// 		if (searchValue.trim()) {
// 			const filtered = journeyReports.filter(report => {
// 				const studentName = report.student?.name?.toLowerCase() || '';
// 				const reason = report.reason?.toLowerCase() || '';
// 				const searchTerm = searchValue.toLowerCase();
				
// 				return studentName.includes(searchTerm) || reason.includes(searchTerm);
// 			});
// 			setFilteredReports(filtered);
// 		} else {
// 			setFilteredReports(journeyReports);
// 		}
// 	}, [journeyReports, searchValue]);

// 	// Search functionality
// 	const onSearch = (e) => {
// 		const value = e.target.value;
// 		setSearchValue(value);
// 	};

// 	// Clear search
// 	const clearSearch = () => {
// 		setSearchValue('');
// 	};

// 	const tableColumns = [
// 		{
// 			title: 'Student Name',
// 			dataIndex: ['student', 'name'],
// 			key: 'studentName',
// 			render: (name) => (
// 				<div style={{ fontWeight: 500, fontSize: '14px' }}>
// 					{name || 'N/A'}
// 				</div>
// 			),
// 			sorter: {
// 				compare: (a, b) => {
// 					const nameA = (a.student?.name || '').toLowerCase();
// 					const nameB = (b.student?.name || '').toLowerCase();
// 					return nameA > nameB ? 1 : nameB > nameA ? -1 : 0;
// 				},
// 			},
// 		},
// 		{
// 			title: 'Status',
// 			dataIndex: 'reachedSafely',
// 			key: 'status',
// 			render: (reachedSafely) => (
// 				<Tag color={reachedSafely ? 'green' : 'red'}>
// 					{reachedSafely ? 'Reached Safely' : 'Not Safe'}
// 				</Tag>
// 			),
// 			sorter: {
// 				compare: (a, b) => a.reachedSafely - b.reachedSafely,
// 			},
// 			filters: [
// 				{ text: 'Reached Safely', value: true },
// 				{ text: 'Not Safe', value: false },
// 			],
// 			onFilter: (value, record) => record.reachedSafely === value,
// 		},
// 		{
// 			title: 'Reason',
// 			dataIndex: 'reason',
// 			key: 'reason',
// 			render: (reason) => (
// 				<div style={{ maxWidth: 200, wordWrap: 'break-word' }}>
// 					{reason || 'N/A'}
// 				</div>
// 			),
// 		},
// 		{
// 			title: 'Start Time',
// 			dataIndex: 'startTime',
// 			key: 'startTime',
// 			render: (startTime) => {
// 				if (!startTime) return 'N/A';
// 				return (
// 					<div>
// 						{dayjs(startTime).format('DD/MM/YYYY HH:mm:ss')}
// 					</div>
// 				);
// 			},
// 			sorter: {
// 				compare: (a, b) => {
// 					if (!a.startTime && !b.startTime) return 0;
// 					if (!a.startTime) return 1;
// 					if (!b.startTime) return -1;
// 					return dayjs(a.startTime).unix() - dayjs(b.startTime).unix();
// 				},
// 			},
// 		},
// 		// {
// 		// 	title: 'End Time',
// 		// 	dataIndex: 'endTime',
// 		// 	key: 'endTime',
// 		// 	render: (endTime) => {
// 		// 		if (!endTime) return 'N/A';
// 		// 		return (
// 		// 			<div>
// 		// 				{dayjs(endTime).format('DD/MM/YYYY HH:mm:ss')}
// 		// 			</div>
// 		// 		);
// 		// 	},
// 		// 	sorter: {
// 		// 		compare: (a, b) => {
// 		// 			if (!a.endTime && !b.endTime) return 0;
// 		// 			if (!a.endTime) return 1;
// 		// 			if (!b.endTime) return -1;
// 		// 			return dayjs(a.endTime).unix() - dayjs(b.endTime).unix();
// 		// 		},
// 		// 	},
// 		// },
// 		// {
// 		// 	title: 'Duration',
// 		// 	key: 'duration',
// 		// 	render: (_, record) => {
// 		// 		if (!record.startTime || !record.endTime) return 'N/A';
				
// 		// 		const start = dayjs(record.startTime);
// 		// 		const end = dayjs(record.endTime);
// 		// 		const diffInMinutes = end.diff(start, 'minute');
				
// 		// 		if (diffInMinutes < 60) {
// 		// 			return `${diffInMinutes} min`;
// 		// 		} else {
// 		// 			const hours = Math.floor(diffInMinutes / 60);
// 		// 			const minutes = diffInMinutes % 60;
// 		// 			return `${hours}h ${minutes}m`;
// 		// 		}
// 		// 	},
// 		// 	sorter: {
// 		// 		compare: (a, b) => {
// 		// 			if (!a.startTime || !a.endTime || !b.startTime || !b.endTime) return 0;
// 		// 			const durationA = dayjs(a.endTime).diff(dayjs(a.startTime), 'minute');
// 		// 			const durationB = dayjs(b.endTime).diff(dayjs(b.startTime), 'minute');
// 		// 			return durationA - durationB;
// 		// 		},
// 		// 	},
// 		// },
// 	];

// 	return (
// 		<Card
// 			bodyStyle={{ 'padding': '0px' }}
// 			title="Journey Reports"
// 			extra={
// 				<div className="mb-4">
// 					<Input
// 						placeholder="Search by student name or reason..."
// 						prefix={<SearchOutlined />}
// 						onChange={onSearch}
// 						value={searchValue}
// 						allowClear
// 						onClear={clearSearch}
// 						style={{ width: 300 }}
// 					/>
// 				</div>
// 			}
// 		>
// 			<div className="table-responsive">
// 				<Table 
// 					columns={tableColumns} 
// 					dataSource={filteredReports} 
// 					rowKey='_id' 
// 					loading={loading}
// 					// pagination={{
// 					// 	showSizeChanger: true,
// 					// 	showQuickJumper: true,
// 					// 	showTotal: (total, range) =>
// 					// 		`${range[0]}-${range[1]} of ${total} journey reports`,
// 					// 	pageSizeOptions: ['10', '20', '50', '100'],
// 					// 	defaultPageSize: 10,
// 					// }}
// 					scroll={{ x: 800 }} // Horizontal scroll for mobile
// 				/>
// 			</div>
// 		</Card>
// 	)
// }

// export default JourneyReportsList

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
  Select,
  Descriptions,
  Tag,
  InputNumber,
  Switch,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

// Static JSON data - aap baad mein isko API se replace kar sakte hain
const initialPlans = [
  {
    id: 1,
    name: "Basic Plan",
    price: 9.99,
    duration: "monthly",
    features: [
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
    ],
    isActive: true,
    isBestValue: false,
  },
  {
    id: 2,
    name: "Premium Plan",
    price: 19.99,
    duration: "monthly",
    features: [
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
    ],
    isActive: true,
    isBestValue: true,
  },
  {
    id: 3,
    name: "Annual Basic",
    price: 99.99,
    duration: "yearly",
    features: [
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
    ],
    isActive: true,
    isBestValue: false,
  },
];

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [planProfileVisible, setPlanProfileVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [addPlanModalVisible, setAddPlanModalVisible] = useState(false);
  const [editPlanModalVisible, setEditPlanModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");

  const [addPlanForm] = Form.useForm();
  const [editPlanForm] = Form.useForm();

  useEffect(() => {
    filterPlans();
  }, [plans, searchValue, durationFilter]);

  const filterPlans = () => {
    let filtered = plans;

    // Duration filter
    if (durationFilter !== "all") {
      filtered = filtered.filter((plan) => plan.duration === durationFilter);
    }

    // Search filter
    if (searchValue.trim()) {
      filtered = filtered.filter(
        (plan) =>
          plan.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          plan.price.toString().includes(searchValue)
      );
    }

    setFilteredPlans(filtered);
  };

  const onSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const onDurationFilterChange = (value) => {
    setDurationFilter(value);
  };

  const showAddPlanModal = () => {
    setAddPlanModalVisible(true);
  };

  const hideAddPlanModal = () => {
    setAddPlanModalVisible(false);
    addPlanForm.resetFields();
  };

  const showEditPlanModal = (plan) => {
    setEditPlanModalVisible(true);
    setEditingPlan(plan);
    setTimeout(() => {
      editPlanForm.setFieldsValue({
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        features: plan.features.join("\n"),
        isActive: plan.isActive,
        isBestValue: plan.isBestValue,
      });
    }, 100);
  };

  const hideEditPlanModal = () => {
    setEditPlanModalVisible(false);
    setEditingPlan(null);
    editPlanForm.resetFields();
  };

  const addPlan = (values) => {
    const newPlan = {
      id: plans.length + 1,
      name: values.name,
      price: values.price,
      duration: values.duration,
      features: values.features.split("\n").filter((f) => f.trim() !== ""),
      isActive: values.isActive || true,
      isBestValue: values.isBestValue || false,
    };


    setPlans([...plans, newPlan]);
    setAddPlanModalVisible(false);
    addPlanForm.resetFields();
    message.success({
      content: `Plan ${values.name} added successfully!`,
      duration: 2,
    });
  };

  const editPlan = (values) => {
    const updatedPlans = plans.map((plan) =>
      plan.id === editingPlan.id
        ? {
            ...plan,
            name: values.name,
            price: values.price,
            duration: values.duration,
            features: values.features.split("\n").filter((f) => f.trim() !== ""),
            isActive: values.isActive,
            isBestValue: values.isBestValue,
          }
        : plan
    );

    setPlans(updatedPlans);
    setEditPlanModalVisible(false);
    setEditingPlan(null);
    editPlanForm.resetFields();
    message.success({
      content: `Plan ${values.name} updated successfully!`,
      duration: 2,
    });
  };

  const handleDeletePlan = (planId, planName) => {
    Modal.confirm({
      title: "Are you sure?",
      content: `Do you want to delete the plan "${planName}"?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        setPlans(plans.filter((plan) => plan.id !== planId));
        message.success(`Plan ${planName} deleted successfully!`);
      },
    });
  };

  const showPlanProfile = (planInfo) => {
    setPlanProfileVisible(true);
    setSelectedPlan(planInfo);
  };

  const closePlanProfile = () => {
    setPlanProfileVisible(false);
    setSelectedPlan(null);
  };

  const tableColumns = [
    {
      title: "Plan Name",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <div>
            <div style={{ fontWeight: 500, fontSize: "14px" }}>
              {record.name}
            </div>
            {record.isBestValue && (
              <Tag color="pink" style={{ marginTop: 4 }}>
                Best Value
              </Tag>
            )}
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price, record) => (
        <div style={{ fontWeight: 500, color: "#ff69b4", fontSize: "16px" }}>
          ${price.toFixed(2)}
          <span style={{ fontSize: "12px", color: "#666", marginLeft: 4 }}>
            /{record.duration === "monthly" ? "Monthly" : "Yearly"}
          </span>
        </div>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (duration) => (
        <Tag color={duration === "monthly" ? "pink" : "purple"}>
          {duration.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Monthly", value: "monthly" },
        { text: "Yearly", value: "yearly" },
      ],
      onFilter: (value, record) => record.duration === value,
    },
    {
      title: "Features",
      dataIndex: "features",
      render: (features) => (
        <div style={{ fontSize: "12px" }}>{features.length} features</div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right d-flex justify-content-end">
          <Tooltip title="View">
            <Button
              type="primary"
              className="mr-2"
              icon={<EyeOutlined />}
              onClick={() => showPlanProfile(elm)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="default"
              className="mr-2"
              icon={<EditOutlined />}
              onClick={() => showEditPlanModal(elm)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeletePlan(elm.id, elm.name)}
              size="small"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Card
      bodyStyle={{ padding: "0px" }}
      title="Subscription Plans Management"
      extra={
        <div className="mb-4" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
          <Select
            style={{ width: 100 }}
            value={durationFilter}
            onChange={onDurationFilterChange}
          >
            <Option value="all">All Plans</Option>
            <Option value="monthly">Monthly</Option>
            <Option value="yearly">Yearly</Option>
          </Select>
          <Input
            placeholder="Search plans..."
            prefix={<SearchOutlined />}
            onChange={onSearch}
            value={searchValue}
            style={{ width: 150 }}
          />
          </div>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={showAddPlanModal}
          >
            Add Plan
          </Button>
        </div>
      }
    >
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={filteredPlans}
          rowKey="id"
          loading={loading}
        />
      </div>

      {/* View Plan Modal */}
      <Modal
        title="Plan Details"
        open={planProfileVisible}
        onCancel={closePlanProfile}
        footer={[
          <Button key="close" onClick={closePlanProfile}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedPlan && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Plan Name">
                <strong>{selectedPlan.name}</strong>
                {selectedPlan.isBestValue && (
                  <Tag color="pink" style={{ marginLeft: 8 }}>
                    Best Value
                  </Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                <span style={{ fontSize: "18px", fontWeight: 600, color: "#ff69b4" }}>
                  ${selectedPlan.price.toFixed(2)}
                </span>
                <span style={{ marginLeft: 8 }}>
                  /{selectedPlan.duration === "monthly" ? "Monthly" : "Yearly"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                <Tag color={selectedPlan.duration === "monthly" ? "pink" : "purple"}>
                  {selectedPlan.duration.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedPlan.isActive ? "green" : "red"}>
                  {selectedPlan.isActive ? "Active" : "Inactive"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Features">
                <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: 8 }}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Add Plan Modal */}
      <Modal
        title="Add New Plan"
        open={addPlanModalVisible}
        onCancel={hideAddPlanModal}
        footer={null}
        destroyOnClose={true}
        width={600}
      >
        <Form
          form={addPlanForm}
          layout="vertical"
          onFinish={addPlan}
          requiredMark={false}
          initialValues={{ isActive: true, isBestValue: false }}
        >
          <Form.Item
            label="Plan Name"
            name="name"
            rules={[
              { required: true, message: "Please enter plan name!" },
              { min: 3, message: "Plan name must be at least 3 characters!" },
            ]}
          >
            <Input placeholder="Enter plan name (e.g., Basic Plan, Premium Plan)" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please enter price!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter price"
              min={0}
              step={0.01}
              prefix="$"
            />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[
              { required: true, message: "Please select duration!" },
            ]}
          >
            <Select placeholder="Select duration">
              <Option value="monthly">Monthly</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Features (one per line)"
            name="features"
            rules={[
              { required: true, message: "Please enter at least one feature!" },
            ]}
          >
            <TextArea
              rows={6}
              placeholder="Enter features (one per line)&#10;Lorem ipsum dolor sit amet&#10;Lorem ipsum dolor sit amet&#10;Lorem ipsum dolor sit amet"
            />
          </Form.Item>

          <Form.Item label="Best Value Badge" name="isBestValue" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Active Status" name="isActive" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Button className="mr-2" onClick={hideAddPlanModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Plan
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Plan Modal */}
      <Modal
        title="Edit Plan"
        open={editPlanModalVisible}
        onCancel={hideEditPlanModal}
        footer={null}
        destroyOnClose={true}
        width={600}
      >
        {editingPlan && (
          <Form
            form={editPlanForm}
            layout="vertical"
            onFinish={editPlan}
            requiredMark={false}
          >
            <Form.Item
              label="Plan Name"
              name="name"
              rules={[
                { required: true, message: "Please enter plan name!" },
                { min: 3, message: "Plan name must be at least 3 characters!" },
              ]}
            >
              <Input placeholder="Enter plan name" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please enter price!" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter price"
                min={0}
                step={0.01}
                prefix="$"
              />
            </Form.Item>

            <Form.Item
              label="Duration"
              name="duration"
              rules={[
                { required: true, message: "Please select duration!" },
              ]}
            >
              <Select placeholder="Select duration">
                <Option value="monthly">Monthly</Option>
                <Option value="yearly">Yearly</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Features (one per line)"
              name="features"
              rules={[
                { required: true, message: "Please enter at least one feature!" },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Enter features (one per line)"
              />
            </Form.Item>

            <Form.Item label="Best Value Badge" name="isBestValue" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Active Status" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item className="text-right mb-0">
              <Button className="mr-2" onClick={hideEditPlanModal}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Plan
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Card>
  );
};

export default SubscriptionPlans;