import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import api from "configs/UniversityConfig";
import dayjs from "dayjs";

// ============================================
// USER THUNKS - Sab CRUD Operations
// ============================================

/**
 * Fetch all users
 * GET /api/admin/getusers
 */
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📥 Fetching all users from /api/admin/getusers...");
      const response = await api.get("/api/admin/getusers");
      
      console.log("📦 Full API Response:", response);
      console.log("📦 Response data:", response?.data);
      console.log("📦 Response data type:", typeof response?.data);
      
      let users = [];
      
      // The API returns { success: true, data: [...] } or similar
      if (response?.data?.data && Array.isArray(response.data.data)) {
        console.log("✓ Found users in response.data.data");
        users = response.data.data;
      } else if (response?.data?.users && Array.isArray(response.data.users)) {
        console.log("✓ Found users in response.data.users");
        users = response.data.users;
      } else if (Array.isArray(response?.data)) {
        console.log("✓ Found users as direct array");
        users = response.data;
      } else if (response?.data && !Array.isArray(response.data) && typeof response.data === 'object') {
        // Try to extract from any key that looks like it contains users
        console.log("⚠️ Response is an object, looking for user array inside...");
        const keys = Object.keys(response.data);
        console.log("🔍 Available keys:", keys);
        for (const key of keys) {
          if (Array.isArray(response.data[key])) {
            console.log(`✓ Found array in response.data.${key}`);
            users = response.data[key];
            break;
          }
        }
      }
      
      console.log("📋 Extracted users array:", users);
      console.log("📋 Users count:", users.length);
      
      // If we still don't have an array, return empty
      if (!Array.isArray(users)) {
        console.warn("⚠️ Could not extract users array from response!");
        console.warn("⚠️ Response data:", response?.data);
        return [];
      }
      
      // Transform data to match our format
      const transformedUsers = users.map((item) => {
        console.log("🔄 Transforming user:", item);
        return {
          id: item?._id || item?.id,
          firstname: item?.firstname || item?.first_name,
          lastname: item?.lastname || item?.last_name,
          email: item?.email,
          role: item?.role,
          phone: item?.phone || item?.phoneNumber,
          dob: item?.dob,
          location: item?.location,
          timezone: item?.timezone,
          isVerified: item?.isVerified,
          isActive: item?.isActive !== false && item?.status !== 'deactivated', // Default true if not specified
          date: item?.createdAt ? dayjs(item.createdAt).unix() : dayjs().unix(),
        };
      });
      
      console.log("✅ Users fetched and transformed successfully!");
      console.log("✅ Total users:", transformedUsers.length);
      console.log("✅ Transformed data:", transformedUsers);
      return transformedUsers;
    } catch (error) {
      console.error("❌ ERROR in fetchAllUsers!");
      console.error("❌ Error message:", error.message);
      console.error("❌ Error response:", error.response);
      console.error("❌ Full error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch users"
      );
    }
  }
);

/**
 * Create new user
 * POST /api/admin/user/create
 */
