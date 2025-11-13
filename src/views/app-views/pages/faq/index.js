import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Switch,
  Checkbox,
  Space,
  Row,
  Col,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  EditOutlined,
  SearchOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { 
  fetchQuestions, 
  addQuestion as addQuestionThunk, 
  updateQuestion as updateQuestionThunk, 
  deleteQuestion as deleteQuestionThunk 
} from "services/questionService";

const { Option } = Select;
const { TextArea } = Input;

const QuestionManagement = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { items: reduxQuestions = [], loading: reduxLoading } = useSelector(
    (state) => state.questions || { items: [], loading: false }
  );

  // Local state
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [questionProfileVisible, setQuestionProfileVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [addQuestionModalVisible, setAddQuestionModalVisible] = useState(false);
  const [editQuestionModalVisible, setEditQuestionModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Checklist options state
  const [checklistOptions, setChecklistOptions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);

  const [addQuestionForm] = Form.useForm();
  const [editQuestionForm] = Form.useForm();

  // Fetch questions from API on component mount
  useEffect(() => {
    setLoading(true);
    dispatch(fetchQuestions())
      .unwrap()
      .then((data) => {
        console.log("API data received:", data);
        // Map API response to match component structure
        const mappedData = Array.isArray(data)
          ? data.map((q) => ({
              id: q._id || q.id,
              question: q.question || q.title,
              type: q.answerType || q.type || "text",
              placeholder: q.placeholder || "",
              category: q.category || "Other",
              isRequired: q.required || false,
              isActive: q.status === "active" || q.isActive !== false,
              order: q.order || 1,
              options: q.options || [],
              checklistOptions: q.checklistOptions || [],
            }))
          : [];
        setQuestions(mappedData);
        setAvailableQuestions(mappedData); // Store for checklist reference
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch questions:", error);
        setQuestions([]);
        setLoading(false);
        message.error("Failed to load questions. Please refresh the page.");
      });
  }, [dispatch]);

  // Filter questions whenever questions, search, or category changes
  useEffect(() => {
    filterQuestions();
  }, [questions, searchValue, categoryFilter]);

  const filterQuestions = () => {
    let filtered = questions;

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((q) => q.category === categoryFilter);
    }

    // Search filter
    if (searchValue.trim()) {
      filtered = filtered.filter((q) =>
        q.question.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Sort by order
    filtered.sort((a, b) => a.order - b.order);

    setFilteredQuestions(filtered);
  };

  const onSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const onCategoryFilterChange = (value) => {
    setCategoryFilter(value);
  };

  const showAddQuestionModal = () => {
    setAddQuestionModalVisible(true);
    setChecklistOptions([]);
  };

  const hideAddQuestionModal = () => {
    setAddQuestionModalVisible(false);
    addQuestionForm.resetFields();
    setChecklistOptions([]);
  };

  const showEditQuestionModal = (question) => {
    setEditQuestionModalVisible(true);
    setEditingQuestion(question);
    setChecklistOptions(question.checklistOptions || []);
    setTimeout(() => {
      editQuestionForm.setFieldsValue({
        question: question.question,
        type: question.type,
        placeholder: question.placeholder,
        category: question.category,
        isRequired: question.isRequired,
        isActive: question.isActive,
        order: question.order,
      });
    }, 100);
  };

  const hideEditQuestionModal = () => {
    setEditQuestionModalVisible(false);
    setEditingQuestion(null);
    editQuestionForm.resetFields();
    setChecklistOptions([]);
  };

  const addQuestion = (values) => {
    // Validate checklist options if type is checklist
    if (values.type === "checklist") {
      if (!checklistOptions || checklistOptions.length === 0) {
        message.error("Please add at least one checklist option for checklist type questions.");
        return;
      }
      
      const invalidOptions = checklistOptions.filter(option => !option.question || option.question.trim() === "");
      if (invalidOptions.length > 0) {
        message.error("Please enter question text for all checklist options.");
        return;
      }
    }

    setLoading(true);
    
    // Prepare API payload with correct field names
    const payload = {
      question: values.question,
      answerType: values.type, // Map 'type' to 'answerType'
      required: values.isRequired || false, // Map 'isRequired' to 'required'
      status: values.isActive !== undefined ? (values.isActive ? "active" : "inactive") : "active", // Map 'isActive' to 'status'
      order: values.order || questions.length + 1,
      placeholder: values.placeholder || "",
      category: values.category || "",
      options: values.options || [],
      checklistOptions: values.type === "checklist" ? checklistOptions : [],
    };

    console.log("Sending payload to API:", payload);

    dispatch(addQuestionThunk(payload))
      .unwrap()
      .then((response) => {
        console.log("Question added response:", response);
        
        // Map response back to component structure
        const newQuestion = {
          id: response._id || response.id || questions.length + 1,
          question: response.question || values.question,
          type: response.answerType || response.type || values.type,
          placeholder: response.placeholder || values.placeholder || "",
          category: response.category || values.category || "",
          isRequired: response.required || values.isRequired || false,
          isActive: response.status === "active" || response.isActive !== false,
          order: response.order || values.order,
          options: response.options || values.options || [],
          checklistOptions: response.checklistOptions || checklistOptions || [],
        };

        setQuestions([...questions, newQuestion]);
        setAvailableQuestions([...questions, newQuestion]);
        setAddQuestionModalVisible(false);
        addQuestionForm.resetFields();
        setChecklistOptions([]);
        setLoading(false);
        message.success("Question added successfully!");
      })
      .catch((error) => {
        console.error("Failed to add question:", error);
        setAddQuestionModalVisible(false);
        addQuestionForm.resetFields();
        setChecklistOptions([]);
        setLoading(false);
        message.error("Failed to add question. Please try again.");
      });
  };

  const editQuestion = (values) => {
    // Validate checklist options if type is checklist
    if (values.type === "checklist") {
      if (!checklistOptions || checklistOptions.length === 0) {
        message.error("Please add at least one checklist option for checklist type questions.");
        return;
      }
      
      const invalidOptions = checklistOptions.filter(option => !option.question || option.question.trim() === "");
      if (invalidOptions.length > 0) {
        message.error("Please enter question text for all checklist options.");
        return;
      }
    }

    setLoading(true);

    // Prepare API payload with correct field names
    const payload = {
      id: editingQuestion.id,
      question: values.question,
      answerType: values.type, // Map 'type' to 'answerType'
      required: values.isRequired, // Map 'isRequired' to 'required'
      status: values.isActive ? "active" : "inactive", // Map 'isActive' to 'status'
      order: values.order,
      placeholder: values.placeholder || "",
      category: values.category || "",
      options: values.options || [],
      checklistOptions: values.type === "checklist" ? checklistOptions : [],
    };

    console.log("Sending update payload to API:", payload);

    dispatch(updateQuestionThunk(payload))
      .unwrap()
      .then((response) => {
        console.log("Question updated response:", response);

        const updatedQuestions = questions.map((q) =>
          q.id === editingQuestion.id
            ? {
                id: response._id || response.id || q.id,
                question: response.question || values.question,
                type: response.answerType || response.type || values.type,
                placeholder: response.placeholder || values.placeholder || "",
                category: response.category || values.category || "",
                isRequired: response.required || values.isRequired,
                isActive: response.status === "active" || values.isActive !== false,
                order: response.order || values.order,
                options: response.options || values.options || [],
                checklistOptions: response.checklistOptions || checklistOptions || [],
              }
            : q
        );

        setQuestions(updatedQuestions);
        setAvailableQuestions(updatedQuestions);
        setEditQuestionModalVisible(false);
        setEditingQuestion(null);
        editQuestionForm.resetFields();
        setChecklistOptions([]);
        setLoading(false);
        message.success("Question updated successfully!");
      })
      .catch((error) => {
        console.error("Failed to update question:", error);
        setEditQuestionModalVisible(false);
        setEditingQuestion(null);
        editQuestionForm.resetFields();
        setChecklistOptions([]);
        setLoading(false);
        message.error("Failed to update question. Please try again.");
      });
  };

  const handleDeleteQuestion = (questionId) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to delete this question?",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        setLoading(true);

        dispatch(deleteQuestionThunk(questionId))
          .unwrap()
          .then((response) => {
            console.log("Question deleted:", response);
            setQuestions(questions.filter((q) => q.id !== questionId));
            setLoading(false);
            message.success("Question deleted successfully!");
          })
          .catch((error) => {
            console.error("Failed to delete question:", error);
            setLoading(false);
            message.error("Failed to delete question. Please try again.");
          });
      },
    });
  };

  const showQuestionProfile = (questionInfo) => {
    setQuestionProfileVisible(true);
    setSelectedQuestion(questionInfo);
  };

  const closeQuestionProfile = () => {
    setQuestionProfileVisible(false);
    setSelectedQuestion(null);
  };

  // Checklist helper functions
  const addChecklistOption = () => {
    setChecklistOptions([...checklistOptions, { question: "" }]);
  };

  const removeChecklistOption = (index) => {
    const newOptions = checklistOptions.filter((_, i) => i !== index);
    setChecklistOptions(newOptions);
  };

  const updateChecklistOption = (index, field, value) => {
    const newOptions = [...checklistOptions];
    newOptions[index][field] = value;
    setChecklistOptions(newOptions);
  };

  // Get unique categories
  const categories = [...new Set(questions.map((q) => q.category))];

  const tableColumns = [
    {
      title: "Order",
      dataIndex: "order",
      width: 80,
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: "Question",
      dataIndex: "question",
      render: (question) => (
        <div style={{ maxWidth: 400 }}>
          <div style={{ fontWeight: 500, fontSize: "14px" }}>{question}</div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
      filters: categories.map((cat) => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => <Tag color="cyan">{type}</Tag>,
    },
    {
      title: "Required",
      dataIndex: "isRequired",
      render: (isRequired) => (
        <Tag color={isRequired ? "red" : "default"}>
          {isRequired ? "Required" : "Optional"}
        </Tag>
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
              onClick={() => showQuestionProfile(elm)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="default"
              className="mr-2"
              icon={<EditOutlined />}
              onClick={() => showEditQuestionModal(elm)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteQuestion(elm.id)}
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
      title="Question Management"
      extra={
               <div className="mb-4" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
          <Select
            style={{ width: 100 }}
            value={categoryFilter}
            onChange={onCategoryFilterChange}
          >
            <Option value="all">All Categories</Option>
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
          <Input
            placeholder="Search questions..."
            prefix={<SearchOutlined />}
            onChange={onSearch}
            value={searchValue}
            style={{ width: 150 }}
          />
          </div>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={showAddQuestionModal}
          >
            Add Question
          </Button>
        </div>
      }
    >
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={filteredQuestions}
          rowKey="id"
          loading={loading}
        />
      </div>

      {/* View Question Modal */}
      <Modal
        title="Question Details"
        open={questionProfileVisible}
        onCancel={closeQuestionProfile}
        footer={[
          <Button key="close" onClick={closeQuestionProfile}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedQuestion && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Question">
                <strong>{selectedQuestion.question}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Order">
                {selectedQuestion.order}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                <Tag color="blue">{selectedQuestion.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Input Type">
                <Tag color="cyan">{selectedQuestion.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Placeholder">
                {selectedQuestion.placeholder}
              </Descriptions.Item>
              <Descriptions.Item label="Required">
                <Tag color={selectedQuestion.isRequired ? "red" : "default"}>
                  {selectedQuestion.isRequired ? "Required" : "Optional"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedQuestion.isActive ? "green" : "red"}>
                  {selectedQuestion.isActive ? "Active" : "Inactive"}
                </Tag>
              </Descriptions.Item>
              {selectedQuestion.type === "checklist" && selectedQuestion.checklistOptions?.length > 0 && (
                <Descriptions.Item label="Checklist Options">
                  <div>
                    {selectedQuestion.checklistOptions.map((option, index) => {
                      return (
                        <div key={index} style={{ 
                          padding: '8px 12px', 
                          marginBottom: '8px', 
                          border: '1px solid #f0f0f0',
                          borderRadius: '4px',
                          backgroundColor: '#fff'
                        }}>
                          <div style={{ fontWeight: 500 }}>
                            {option.question || 'No question text provided'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Preview */}
            <div style={{ marginTop: 24 }}>
              <h4>Preview:</h4>
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  padding: 16,
                  borderRadius: 8,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <div style={{ marginBottom: 8, fontWeight: 500 }}>
                  {selectedQuestion.question}
                </div>
                {selectedQuestion.type === "checklist" ? (
                  <div>
                    {selectedQuestion.checklistOptions?.map((option, index) => {
                      return (
                        <div key={index} style={{ marginBottom: 8 }}>
                          <Checkbox disabled>
                            {option.question || 'No question text provided'}
                          </Checkbox>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <TextArea
                    rows={4}
                    placeholder={selectedQuestion.placeholder}
                    disabled
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Question Modal */}
      <Modal
        title="Add New Question"
        open={addQuestionModalVisible}
        onCancel={hideAddQuestionModal}
        footer={null}
        destroyOnClose={true}
        width={700}
      >
        <Form
          form={addQuestionForm}
          layout="vertical"
          onFinish={addQuestion}
          requiredMark={false}
          initialValues={{
            type: "textarea",
            isRequired: false,
            isActive: true,
            order: questions.length + 1,
          }}
        >
          <Form.Item
            label="Question Text"
            name="question"
            rules={[
              { required: true, message: "Please enter question text!" },
              { min: 10, message: "Question must be at least 10 characters!" },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="What is your current strategy with maintaining your peace..."
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select category!" }]}
          >
            <Select placeholder="Select category">
              <Option value="Mental Health">Mental Health</Option>
              <Option value="Lifestyle">Lifestyle</Option>
              <Option value="Personal">Personal</Option>
              <Option value="Work">Work</Option>
              <Option value="Goals">Goals</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Input Type"
            name="type"
            rules={[{ required: true, message: "Please select input type!" }]}
          >
            <Select placeholder="Select input type">
              <Option value="textarea">Textarea</Option>
              <Option value="text">Text Input</Option>
              <Option value="number">Number</Option>
              <Option value="checklist">Checklist</Option>
            </Select>
          </Form.Item>

          <Form.Item dependencies={['type']}>
            {({ getFieldValue }) => {
              const selectedType = getFieldValue('type');
              return selectedType === 'checklist' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <label style={{ fontWeight: 500 }}>Checklist Options</label>
                    <Button 
                      type="dashed" 
                      icon={<PlusCircleOutlined />} 
                      onClick={addChecklistOption}
                    >
                      Add Option
                    </Button>
                  </div>
                  {checklistOptions.map((option, index) => (
                    <Row key={index} gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
                      <Col span={20}>
                        <Input
                          placeholder="Enter question text"
                          value={option.question}
                          onChange={(e) => updateChecklistOption(index, 'question', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col span={4}>
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => removeChecklistOption(index)}
                        />
                      </Col>
                    </Row>
                  ))}
                  {checklistOptions.length === 0 && (
                    <div style={{ 
                      padding: 20, 
                      textAlign: 'center', 
                      color: '#999', 
                      border: '1px dashed #d9d9d9',
                      borderRadius: 4 
                    }}>
                      No checklist options added yet. Click "Add Option" to start.
                    </div>
                  )}
                </div>
              ) : null;
            }}
          </Form.Item>

          <Form.Item
            label="Placeholder Text"
            name="placeholder"
            rules={[
              { required: true, message: "Please enter placeholder text!" },
            ]}
          >
            <Input placeholder="Enter here..." />
          </Form.Item>

          <Form.Item
            label="Display Order"
            name="order"
            rules={[{ required: true, message: "Please enter order!" }]}
          >
            <Input type="number" placeholder="1" />
          </Form.Item>

          <Form.Item label="Required Field" name="isRequired" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Active Status" name="isActive" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Button className="mr-2" onClick={hideAddQuestionModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Question
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Question Modal */}
      <Modal
        title="Edit Question"
        open={editQuestionModalVisible}
        onCancel={hideEditQuestionModal}
        footer={null}
        destroyOnClose={true}
        width={700}
      >
        {editingQuestion && (
          <Form
            form={editQuestionForm}
            layout="vertical"
            onFinish={editQuestion}
            requiredMark={false}
          >
            <Form.Item
              label="Question Text"
              name="question"
              rules={[
                { required: true, message: "Please enter question text!" },
                { min: 10, message: "Question must be at least 10 characters!" },
              ]}
            >
              <TextArea rows={3} placeholder="Enter question text" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select placeholder="Select category">
                <Option value="Mental Health">Mental Health</Option>
                <Option value="Lifestyle">Lifestyle</Option>
                <Option value="Personal">Personal</Option>
                <Option value="Work">Work</Option>
                <Option value="Goals">Goals</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Input Type"
              name="type"
              rules={[{ required: true, message: "Please select input type!" }]}
            >
              <Select placeholder="Select input type">
                <Option value="textarea">Textarea</Option>
                <Option value="text">Text Input</Option>
                <Option value="number">Number</Option>
                <Option value="checklist">Checklist</Option>
              </Select>
            </Form.Item>

            <Form.Item dependencies={['type']}>
              {({ getFieldValue }) => {
                const selectedType = getFieldValue('type');
                return selectedType === 'checklist' ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <label style={{ fontWeight: 500 }}>Checklist Options</label>
                      <Button 
                        type="dashed" 
                        icon={<PlusCircleOutlined />} 
                        onClick={addChecklistOption}
                      >
                        Add Option
                      </Button>
                    </div>
                    {checklistOptions.map((option, index) => (
                      <Row key={index} gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
                        <Col span={20}>
                          <Input
                            placeholder="Enter question text"
                            value={option.question}
                            onChange={(e) => updateChecklistOption(index, 'question', e.target.value)}
                            style={{ width: '100%' }}
                          />
                        </Col>
                        <Col span={4}>
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => removeChecklistOption(index)}
                          />
                        </Col>
                      </Row>
                    ))}
                    {checklistOptions.length === 0 && (
                      <div style={{ 
                        padding: 20, 
                        textAlign: 'center', 
                        color: '#999', 
                        border: '1px dashed #d9d9d9',
                        borderRadius: 4 
                      }}>
                        No checklist options added yet. Click "Add Option" to start.
                      </div>
                    )}
                  </div>
                ) : null;
              }}
            </Form.Item>

            <Form.Item
              label="Placeholder Text"
              name="placeholder"
              rules={[
                { required: true, message: "Please enter placeholder text!" },
              ]}
            >
              <Input placeholder="Enter here..." />
            </Form.Item>

            <Form.Item
              label="Display Order"
              name="order"
              rules={[{ required: true, message: "Please enter order!" }]}
            >
              <Input type="number" placeholder="1" />
            </Form.Item>

            <Form.Item label="Required Field" name="isRequired" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Active Status" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item className="text-right mb-0">
              <Button className="mr-2" onClick={hideEditQuestionModal}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Question
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Card>
  );
};

export default QuestionManagement;