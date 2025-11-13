// import React from 'react'
// import { Row, Col, Card, Grid, Button, Badge } from 'antd';
// import { pricingData } from './pricingData';
// import utils from 'utils'

// const { useBreakpoint } = Grid;

// const Pricing = () => {
// 	const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg')
// 	const colCount = pricingData.length
// 	console.log('isMobile', isMobile)
// 	return (
// 		<Card>
// 			<div className="container">
// 				<div className="text-center mb-4">
// 					<h2 className="font-weight-semibold">Pick a base plan</h2>
// 					<Row type="flex" justify="center">
// 						<Col sm={24} md={12} lg={8}>
// 							<p>
// 								Space, the final frontier. These are the voyages of the Starship Enterprise. Its five-year mission.
// 							</p>
// 						</Col>
// 					</Row>
// 				</div>
// 				<Row>
// 					{
// 						pricingData.map((elm , i) => {
// 							return (
// 								<Col key={`price-column-${i}`} xs={24} sm={24} md={24/colCount} lg={24/colCount} className={colCount === (i + 1) || isMobile ? '' : 'border-right'}>
// 									<div className="p-3">
// 										<div className="text-center">
// 											<img className="img-fluid" src={elm.image} alt="" />
// 											<h1 className="display-4 mt-4"> 
// 												<span className="font-size-md d-inline-block mr-1" style={{transform: 'translate(0px, -17px)'}}>$</span>
// 												<span>{elm.price}</span>
// 											</h1>
// 											<p className="mb-0">{elm.duration}</p>
// 										</div>
// 										<div className="mt-4">
// 											<h2 className="text-center font-weight-semibold">{elm.plan}</h2>
// 										</div>
// 										<div className="d-flex justify-content-center mt-3">
// 											<div>
// 												{
// 													elm.features.map((elm , i) => {
// 														return (
// 															<p key={`pricing-feature-${i}`}>
// 																<Badge color={'blue'} />
// 																<span>{elm}</span>
// 															</p>
// 														)
// 													})
// 												}
// 											</div>
// 										</div>
// 										<div className="mt-3 text-center">
// 											<Button type="default">Get Started</Button>
// 										</div>
// 									</div>
// 								</Col>
// 							)
// 						})
// 					}
// 				</Row>
// 				<div className="mt-5 pt-lg-4">
// 					<h1 className="text-center font-weight-light">Frequently Asked Questions</h1>
// 				</div>
// 				<Row gutter={60} className="mt-5">
// 					<Col sm={24} md={12} lg={12}>
// 						<div className="mb-5">
// 							<h3 className="font-weight-semibold">Is it expensive?</h3>
// 							<p>
// 								Twitch tail in permanent irritation poop on grasses, drink water out of the faucet,
// 								plays league of legends have my breakfast spaghetti yarn. 
// 								Taco cat backwards spells taco cat stick butt in face.
// 							</p>
// 						</div>
// 						<div className="mb-5">
// 							<h3 className="font-weight-semibold">Is it secure?</h3>
// 							<p>
// 								Splice the main brace Jolly Roger me hogshead prow red ensign ye swing the lead log ho. Handsomely spanker
// 								dance the hempen jig pinnace overhaul crimp tack booty rigging lateen sail.
// 								Sea Legs boatswain hempen halter provost bilge rat ballast maroon man-of-war bowsprit Chain Shot.
// 							</p>
// 						</div>
// 					</Col>
// 					<Col sm={24} md={12} lg={12}>
// 						<div className="mb-5">
// 							<h3 className="font-weight-semibold">How to start?</h3>
// 							<p>
// 								Purr like an angel nap all day, for poop on grasses for chase after silly colored fish toys
// 								around the house stares at human while pushing stuff off a table or i heard this rumor where
// 								the humans are our owners.
// 							</p>
// 						</div>
// 						<div className="mb-5">
// 							<h3 className="font-weight-semibold">Is there any discount?</h3>
// 							<p>
// 								Cry louder at reflection. More napping, more napping all the napping is exhausting toilet
// 								paper attack claws fluff everywhere meow miao french ciao litterbox.
// 							</p>
// 						</div>
// 					</Col>
// 				</Row>
// 			</div>
// 		</Card>
// 	)
// }

// export default Pricing


