import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  connectedDevice: null,
  error: null,
};

const bluetoothSlice = createSlice({
  name: 'bluetooth',
  initialState,
  reducers: {
    deviceConnected: (state, action) => {
      state.isConnected = true;
      state.connectedDevice = action.payload;
      state.error = null;
    },
    deviceDisconnected: (state) => {
      state.isConnected = false;
      state.connectedDevice = null;
      state.error = null;
    },
    connectionError: (state, action) => {
      state.isConnected = false;
      state.connectedDevice = null;
      state.error = action.payload;
    },
  },
});

export const { deviceConnected, deviceDisconnected, connectionError } = bluetoothSlice.actions;
export default bluetoothSlice.reducer; 