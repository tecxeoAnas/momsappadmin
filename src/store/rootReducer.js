import { combineReducers } from 'redux'
import theme from './slices/themeSlice'
import auth from './slices/authSlice'
import momsReducer from "./slices/momsSlice"
import category from "./slices/categorySlice"
import user from "./slices/userSlice"
import questions from "./slices/questionsSlice"
import course from "./slices/courseSlice"
import prompt from "./slices/promptSlice"
import comingSoon from "./slices/comingSoonSlice"

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        theme,
        auth,
        momsReducer,
        category,
        user,
        questions,
        course,
        prompt,
        comingSoon,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}
  
export default rootReducer
