# User Management API Documentation

## Overview
This document describes the user management API implementation in the MOM Admin application. The user service provides complete CRUD operations with Redux integration.

## Base URL
`https://mom-app-ad61901f627b.herokuapp.com`

## API Endpoints

### 1. Fetch All Users
**Thunk:** `fetchUsers()`  
**HTTP Method:** GET  
**Endpoint:** `/users`

**Response:**
```javascript
{
  users: [
    {
      _id: "user-id",
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      dob: "1990-01-01",
      location: "New York",
      timezone: "UTC-5",
      role: "admin",
      isVerified: true,
      createdAt: "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Usage:**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'services/momsService';

const dispatch = useDispatch();
const { allusers, loading } = useSelector(state => state.momsReducer);

useEffect(() => {
  dispatch(fetchUsers());
}, [dispatch]);
```

---

### 2. Create User
**Thunk:** `addUsers(userData)`  
**HTTP Method:** POST  
**Endpoint:** `/api/admin/user/create`

**Required Fields:**
- `firstname` (string) - User's first name
- `lastname` (string) - User's last name
- `email` (string) - User's email address
- `password` (string) - User's password (min 6 characters)
- `role` (string) - User role: "admin" or "user"

**Optional Fields:**
- `phone` (string) - User's phone number
- `dob` (string) - Date of birth (ISO format)
- `location` (string) - User's location
- `timezone` (string) - User's timezone
- `isVerified` (boolean) - Verification status (default: false)

**Payload Example:**
```javascript
{
  firstname: "John",
  lastname: "Doe",
  email: "john@example.com",
  password: "password123",
  role: "admin",
  phone: "+1234567890",
  dob: "1990-01-01",
  location: "New York",
  timezone: "UTC-5",
  isVerified: false
}
```

**Usage:**
```javascript
const addUser = async (values) => {
  try {
    await dispatch(addUsers(values)).unwrap();
    message.success("User created successfully!");
  } catch (error) {
    message.error("Failed to create user");
  }
};
```

---

### 3. Update User
**Thunk:** `updateusers(userData)`  
**HTTP Method:** PUT  
**Endpoint:** `/updateuser/:id`

**Required Fields:**
- `id` (string) - User's MongoDB ID

**Update Fields (optional):**
- `firstname` - First name
- `lastname` - Last name
- `email` - Email address
- `phone` - Phone number
- `dob` - Date of birth
- `location` - Location
- `timezone` - Timezone
- `role` - User role
- `isVerified` - Verification status

**Payload Example:**
```javascript
{
  id: "user-id",
  firstname: "Jane",
  lastname: "Smith",
  email: "jane@example.com",
  role: "user",
  phone: "+9876543210",
  location: "California",
  timezone: "UTC-8"
}
```

**Usage:**
```javascript
const editUser = async (values) => {
  try {
    await dispatch(updateusers({ 
      ...values, 
      id: editingUser.id 
    })).unwrap();
    message.success("User updated successfully!");
  } catch (error) {
    message.error("Failed to update user");
  }
};
```

---

### 4. Delete User
**Thunk:** `DELETEUsers(userId)`  
**HTTP Method:** DELETE  
**Endpoint:** `/deleteuser/:id`

**Parameters:**
- `userId` (string) - User's MongoDB ID

**Usage:**
```javascript
const deleteUser = async (userId) => {
  try {
    await dispatch(DELETEUsers(userId)).unwrap();
    message.success("User deleted successfully!");
  } catch (error) {
    message.error("Failed to delete user");
  }
};
```

---

## User Data Structure

### User Object
```javascript
{
  id: "user-id",              // MongoDB _id
  firstname: "John",          // First name
  lastname: "Doe",            // Last name
  email: "john@example.com",  // Email address
  phone: "+1234567890",       // Phone number (optional)
  dob: "1990-01-01",          // Date of birth (optional)
  location: "New York",       // Location (optional)
  timezone: "UTC-5",          // Timezone (optional)
  role: "admin",              // "admin" or "user"
  isVerified: true,           // Email verification status
  date: 1704067200            // Unix timestamp of creation
}
```

---

## Redux Store Integration

