import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import {
    fetchQuestions,
    fetchQuestionById,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    fetchQuestionsByCategory
} from "services/questionService";

export const questionsSlice = createSlice({
    name: "questions",
    initialState: {
        items: [],
        loading: false,
        error: null,
        selectedQuestion: null,
        selectedLoading: false,
        categoryQuestions: [],
        categoryLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        // FETCH ALL QUESTIONS
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
                console.log("Questions fetched:", action.payload);
                state.error = null;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                message.error(action.payload || "Failed to fetch questions");
            })

            // FETCH QUESTION BY ID
            .addCase(fetchQuestionById.pending, (state) => {
                state.selectedLoading = true;
                state.error = null;
            })
            .addCase(fetchQuestionById.fulfilled, (state, action) => {
                state.selectedLoading = false;
                state.selectedQuestion = action.payload;
                console.log("Question by id fetched:", action.payload);
                state.error = null;
            })
            .addCase(fetchQuestionById.rejected, (state, action) => {
                state.selectedLoading = false;
                state.error = action.payload;
                message.error(action.payload || "Failed to fetch question");
            })

            // ADD QUESTION
            .addCase(addQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                message.success("Question added successfully!");
                state.error = null;
            })
            .addCase(addQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                message.error(action.payload || "Failed to add question");
            })

            // UPDATE QUESTION
            .addCase(updateQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuestion.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(
                    (q) => q.id === action.payload.id || q._id === action.payload._id
                );
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                message.success("Question updated successfully!");
                state.error = null;
            })
            .addCase(updateQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                message.error(action.payload || "Failed to update question");
            })

            // DELETE QUESTION
            .addCase(deleteQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(
                    (q) => q.id !== action.payload && q._id !== action.payload
                );
                message.success("Question deleted successfully!");
                state.error = null;
            })
            .addCase(deleteQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                message.error(action.payload || "Failed to delete question");
            })

            // FETCH QUESTIONS BY CATEGORY
            .addCase(fetchQuestionsByCategory.pending, (state) => {
                state.categoryLoading = true;
                state.error = null;
            })
            .addCase(fetchQuestionsByCategory.fulfilled, (state, action) => {
                state.categoryLoading = false;
                state.categoryQuestions = action.payload || [];
                console.log("Questions by category fetched:", action.payload);
                state.error = null;
            })
            .addCase(fetchQuestionsByCategory.rejected, (state, action) => {
                state.categoryLoading = false;
                state.error = action.payload;
                message.error(action.payload || "Failed to fetch questions by category");
            });
    },
});

export default questionsSlice.reducer;
