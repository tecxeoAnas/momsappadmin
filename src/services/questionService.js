import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import api from "configs/UniversityConfig";
import dayjs from "dayjs";

// FETCH ALL QUESTIONS
export const fetchQuestions = createAsyncThunk(
    "questions/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/about-you/admin/all");
            const res = response?.data?.questions || response?.data;
            console.log("Fetched questions:", res);
            return res;
        } catch (error) {
            return rejectWithValue(error.message || "Fetch error");
        }
    }
);

// FETCH QUESTION BY ID
export const fetchQuestionById = createAsyncThunk(
    "questions/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            console.log("Fetching question with id:", id);
            const response = await api.get(`/api/about-you/admin/${id}`);
            const res = response?.data?.question || response?.data;
            console.log("Fetched question by id:", res);
            return res;
        } catch (error) {
            return rejectWithValue(error.message || "Fetch error");
        }
    }
);

// ADD QUESTION
export const addQuestion = createAsyncThunk(
    "questions/add",
    async (values, { rejectWithValue }) => {
        try {
            console.log("Adding question with values:", values);
            const response = await api.post("/api/about-you/admin/create", values);
            const res = response?.data?.question || response?.data;
            console.log("Question added:", res);
            return res;
        } catch (error) {
            return rejectWithValue(error.message || "Add error");
        }
    }
);

// UPDATE QUESTION
export const updateQuestion = createAsyncThunk(
    "questions/edit",
    async (values, { rejectWithValue }) => {
        try {
            console.log("Updating question with values:", values);
            const response = await api.put(`/api/about-you/admin/update/${values?.id}`, values);
            const res = response?.data?.question || response?.data;
            console.log("Question updated:", res);
            return res;
        } catch (error) {
            return rejectWithValue(error.message || "Update error");
        }
    }
);

// DELETE QUESTION
export const deleteQuestion = createAsyncThunk(
    "questions/delete",
    async (id, { rejectWithValue }) => {
        try {
            console.log("Deleting question with id:", id);
            const response = await api.delete(`/api/about-you/admin/delete/${id}`);
            console.log("Question deleted:", response?.data);
            return id; // Return the ID that was deleted
        } catch (error) {
            return rejectWithValue(error.message || "Delete error");
        }
    }
);

// FETCH QUESTIONS BY CATEGORY
export const fetchQuestionsByCategory = createAsyncThunk(
    "questions/fetchByCategory",
    async (categoryId, { rejectWithValue }) => {
        try {
            console.log("Fetching questions for category:", categoryId);
            const response = await api.get(`/api/about-you/admin/category/${categoryId}`);
            const res = response?.data?.questions || response?.data;
            console.log("Fetched questions by category:", res);
            return res;
        } catch (error) {
            return rejectWithValue(error.message || "Fetch error");
        }
    }
);
