import { configureStore } from '@reduxjs/toolkit'
import eventReducer from 'slices/eventSlice'

export default configureStore({
    reducer: {
        event: eventReducer
    },
})