### State Structure
```javascript
{
  momsReducer: {
    allusers: [],           // Array of all users
    loading: false,         // Loading state
    error: null,            // Error message if any
    selectedUser: null,     // Currently selected user
    selectedLoading: false  // Loading state for selected user
  }
}
```

### Thunks Available
1. `fetchUsers()` - Fetch all users
2. `addUsers(userData)` - Create new user
3. `updateusers(userData)` - Update existing user
4. `DELETEUsers(userId)` - Delete user

---

## UI Component: UserList

### Features
- **Display Users:** Table with sortable columns (name, phone, role, date)
- **Search:** Filter users by name, email, phone, or role
- **Add User:** Modal form with all user fields
- **Edit User:** Modal form to update user information
- **Delete User:** Confirm delete action
- **View Details:** Modal showing complete user information

### Component Location
`src/views/app-views/pages/user-list/index.js`

### Form Fields

#### Add/Edit User Form
- First Name (required, min 2 chars)
- Last Name (required, min 2 chars)
- Email (required, valid email)
- Password (required for create, min 6 chars, shown only in add form)
- Phone Number (optional, validates phone format)
- Date of Birth (optional, date picker)
- Location (optional)
- Timezone (optional)
- Role (required, select: admin/user)

#### View Details
Shows all user information including:
- First & Last Name
- Email
- Phone
- Date of Birth
- Location
- Timezone
- Role (with tag)
- Verification Status (green/red tag)
- Creation Date

---

## Error Handling

All API calls include comprehensive error handling:

```javascript
try {
  await dispatch(addUsers(userData)).unwrap();
  message.success("Success message");
} catch (error) {
  // Error is automatically displayed as message
  // Examples:
  // - "Invalid request"
  // - "Email already exists"
  // - "Failed to create user"
}
```

---

## Field Mapping

The service layer handles field name transformation:

| Frontend Field | API Field | Type |
|---|---|---|
| firstname | firstname | string |
| lastname | lastname | string |
| email | email | string |
| password | password | string |
| phone | phone | string |
| dob | dob | date |
| location | location | string |
| timezone | timezone | string |
| role | role | string |
| isVerified | isVerified | boolean |

---

## Usage Examples

### Complete User Management Flow

```javascript
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUsers, updateusers, DELETEUsers } from 'services/momsService';
import { message } from 'antd';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { allusers, loading } = useSelector(state => state.momsReducer);

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Create user
  const handleAddUser = async (userData) => {
    try {
      await dispatch(addUsers(userData)).unwrap();
      message.success("User created!");
    } catch (error) {
      message.error("Failed to create user");
    }
  };

  // Update user
  const handleUpdateUser = async (userData) => {
    try {
      await dispatch(updateusers(userData)).unwrap();
      message.success("User updated!");
    } catch (error) {
      message.error("Failed to update user");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(DELETEUsers(userId)).unwrap();
      message.success("User deleted!");
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  return (
    // Component JSX here
  );
};

export default UserManagement;
```

---

## Logging

All operations include console logging with emojis for easy debugging:

- ✅ Success: `console.log("✅ Users fetched:", users);`
- 📝 Updates: `console.log("📝 Updating user:", userData);`
- 🗑️ Deletion: `console.log("🗑️ Deleting user:", userId);`
- ❌ Errors: `console.error("❌ Error message");`

---

## Notes

1. **Password:** Only accepted during user creation (`/api/admin/user/create`), not during updates
2. **Email:** Must be unique in the system
3. **Role:** Can be "admin" or "user"
4. **Dates:** Use ISO format (YYYY-MM-DD) for date fields
5. **Phone:** Optional but validates phone format if provided
6. **Timezone:** Should be in format like "UTC+5", "UTC-5", etc.

---

## Testing

To test the user API:

```javascript
// Test data
const testUser = {
  firstname: "Test",
  lastname: "User",
  email: "test@example.com",
  password: "test123456",
  phone: "+1234567890",
  dob: "1995-05-15",
  location: "Test City",
  timezone: "UTC+0",
  role: "user",
  isVerified: false
};

// Create
dispatch(addUsers(testUser));

// Update
dispatch(updateusers({ ...testUser, id: "user-id", firstname: "Updated" }));

// Delete
dispatch(DELETEUsers("user-id"));
```

---

**Last Updated:** January 2024  
**Status:** ✅ Production Ready
