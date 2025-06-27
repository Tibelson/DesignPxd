import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CONTACTS_STORAGE_KEY = '@emergency_contacts';

// Async thunk for loading contacts from storage
export const loadContacts = createAsyncThunk(
  'contacts/loadContacts',
  async () => {
    try {
      const contactsJson = await AsyncStorage.getItem(CONTACTS_STORAGE_KEY);
      return contactsJson ? JSON.parse(contactsJson) : [];
    } catch (error) {
      console.error('Error loading contacts:', error);
      return [];
    }
  }
);

// Async thunk for saving contacts to storage
export const saveContacts = createAsyncThunk(
  'contacts/saveContacts',
  async (contacts) => {
    try {
      await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
      return contacts;
    } catch (error) {
      console.error('Error saving contacts:', error);
      throw error;
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load contacts cases
      .addCase(loadContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contacts = action.payload;
      })
      .addCase(loadContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Save contacts cases
      .addCase(saveContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contacts = action.payload;
      })
      .addCase(saveContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default contactsSlice.reducer; 