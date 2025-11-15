import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/user.js'
import courseReducer from './reducers/course.js'
import storage from 'redux-persist/lib/storage' // defaults to localStorage
import { persistReducer, persistStore } from 'redux-persist'
import { combineReducers } from 'redux'
import questionsReducer from './reducers/questions.js'
// import thunk from 'redux-thunk'

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['user', 'course'], // only user will be persisted
}
const rootReducer = combineReducers({
  user: userReducer,
  course: courseReducer,
  questions: questionsReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required when using redux-persist
    }),
})

export const persistor = persistStore(store)