import { configureStore } from '@reduxjs/toolkit';
import contactsReducer from './slices/contactsSlice';
import bluetoothReducer from './slices/bluetoothSlice';

export const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    bluetooth: bluetoothReducer,
  },
}); 