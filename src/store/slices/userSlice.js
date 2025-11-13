import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "services/userService";

const initialState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Reset error
    clearError: (state) => {
      state.error = null;
    },
    // Set selected user
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    // Clear selected user
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // ==========================================
    // FETCH ALL USERS
    // ==========================================
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload || [];
        state.error = null;
        console.log("✅ State updated with users:", state.users);
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Failed to fetch users:", action.payload);
      });

    // ==========================================
    // CREATE USER
    // ==========================================
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        // Add new user to the beginning of the list
        state.users.unshift(action.payload);
        state.error = null;
        console.log("✅ New user added to state");
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Failed to create user:", action.payload);
      });

    // ==========================================
    // UPDATE USER
    // ==========================================
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        
        // Find and update the user in the list
        const index = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        
        state.error = null;
        console.log("✅ User updated in state");
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Failed to update user:", action.payload);
      });

    // ==========================================
    // DELETE USER
    // ==========================================
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedUserId = action.payload;
        
        // Remove the deleted user from the list
        state.users = state.users.filter((user) => user.id !== deletedUserId);
        
        state.error = null;
        console.log("✅ User removed from state");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Failed to delete user:", action.payload);
      });
  },
});

export const { clearError, setSelectedUser, clearSelectedUser } =
  userSlice.actions;

export default userSlice.reducer;
