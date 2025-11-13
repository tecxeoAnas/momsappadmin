// import React, { useState, useEffect } from 'react'
// import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
// import { Tabs, Form, Button, message } from 'antd';
// import Flex from 'components/shared-components/Flex'
// import GeneralField from './GeneralField'
// import VariationField from './VariationField'
// import ShippingField from './ShippingField'
// import ProductListData from "assets/data/product-list.data.json"

// const getBase64 = (img, callback) => {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

// const ADD = 'ADD'
// const EDIT = 'EDIT'

// const ProductForm = props => {

// 	const { mode = ADD, param } = props

// 	const [form] = Form.useForm();
// 	const [uploadedImg, setImage] = useState('')
// 	const [uploadLoading, setUploadLoading] = useState(false)
// 	const [submitLoading, setSubmitLoading] = useState(false)

// 	useEffect(() => {
//     	if(mode === EDIT) {
// 			console.log('is edit')
// 			console.log('props', props)
// 			const { id } = param
// 			const produtId = parseInt(id)
// 			const productData = ProductListData.filter( product => product.id === produtId)
// 			const product = productData[0]
// 			form.setFieldsValue({
// 				comparePrice: 0.00,
// 				cost: 0.00,
// 				taxRate: 6,
// 				description: 'There are many variations of passages of Lorem Ipsum available.',
// 				category: product.category,
// 				name: product.name,
// 				price: product.price
// 			});
// 			setImage(product.image)
// 		}
//   	}, [form, mode, param, props]);

// 	const handleUploadChange = info => {
// 		if (info.file.status === 'uploading') {
// 			setUploadLoading(true)
// 			return;
// 		}
// 		if (info.file.status === 'done') {
// 			getBase64(info.file.originFileObj, imageUrl =>{
// 				setImage(imageUrl)
// 				setUploadLoading(true)
// 			});
// 		}
// 	};

// 	const onFinish = () => {
// 		setSubmitLoading(true)
// 		form.validateFields().then(values => {
// 			setTimeout(() => {
// 				setSubmitLoading(false)
// 				if(mode === ADD) {
// 					message.success(`Created ${values.name} to product list`);
// 				}
// 				if(mode === EDIT) {
// 					message.success(`Product saved`);
// 				}
// 			}, 1500);
// 		}).catch(info => {
// 			setSubmitLoading(false)
// 			console.log('info', info)
// 			message.error('Please enter all required field ');
// 		});
// 	};

// 	return (
// 		<>
// 			<Form
// 				layout="vertical"
// 				form={form}
// 				name="advanced_search"
// 				className="ant-advanced-search-form"
// 				initialValues={{
// 					heightUnit: 'cm',
// 					widthUnit: 'cm',
// 					weightUnit: 'kg'
// 				}}
// 			>
// 				<PageHeaderAlt className="border-bottom" overlap>
// 					<div className="container">
// 						<Flex className="py-2" mobileFlex={false} justifyContent="space-between" alignItems="center">
// 							<h2 className="mb-3">{mode === 'ADD'? 'Add New Product' : `Edit Product`} </h2>
// 							<div className="mb-3">
// 								<Button className="mr-2">Discard</Button>
// 								<Button type="primary" onClick={() => onFinish()} htmlType="submit" loading={submitLoading} >
// 									{mode === 'ADD'? 'Add' : `Save`}
// 								</Button>
// 							</div>
// 						</Flex>
// 					</div>
// 				</PageHeaderAlt>
// 				<div className="container">
// 					<Tabs 
// 						defaultActiveKey="1" 
// 						style={{marginTop: 30}}
// 						items={[
// 							{
// 								label: 'General',
// 								key: '1',
// 								children: <GeneralField 
// 									uploadedImg={uploadedImg} 
// 									uploadLoading={uploadLoading} 
// 									handleUploadChange={handleUploadChange}
// 								/>,
// 							},
// 							{
// 								label: 'Variation',
// 								key: '2',
// 								children: <VariationField />,
// 							},
// 							{
// 								label: 'Shipping',
// 								key: '3',
// 								children: <ShippingField />,
// 							},
// 						]}
// 					/>
// 				</div>
// 			</Form>
// 		</>
// 	)
// }

