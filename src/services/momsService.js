import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import api from "configs/UniversityConfig";
import dayjs from "dayjs";






// MOMS TYPES
export const fetchMomstype = createAsyncThunk(
    "momCategory/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/mom-type");
            const res = response?.data?.momTypes;
            console.log("res res==>>>", res)
            return res;
        } catch (error) {
            return rejectWithValue(error.message || "Fetch error");
        }
    }
);

export const addCategories = createAsyncThunk(
    "categories/add",
    async (values, { rejectWithValue }) => {
        try {
            console.log("values values", values)
            const response = await api.post("/api/mom-type/create", values);
            const res = response?.data?.momType;
            console.log("res??>?>?>?>",res)
            return res;

        } catch (error) {
            return rejectWithValue(error.message || "ADD error");
        }
    }
);

export const UpdateUniversity = createAsyncThunk(
    "universities/edit",
    async (values, { rejectWithValue }) => {
        console.log("values values values ", values?.id);
        console.log("values values values ===>>>", values);
        try {
            const response = await api.put(`update-university/${values?.id}`, values);
            const res = response?.data?.data; // Added ?.data if needed
            
            // Map the response to match your component structure
            const finalresponse = {
                id: res._id || values.id,
                name: res?.name,
                tagline: res?.description,
                logo: res?.image_url,
            };
            return finalresponse;
        } catch (error) {
            return rejectWithValue(error.message || "Edit error");
        }
    }
);

export const deleteUniversity = createAsyncThunk(
    "universities/delete",
    async (id, { rejectWithValue }) => {
        console.log("id================================",id)
        try {
            const response = await api.delete(`delete-university/${id}`);
            const res = response?.data?.deleteuniversity?._id;
            console.log(res);
            return res;
        } catch (error) {
            return rejectWithValue(error.message || "Delete error");
        }
    }
);









// USERS=====================>>>>>>>>>>>
// FETCH USERS
export const fetchUsers = createAsyncThunk(
    "Users/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("getusers");
           const res = response?.data?.users.map((item) => ({
                id: item?._id,
                name: item?.name,
                email: item?.email,
                role: item?.role,
                phone: item?.phoneNumber,
                date: item?.createdAt,
            }));
           console.log("res users=========", res)

            return res;
        } catch (error) {
            return rejectWithValue(error.message || "Fetch error");
        }
    }
);

// ADD USERS
export const addUsers = createAsyncThunk(
    "addUsers/add",
    async (values, { rejectWithValue }) => {
        try {
            // Updated endpoint to use new API
            const payload = {
                firstname: values?.firstname || values?.first_name,
                lastname: values?.lastname || values?.last_name,
                email: values?.email,
                password: values?.password,
                role: values?.role || "user",
                phone: values?.phone,
                dob: values?.dob,
                location: values?.location,
                timezone: values?.timezone,
                isVerified: values?.isVerified || false,
            };
            
            const response = await api.post("/api/admin/user/create", payload);
            const res = response?.data?.user || response?.data;
            
            const finaldata = {
                id: res?._id,
                firstname: res?.firstname,
                lastname: res?.lastname,
                email: res?.email,
                role: res?.role,
                phone: res?.phone,
                dob: res?.dob,
                location: res?.location,
                timezone: res?.timezone,
                isVerified: res?.isVerified,
                // Fix date format - convert ISO string to unix timestamp
                date: res?.createdAt ? dayjs(res.createdAt).unix() : dayjs().unix(),
                lastOnline: res?.createdAt ? dayjs(res.createdAt).unix() : dayjs().unix(),
            }
            
            message.success("User created successfully!");
            return finaldata;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to create user";
            message.error(errorMsg);
            return rejectWithValue(errorMsg);
        }
    }
);

// UPDATE USERS
export const updateusers = createAsyncThunk(
    "updateusers/add",
    async (values, { rejectWithValue }) => {
        try {
            const response = await api.put(`updateuser/${values?.id}`, values);
            // Fix: Check both possible response structures
            const res = response?.data?.updateduser;
            
            const finaldata = {
                id: res?._id || values?.id, // Fallback to original id
                name: res?.name,
                email: res?.email,
                role: res?.role,
                phone: res?.phoneNumber,
                // Fix date format
                date: res?.createdAt ? dayjs(res.createdAt).unix() : dayjs().unix(),
                lastOnline: res?.updatedAt ? dayjs(res.updatedAt).unix() : dayjs().unix(),
            }
            
            console.log("res finaldata=========", finaldata);
            return finaldata;
        } catch (error) {
            return rejectWithValue(error.message || "Update error");
        }
    }
);

// DELETE USERS
export const DELETEUsers = createAsyncThunk(
    "DELETEUsers/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`deleteuser/${id}`);
            // Return the ID directly for deletion
            const finalid = response?.data?.user?._id
            console.log("finalid finalid", finalid)
            return finalid; // Return the ID that was deleted
        } catch (error) {
            return rejectWithValue(error.message || "Delete error");
        }
    }
);