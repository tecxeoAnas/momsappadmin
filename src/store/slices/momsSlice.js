import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { addCategories, addUniversities, addUsers, deleteUniversity, DELETEUsers, fetchMomstype, fetchUniversities, fetchUsers, UpdateUniversity, updateusers } from "services/momsService";

export const universitySlice = createSlice({
  name: "universities",
  initialState: {
    allusers: [],
    items: [],
    loading: false,
    error: null,


    // MomsTypes INITIALIZE
       momcategoryLoading: false,
       momcategory: [],
       momcategoryError: null,



  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Universities
      .addCase(fetchMomstype.pending, (state) => {
        state.momcategoryLoading = true;
        state.momcategoryError = null;
      })
      .addCase(fetchMomstype.fulfilled, (state, action) => {
        state.momcategoryLoading = false;
        state.momcategory = action.payload || [];
        console.log("items items?>===", action.payload);
        state.momcategoryError = null;
      })
      .addCase(fetchMomstype.rejected, (state, action) => {
        state.momcategoryLoading = false;
        state.momcategoryError = action.payload;
      })

      // Add University
      .addCase(addCategories.pending, (state) => {
        state.momcategoryLoading = true;
        state.momcategoryError = null;
      })
      .addCase(addCategories.fulfilled, (state, action) => {
        state.momcategoryLoading = false;
        console.log("Added university payload:", action.payload);
        // Add new university to the beginning of the list
        state.items.unshift(action.payload);
        console.log("action.payload action.payload added", action.payload)
        // message.success(`User added successfully!`);
        state.momcategoryError = null;
      })
      .addCase(addCategories.rejected, (state, action) => {
        state.momcategoryLoading = false;
        state.momcategoryError = action.payload;
      })

      // Update University
      .addCase(UpdateUniversity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateUniversity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(UpdateUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete University
      .addCase(deleteUniversity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUniversity.fulfilled, (state, action) => {
        state.loading = false;
        console.log(" deleteUniversity deleteUniversity==-----", action.payload)
        // Filter out the deleted university
        state.items = state.items.filter((u) => u.id !== action.payload);
        state.error = null;
            message.success("University deleted successfully", 2);
      })
      .addCase(deleteUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
              message.error(action.payload || "Failed to delete university", 2);

      })




      // USERS===============================>>>>>>>>>>
      // Fetch USERS
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allusers = action.payload || [];
        console.log("items userssss?>===", action.payload);
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // // ADD USERS
      // .addCase(addUsers.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(addUsers.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const adduserdata = action.payload || [];
      //   state.allusers.unshift(adduserdata)
      //    message.success(`User added successfully!`);
      // })
      // .addCase(addUsers.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      //   message.error(action.payload || "Failed to add user");
      // })


      // // UPDATE USERS
      // .addCase(updateusers.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(updateusers.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const updatedUser = action.payload;
      //   // state.allusers me jis ka id match ho usko replace karo
      //   state.allusers = state.allusers.map(user =>
      //     user.id === updatedUser.id ? updatedUser : user
      //   );
      //   state.error = null;
      //   message.success(`User updated successfully!`);
      // })
      // .addCase(updateusers.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      //   message.error(action.payload || "Failed to update user");
      // })


      // // DELETE USERS
      // .addCase(DELETEUsers.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(DELETEUsers.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const deletedId = action.payload; // thunk se sirf id return karo
      //   // us id ko filter karke hata do
      //   state.allusers = state.allusers.filter(user => user.id !== deletedId);
      //   state.error = null;
      //   message.success("User deleted successfully!");
      // })
      // .addCase(DELETEUsers.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      //   message.error(action.payload || "Failed to delete user");
      // })
// ADD USERS CASES
.addCase(addUsers.pending, (state) => {
    state.loading = true;
    state.error = null;
})
.addCase(addUsers.fulfilled, (state, action) => {
    state.loading = false;
    const adduserdata = action.payload || [];
    // Add to beginning of array for newest first
    state.allusers.unshift(adduserdata);
    message.success(`User added successfully!`);
})
.addCase(addUsers.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
    message.error(action.payload || "Failed to add user");
})

// UPDATE USERS CASES
.addCase(updateusers.pending, (state) => {
    state.loading = true;
    state.error = null;
})
.addCase(updateusers.fulfilled, (state, action) => {
    state.loading = false;
    const updatedUser = action.payload;
    
    // Find and update the user
    const userIndex = state.allusers.findIndex(user => user.id === updatedUser.id);
    if (userIndex !== -1) {
        state.allusers[userIndex] = updatedUser;
    }
    
    state.error = null;
    message.success(`User updated successfully!`);
})
.addCase(updateusers.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
    message.error(action.payload || "Failed to update user");
})

// DELETE USERS CASES
.addCase(DELETEUsers.pending, (state) => {
    state.loading = true;
    state.error = null;
})
.addCase(DELETEUsers.fulfilled, (state, action) => {
    state.loading = false;
    const deletedId = action.payload; // This is the ID we returned
    
    // Remove the user with matching ID
    state.allusers = state.allusers.filter(user => user.id !== deletedId);
    state.error = null;
    message.success("User deleted successfully!");
})
.addCase(DELETEUsers.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
    message.error(action.payload || "Failed to delete user");
})

  },
});

export default universitySlice.reducer;