import React, { useState } from 'react';
import { 
  Card,
  Input, 
  Button, 
  Modal, 
  Descriptions, 
  Table, 
  Tooltip, 
  Form,
  Space,
  message 
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const PromptManagement = () => {
  // State Management
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [form] = Form.useForm();

  // Search Handler
  const onSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (value.trim()) {
      const filtered = prompts.filter((prompt) =>
        prompt.text.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPrompts(filtered);
    } else {
      setFilteredPrompts(prompts);
    }
  };

  // Add Prompt Handlers
  const showAddPromptModal = () => {
    setIsAddModalOpen(true);
  };

  const hideAddPromptModal = () => {
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const addPrompt = () => {
    form.validateFields().then(values => {
      const newPrompt = {
        id: Date.now(),
        text: values.text,
        createdAt: new Date(),
      };
      const updatedPrompts = [...prompts, newPrompt];
      setPrompts(updatedPrompts);
      setFilteredPrompts(updatedPrompts);
      hideAddPromptModal();
      message.success(`Prompt added successfully!`);
    }).catch(error => {
      console.error('Validation failed:', error);
    });
  };

  // Edit Prompt Handlers
  const showEditPromptModal = (record) => {
    setSelectedPrompt(record);
    setIsEditModalOpen(true);
    setTimeout(() => {
      form.setFieldsValue({ text: record.text });
    }, 100);
  };

  const hideEditPromptModal = () => {
    setIsEditModalOpen(false);
    setSelectedPrompt(null);
    form.resetFields();
  };

  const editPrompt = () => {
    form.validateFields().then(values => {
      const updated = prompts.map(p =>
        p.id === selectedPrompt.id ? { ...p, text: values.text } : p
      );
      setPrompts(updated);
      setFilteredPrompts(updated);
      hideEditPromptModal();
      message.success(`Prompt updated successfully!`);
    }).catch(error => {
      console.error('Validation failed:', error);
    });
  };

  // Delete Prompt Handler
  const handleDeletePrompt = (id, text) => {
    Modal.confirm({
      title: 'Delete Prompt',
      content: `Are you sure you want to delete this prompt?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        const updated = prompts.filter((p) => p.id !== id);
        setPrompts(updated);
        setFilteredPrompts(updated);
        message.success('Prompt deleted successfully!');
      },
    });
  };

  // View Prompt Handler
  const showPromptProfile = (record) => {
    setSelectedPrompt(record);
    setIsViewModalOpen(true);
  };

  const closePromptProfile = () => {
    setIsViewModalOpen(false);
    setSelectedPrompt(null);
  };

  // Table Columns Configuration
  const tableColumns = [
    {
      title: "Prompt",
      dataIndex: "text",
      render: (_, record) => (
        <div style={{ fontWeight: 500, fontSize: "14px" }}>
          {record.text}
        </div>
      ),
    },
    {
      title: "Date Added",
      dataIndex: "createdAt",
      render: (date) => dayjs(date).format("DD MMM YYYY, hh:mm A"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      align: "right",
      render: (_, elm) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => showPromptProfile(elm)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditPromptModal(elm)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeletePrompt(elm.id, elm.text)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      bodyStyle={{ padding: "0px" }}
      title="Prompt Management"
      extra={
        
        <Space style={{marginBottom: "20px", display: "flex", flexWrap:"wrap",}}>
          <Input
            placeholder="Search prompts..."
            prefix={<SearchOutlined />}
            onChange={onSearch}
            value={searchValue}
            style={{ width: 250 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={showAddPromptModal}
          >
            Add Prompt
          </Button>
        </Space>
   
      
      }
    >
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={searchValue.trim() ? filteredPrompts : prompts}
          rowKey="id"
        //   pagination={{
        //     pageSize: 10,
        //     showSizeChanger: true,
        //     // showTotal: (total) => `Total ${total} prompts`,
        //   }}
        />
      </div>

      {/* View Prompt Modal */}
      <Modal
        title="Prompt Details"
        open={isViewModalOpen}
        onCancel={closePromptProfile}
        footer={[
          <Button key="close" type="primary" onClick={closePromptProfile}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedPrompt && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Prompt">
              <strong>{selectedPrompt.text}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(selectedPrompt.createdAt).format("DD MMM YYYY, hh:mm A")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Add Prompt Modal */}
      <Modal
        title="Add New Prompt"
        open={isAddModalOpen}
        onCancel={hideAddPromptModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={addPrompt}
          requiredMark
        >
          <Form.Item
            label="Prompt"
            name="text"
            rules={[
              { required: true, message: "Please enter a prompt!" },
              { min: 3, message: "Prompt must be at least 3 characters!" }
            ]}
          >
            <Input.TextArea 
              placeholder="Enter your prompt" 
              rows={4}
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={hideAddPromptModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Add Prompt
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Prompt Modal */}
      <Modal
        title="Edit Prompt"
        open={isEditModalOpen}
        onCancel={hideEditPromptModal}
        footer={null}
        destroyOnClose
      >
        {selectedPrompt && (
          <Form
            form={form}
            layout="vertical"
            onFinish={editPrompt}
            requiredMark
          >
            <Form.Item
              label="Prompt"
              name="text"
              rules={[
                { required: true, message: "Please enter a prompt!" },
                { min: 3, message: "Prompt must be at least 3 characters!" }
              ]}
            >
              <Input.TextArea 
                placeholder="Enter your prompt" 
                rows={4}
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button onClick={hideEditPromptModal}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Update Prompt
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Card>
  );
};

export default PromptManagement;