// export default ProductForm
import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Form, Button, message, Card, Input, Select, Upload, Row, Col, Switch, Progress } from 'antd';
import { UploadOutlined, InboxOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

// Sample clips data for editing
const clipsData = [
    {
        id: 1,
        title: "Sample Video Clip 1",
        description: "This is a sample video clip description",
        thumbnail: "/img/others/img-1.jpg",
        videoUrl: "/videos/sample1.mp4",
        category: "Entertainment",
        status: "published",
        tags: ["entertainment", "funny"],
        featured: true
    },
    {
        id: 2,
        title: "Sample Video Clip 2", 
        description: "Another sample video clip with different content",
        thumbnail: "/img/others/img-2.jpg",
        videoUrl: "/videos/sample2.mp4",
        category: "Educational",
        status: "draft",
        tags: ["education", "learning"],
        featured: false
    }
];

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

const ADD = 'ADD'
const EDIT = 'EDIT'

const categories = ['Entertainment', 'Educational', 'Sports', 'News', 'Comedy', 'Music']

const ProductForm = ({ mode = ADD }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    
    const [submitLoading, setSubmitLoading] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if(mode === EDIT && id) {
            const clipId = parseInt(id);
            const clipData = clipsData.find(clip => clip.id === clipId);
            
            if(clipData) {
                form.setFieldsValue({
                    title: clipData.title,
                    description: clipData.description,
                    category: clipData.category,
                    status: clipData.status,
                    tags: clipData.tags?.join(', '),
                    featured: clipData.featured
                });
                setThumbnailPreview(clipData.thumbnail);
                setVideoPreview(clipData.videoUrl);
            }
        } else {
            // Set default values for add mode
            form.setFieldsValue({
                status: 'draft',
                featured: false,
                category: 'Entertainment'
            });
        }
    }, [form, mode, id]);

    const simulateUploadProgress = (callback) => {
        setIsUploading(true);
        setUploadProgress(0);
        
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    callback();
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleVideoUpload = async (file) => {
        try {
            simulateUploadProgress(async () => {
                const videoUrl = await getBase64(file);
                setVideoFile(file);
                setVideoPreview(videoUrl);
                message.success(`Video "${file.name}" uploaded successfully!`);
            });
        } catch (error) {
            message.error('Failed to upload video');
            console.error('Video upload error:', error);
            setIsUploading(false);
        }
        return false; // Prevent default upload
    };

    const handleThumbnailUpload = async (file) => {
        try {
            const thumbnailUrl = await getBase64(file);
            setThumbnailFile(file);
            setThumbnailPreview(thumbnailUrl);
            message.success(`Thumbnail "${file.name}" uploaded successfully!`);
        } catch (error) {
            message.error('Failed to upload thumbnail');
            console.error('Thumbnail upload error:', error);
        }
        return false; // Prevent default upload
    };

    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreview('');
        setUploadProgress(0);
        message.info('Video removed');
    };

    const removeThumbnail = () => {
        setThumbnailFile(null);
        setThumbnailPreview('');
        message.info('Thumbnail removed');
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (file) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function() {
                window.URL.revokeObjectURL(video.src);
                const duration = video.duration;
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60);
                resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            };
            video.src = URL.createObjectURL(file);
        });
    };

    const onFinish = (values) => {
        setSubmitLoading(true);
        
        // Validate required files for add mode
        if (mode === ADD && !videoFile) {
            message.error('Please upload a video file');
            setSubmitLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setSubmitLoading(false);
            if(mode === ADD) {
                message.success(`Clip "${values.title}" created successfully!`);
            } else {
                message.success(`Clip "${values.title}" updated successfully!`);
            }
            navigate('/app/clips/clips-list');
        }, 1500);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Please check all required fields');
    };

    const handleDiscard = () => {
        navigate('/app/clips-list');
    };

    const videoUploadProps = {
        name: 'video',
        multiple: false,
        accept: 'video/*',
        showUploadList: false,
        beforeUpload: (file) => {
            const isVideo = file.type.startsWith('video/');
            if (!isVideo) {
                message.error('You can only upload video files!');
                return false;
            }
            const isLt500M = file.size / 1024 / 1024 < 500; // 500MB limit
            if (!isLt500M) {
                message.error('Video must be smaller than 500MB!');
                return false;
            }
            return handleVideoUpload(file);
        },
    };

    const thumbnailUploadProps = {
        name: 'thumbnail',
        multiple: false,
        accept: 'image/*',
        showUploadList: false,
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
                return false;
            }
            const isLt10M = file.size / 1024 / 1024 < 10; // 10MB limit
            if (!isLt10M) {
                message.error('Image must be smaller than 10MB!');
                return false;
            }
            return handleThumbnailUpload(file);
        },
    };

    return (
        <>
            <Form
                layout="vertical"
                form={form}
                name="clips_form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                scrollToFirstError
            >
                <PageHeaderAlt className="border-bottom" overlap>
                    <div className="container">
                        <Flex className="py-2" mobileFlex={false} justifyContent="space-between" alignItems="center">
                            <h2 className="mb-3">
                                {mode === ADD ? 'Add New Clip' : 'Edit Clip'}
                            </h2>
                            <div className="mb-3">
                                <Button className="mr-2" onClick={handleDiscard}>
                                    Discard
                                </Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={submitLoading}
                                    disabled={isUploading}
                                >
                                    {mode === ADD ? 'Create Clip' : 'Update Clip'}
                                </Button>
                            </div>
                        </Flex>
                    </div>
                </PageHeaderAlt>

                <div className="container" style={{ marginTop: 30 }}>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={16}>
                            <Card title="Basic Information" className="mb-3">
                                <Form.Item
                                    label="Clip Title"
                                    name="title"
                                    rules={[
                                        { required: true, message: 'Please enter clip title!' },
                                        { min: 3, message: 'Title must be at least 3 characters!' }
                                    ]}
                                >
                                    <Input placeholder="Enter clip title" size="large" />
                                </Form.Item>

                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[
                                        { required: true, message: 'Please enter description!' },
                                        { min: 10, message: 'Description must be at least 10 characters!' }
                                    ]}
                                >
                                    <TextArea 
                                        rows={4} 
                                        placeholder="Enter detailed description of the clip"
                                    />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Category"
                                            name="category"
                                            rules={[{ required: true, message: 'Please select category!' }]}
                                        >
                                            <Select size="large" placeholder="Select category">
                                                {categories.map(category => (
                                                    <Option key={category} value={category}>
                                                        {category}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Status"
                                            name="status"
                                            rules={[{ required: true, message: 'Please select status!' }]}
                                        >
                                            <Select size="large" placeholder="Select status">
                                                <Option value="draft">Draft</Option>
                                                <Option value="published">Published</Option>
                                                <Option value="archived">Archived</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label="Tags"
                                    name="tags"
                                    help="Separate tags with commas (e.g., funny, entertainment, viral)"
                                >
                                    <Input placeholder="Enter tags separated by commas" />
                                </Form.Item>

                                <Form.Item
                                    name="featured"
                                    valuePropName="checked"
                                >
                                    <Switch /> <span className="ml-2">Featured Clip</span>
                                </Form.Item>
                            </Card>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Card title="Media Upload" className="mb-3">
                                <Form.Item label="Video Upload" required={mode === ADD}>
                                    {!videoPreview ? (
                                        <Dragger {...videoUploadProps} disabled={isUploading}>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">
                                                {isUploading ? 'Uploading...' : 'Click or drag video to upload'}
                                            </p>
                                            <p className="ant-upload-hint">
                                                Support MP4, AVI, MOV formats (Max: 500MB)
                                            </p>
                                        </Dragger>
                                    ) : (
                                        <div className="upload-success-area" style={{ 
                                            border: '2px dashed #d9d9d9', 
                                            borderRadius: '6px', 
                                            padding: '20px', 
                                            textAlign: 'center',
                                            backgroundColor: '#f9f9f9'
                                        }}>
                                            <PlayCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '10px' }} />
                                            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Video Uploaded Successfully!</p>
                                            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>
                                                {videoFile?.name} • {formatFileSize(videoFile?.size)}
                                            </p>
                                            <Button 
                                                type="primary" 
                                                size="small" 
                                                className="mr-2"
                                                onClick={() => {
                                                    const video = document.createElement('video');
                                                    video.src = videoPreview;
                                                    video.controls = true;
                                                    video.style.width = '100%';
                                                    video.play();
                                                }}
                                            >
                                                Preview
                                            </Button>
                                            <Button 
                                                danger 
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                onClick={removeVideo}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}

                                    {isUploading && (
                                        <div className="mt-3">
                                            <Progress 
                                                percent={uploadProgress} 
                                                status={uploadProgress === 100 ? 'success' : 'active'}
                                                strokeColor={{
                                                    '0%': '#108ee9',
                                                    '100%': '#87d068',
                                                }}
                                            />
                                            <p className="text-center mt-2" style={{ fontSize: '12px', color: '#666' }}>
                                                Uploading video... {uploadProgress}%
                                            </p>
                                        </div>
                                    )}

                                    {videoPreview && (
                                        <div className="mt-3">
                                            <video 
                                                width="100%" 
                                                height="200" 
                                                controls 
                                                src={videoPreview}
                                                style={{ borderRadius: '6px', border: '1px solid #d9d9d9' }}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </Form.Item>

                                <Form.Item label="Thumbnail Upload" className="mt-4">
                                    {!thumbnailPreview ? (
                                        <Upload {...thumbnailUploadProps}>
                                            <Button icon={<UploadOutlined />} block size="large">
                                                Upload Thumbnail
                                            </Button>
                                        </Upload>
                                    ) : (
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span style={{ fontSize: '12px', color: '#666' }}>
                                                    {thumbnailFile?.name}
                                                </span>
                                                <Button 
                                                    type="text" 
                                                    danger 
                                                    size="small"
                                                    icon={<DeleteOutlined />}
                                                    onClick={removeThumbnail}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                            <img 
                                                src={thumbnailPreview} 
                                                alt="Thumbnail preview" 
                                                style={{ 
                                                    width: '100%', 
                                                    maxHeight: '150px', 
                                                    objectFit: 'cover',
                                                    borderRadius: '6px',
                                                    border: '1px solid #d9d9d9'
                                                }} 
                                            />
                                        </div>
                                    )}
                                    <div className="mt-2 text-muted" style={{ fontSize: '11px' }}>
                                        Recommended: 1280x720px, JPG/PNG (Max: 10MB)
                                    </div>
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Form>
        </>
    );
};

export default ProductForm;