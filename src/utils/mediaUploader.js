import axiosConfig from '../auth/FetchInterceptor';

/**
 * Uploads image or video to Cloudinary via backend and returns its URL.
 * @param {File} file - File object from browser upload
 * @param {function} setLoading - Optional loading setter
 * @param {boolean} isIcon - Whether file is an icon
 * @returns {Promise<string>}
 */
export const imageUploader = async (
  file,
  setLoading = () => {},
  isIcon = false
) => {
  try {
    console.log('📤 Uploading file:', file.name);
    console.log('📋 File size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('📋 File type:', file.type);
    setLoading(true);

    if (!file) {
      throw new Error('No file selected for upload.');
    }

    // Determine file type
    const isVideo = file.type.includes('video');
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    console.log('📡 Uploading to: /api/public/upload');
    console.log('📋 Media type:', isVideo ? 'video' : 'image');
    console.log('📋 isIcon param:', isIcon);

    const response = await axiosConfig.post(
      '/api/public/upload',
      formData,
      {
        params: {
          isicon: isIcon,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('✅ Upload response:', response);

    // FetchInterceptor already returns response.data
    const mediaUrl = response?.url || response?.data?.url;
    if (!mediaUrl) {
      console.error('❌ No URL in response:', response);
      throw new Error('Upload failed: No URL returned from server');
    }

    console.log('🎉 Media uploaded successfully:', mediaUrl);
    return mediaUrl;
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    console.error('❌ Full error:', error.response?.data || error);
    throw error;
  } finally {
    setLoading(false);
  }
};

export default imageUploader;
