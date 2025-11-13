import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '../auth/FetchInterceptor';

/**
 * Fetch all courses
 */
export const fetchAllCourses = createAsyncThunk(
  'course/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📚 Fetching all courses from:', `/api/admin/course/getallcourses`);

      const response = await axiosConfig.get(`/api/admin/course/getallcourses`);

      console.log('✅ Courses fetched successfully:', response);

      // Handle different response structures - axiosConfig returns response.data already
      const courses = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.courses)
        ? response.courses
        : Array.isArray(response)
        ? response
        : [];

      // Transform courses data
      const transformedCourses = courses.map((course) => {
        console.log('🔍 Raw course from backend:', {
          _id: course?._id,
          name: course?.name,
          url: course?.url,
          video: course?.video,
          videoUrl: course?.videoUrl,
          videoURL: course?.videoURL,
        });

        return {
          id: course?._id || course?.id,
          name: course?.name,
          subtitle: course?.subtitle,
          description: course?.description,
          subdescription: course?.subdescription,
          pro_tip: course?.pro_tip,
          nextstop: course?.nextstop,
          category: course?.category,
          difficulty: course?.difficulty,
          estimatedDuration: course?.estimatedDuration,
          rankNumber: course?.rankNumber,
          instructor: course?.instructor,
          steps: course?.steps || [],
          thumbnail: course?.thumbnail,
          url: course?.url || course?.video || course?.videoUrl || course?.videoURL, // Check all possible fields
          video: course?.url || course?.video || course?.videoUrl || course?.videoURL, // Backwards compatibility
          isActive: course?.isActive !== false && course?.status !== 'deactivated',
          createdAt: course?.createdAt,
          updatedAt: course?.updatedAt,
        };
      });

      console.log('📊 Transformed courses:', transformedCourses);
      return transformedCourses;
    } catch (error) {
      console.error('❌ Error fetching courses:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

/**
 * Fetch single course by ID
 */
export const getCourseById = createAsyncThunk(
  'course/getById',
  async (courseId, { rejectWithValue }) => {
    try {
      console.log('📚 Fetching course:', courseId);

      const response = await axiosConfig.get(`/api/admin/course/getbyid/${courseId}`);

      console.log('✅ Course fetched successfully:', response);

      const course = response?.data || response?.course || response;

      const transformedCourse = {
        id: course?._id || course?.id,
        name: course?.name,
        subtitle: course?.subtitle,
        description: course?.description,
        subdescription: course?.subdescription,
        pro_tip: course?.pro_tip,
        nextstop: course?.nextstop,
        category: course?.category,
        difficulty: course?.difficulty,
        estimatedDuration: course?.estimatedDuration,
        instructor: course?.instructor,
        steps: course?.steps || [],
        thumbnail: course?.thumbnail,
        url: course?.url || course?.video,
        video: course?.url || course?.video,
        isActive: course?.isActive !== false,
        createdAt: course?.createdAt,
        updatedAt: course?.updatedAt,
      };

      return transformedCourse;
    } catch (error) {
      console.error('❌ Error fetching course:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch course');
    }
  }
);

/**
 * Create new course
 */
export const createCourse = createAsyncThunk(
  'course/create',
  async (courseData, { rejectWithValue }) => {
    try {
      console.log('📝 Creating course with data:', courseData);

      const payload = {
        name: courseData.name,
        subtitle: courseData.subtitle,
        url: courseData.url || courseData.video || '', // Video URL goes in url field
        description: courseData.description,
        subdescription: courseData.subdescription,
        pro_tip: courseData.pro_tip,
        nextstop: courseData.nextstop || '',
        category: courseData.category,
        difficulty: courseData.difficulty,
        estimatedDuration: courseData.estimatedDuration,
        rankNumber: courseData.rankNumber || 1,
        steps: courseData.steps || [],
        thumbnail: courseData.thumbnail,
        isActive: courseData.isActive !== false,
      };

      console.log('📤 Sending payload:', payload);
      console.log('📤 nextstop value:', payload.nextstop);

      // const response = await axiosConfig.post(`/api/admin/course/create`, payload);
      const response = await axiosConfig.post(`/api/courses/admin/create`, payload);

      console.log('✅ Course created successfully:', response);

      const newCourse = response?.data || response?.course || response;

      const transformedCourse = {
        id: newCourse?._id || newCourse?.id,
        name: newCourse?.name,
        description: newCourse?.description,
        category: newCourse?.category,
        difficulty: newCourse?.difficulty,
        estimatedDuration: newCourse?.estimatedDuration,
        rankNumber: newCourse?.rankNumber,
        instructor: newCourse?.instructor,
        steps: newCourse?.steps || [],
        thumbnail: newCourse?.thumbnail,
        url: newCourse?.url || newCourse?.video, // Video URL from backend
        video: newCourse?.url || newCourse?.video, // Backwards compatibility
        isActive: newCourse?.isActive !== false,
        createdAt: newCourse?.createdAt,
        updatedAt: newCourse?.updatedAt,
      };

      return transformedCourse;
    } catch (error) {
      console.error('❌ Error creating course:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to create course');
    }
  }
);

/**
 * Update existing course
 */
export const updateCourse = createAsyncThunk(
  'course/update',
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      console.log('✏️ Updating course:', courseId, courseData);

      const payload = {
        name: courseData.name,
        subtitle: courseData.subtitle,
        url: courseData.url || courseData.video || '', // Video URL goes in url field
        description: courseData.description,
        subdescription: courseData.subdescription,
        pro_tip: courseData.pro_tip,
        nextstop: courseData.nextstop || '',
        category: courseData.category,
        difficulty: courseData.difficulty,
        estimatedDuration: courseData.estimatedDuration,
        rankNumber: courseData.rankNumber || 1,
        steps: courseData.steps || [],
        thumbnail: courseData.thumbnail,
        isActive: courseData.isActive !== false,
      };

      console.log('📤 Update payload:', payload);
      console.log('📤 nextstop value:', payload.nextstop);

      const response = await axiosConfig.put(
        `/api/admin/course/update/${courseId}`,
        payload
      );

      console.log('✅ Course updated successfully:', response);

      // Merge response with original data to preserve all fields
      const updatedCourse = response?.data || response?.course || response;

      const transformedCourse = {
        ...courseData,
        id: updatedCourse?._id || updatedCourse?.id || courseId,
        name: updatedCourse?.name || courseData.name,
        description: updatedCourse?.description || courseData.description,
        category: updatedCourse?.category || courseData.category,
        difficulty: updatedCourse?.difficulty || courseData.difficulty,
        estimatedDuration: updatedCourse?.estimatedDuration || courseData.estimatedDuration,
        rankNumber: updatedCourse?.rankNumber || courseData.rankNumber,
        instructor: updatedCourse?.instructor || courseData.instructor,
        steps: updatedCourse?.steps || courseData.steps || [],
        thumbnail: updatedCourse?.thumbnail || courseData.thumbnail,
        url: updatedCourse?.url || updatedCourse?.video || courseData.video, // Video URL
        video: updatedCourse?.url || updatedCourse?.video || courseData.video, // Backwards compatibility
        isActive: updatedCourse?.isActive !== false,
        updatedAt: updatedCourse?.updatedAt,
      };

      return transformedCourse;
    } catch (error) {
      console.error('❌ Error updating course:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to update course');
    }
  }
);

/**
 * Delete course (backend deactivates)
 */
export const deleteCourse = createAsyncThunk(
  'course/delete',
  async (courseId, { rejectWithValue }) => {
    try {
      console.log('🗑️ Deleting course:', courseId);

      const response = await axiosConfig.delete(`/api/admin/course/delete/${courseId}`);

      console.log('✅ Course deleted successfully:', response);
      console.log('📋 Response message:', response?.message);
      console.log('🔍 Deleted course data:', response?.data || response?.course);

      return courseId;
    } catch (error) {
      console.error('❌ Error deleting course:', error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete course');
    }
  }
);