export const createUser = createAsyncThunk(
  "user/create",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("📤 Creating user:", userData);
      
      const payload = {
        firstname: userData?.firstname || userData?.first_name,
        lastname: userData?.lastname || userData?.last_name,
        email: userData?.email,
        password: userData?.password,
        role: userData?.role || "user",
        isVerified: userData?.isVerified || false,
        dob: userData?.dob,
        phone: userData?.phone,
        location: userData?.location,
        timezone: userData?.timezone,
      };

      const response = await api.post("/api/admin/user/create", payload);
      
      const newUser = response?.data?.user || response?.data;
      
      if (!newUser) {
        throw new Error("Invalid response from server");
      }

      // Transform response
      const transformedUser = {
        id: newUser?._id || newUser?.id,
        firstname: newUser?.firstname,
        lastname: newUser?.lastname,
        email: newUser?.email,
        role: newUser?.role,
        phone: newUser?.phone,
        dob: newUser?.dob,
        location: newUser?.location,
        timezone: newUser?.timezone,
        isVerified: newUser?.isVerified,
        date: newUser?.createdAt ? dayjs(newUser.createdAt).unix() : dayjs().unix(),
      };
      
      console.log("✅ User created:", transformedUser);
      message.success("User created successfully!");
      return transformedUser;
    } catch (error) {
      console.error("❌ Error creating user:", error.message);
      const errorMsg = error.response?.data?.message || error.message || "Failed to create user";
      message.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Update user
 * PUT /api/admin/user/update/:id
 */
export const updateUser = createAsyncThunk(
  "user/update",
  async (userData, { rejectWithValue }) => {
    try {
      if (!userData?.id) {
        throw new Error("User ID is required for update");
      }

      console.log("📝 Updating user:", userData);
      
      const payload = {
        firstname: userData?.firstname || userData?.first_name,
        lastname: userData?.lastname || userData?.last_name,
        email: userData?.email,
        role: userData?.role,
        phone: userData?.phone,
        dob: userData?.dob,
        location: userData?.location,
        timezone: userData?.timezone,
        isVerified: userData?.isVerified,
      };

      const response = await api.put(`/api/admin/user/update/${userData.id}`, payload);
      
      console.log("📦 Update Response:", response?.data);
      
      // Try different response structures
      let updatedUser = response?.data?.updateduser || response?.data?.user || response?.data;
      
      if (!updatedUser) {
        console.warn("⚠️ No user data in response, using original data");
        updatedUser = userData;
      }

      // Merge with original data to preserve all fields
      const transformedUser = {
        id: updatedUser?._id || userData?.id,
        firstname: updatedUser?.firstname || userData?.firstname,
        lastname: updatedUser?.lastname || userData?.lastname,
        email: updatedUser?.email || userData?.email,
        role: updatedUser?.role || userData?.role,
        phone: updatedUser?.phone || userData?.phone,
        dob: updatedUser?.dob || userData?.dob,
        location: updatedUser?.location || userData?.location,
        timezone: updatedUser?.timezone || userData?.timezone,
        isVerified: updatedUser?.isVerified !== undefined ? updatedUser.isVerified : userData?.isVerified,
        date: updatedUser?.createdAt ? dayjs(updatedUser.createdAt).unix() : (userData?.date || dayjs().unix()),
      };
      
      console.log("✅ User updated:", transformedUser);
      message.success("User updated successfully!");
      return transformedUser;
    } catch (error) {
      console.error("❌ Error updating user:", error.message);
      const errorMsg = error.response?.data?.message || error.message || "Failed to update user";
      message.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Get user by ID
 * GET /api/admin/user/getbyid/:id
 */
export const getUserById = createAsyncThunk(
  "user/getById",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      console.log("📥 Fetching user by ID:", userId);
      
      const response = await api.get(`/api/admin/user/getbyid/${userId}`);
      
      const user = response?.data?.user || response?.data;
      
      if (!user) {
        throw new Error("Invalid response from server");
      }

      // Transform response
      const transformedUser = {
        id: user?._id || user?.id,
        firstname: user?.firstname,
        lastname: user?.lastname,
        email: user?.email,
        role: user?.role,
        phone: user?.phone,
        dob: user?.dob,
        location: user?.location,
        timezone: user?.timezone,
        isVerified: user?.isVerified,
        date: user?.createdAt ? dayjs(user.createdAt).unix() : dayjs().unix(),
      };
      
      console.log("✅ User fetched:", transformedUser);
      return transformedUser;
    } catch (error) {
      console.error("❌ Error fetching user:", error.message);
      const errorMsg = error.response?.data?.message || error.message || "Failed to fetch user";
      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Delete user
 * DELETE /api/admin/user/delete/:id
 */
export const deleteUser = createAsyncThunk(
  "user/delete",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error("User ID is required for deletion");
      }

      console.log("🗑️ Starting delete for user ID:", userId);
      console.log("🔗 DELETE endpoint: /api/admin/user/delete/" + userId);
      
      const response = await api.delete(`/api/admin/user/delete/${userId}`);
      
      console.log("📦 Full Delete Response:", response);
      console.log("📦 Delete Response Status:", response?.status);
      console.log("📦 Delete Response Data:", response?.data);
      
      // Check if delete was successful (status 200, 201, or 204)
      if (response?.status === 200 || response?.status === 201 || response?.status === 204) {
        console.log("✅ User deleted from database successfully (Status: " + response.status + ")");
        message.success("User deleted successfully!");
        return userId;
      } else {
        throw new Error("Delete request failed with status: " + response?.status);
      }
    } catch (error) {
      console.error("❌ Error deleting user:", error.message);
      console.error("❌ Error response status:", error.response?.status);
      console.error("❌ Error response data:", error.response?.data);
      console.error("❌ Full error object:", error);
      
      const errorMsg = error.response?.data?.message || error.message || "Failed to delete user";
      message.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);
