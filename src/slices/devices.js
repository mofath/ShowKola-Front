import { createSlice } from '@reduxjs/toolkit';

import _ from 'lodash';

import axios from 'src/utils/axiosMock';
import objectArray from 'src/utils/objectArray';

const initialState = {
  isLoaded: false,
  /*
  devices: {
    byId: {},
    allIds: []
  }
   */
  devices: []
};


const slice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    getDevices(state, action) {
      const  devices  = action.payload;
      /*
      state.devices.byId = objectArray(devices);
      state.devices.allIds = Object.keys(state.devices.byId);
       */
      state.devices = devices
      state.isLoaded = true;
    },
    updateList(state, action) {
      const { list } = action.payload;

      state.lists.byId[list.id] = list;
    },
  }
});

export const reducer = slice.reducer;
let response;
export const getDevices = () => async (dispatch) => {
  try {
    response = await axios.get('/api/device');
  }
  catch (Exception){
    console.log("ERROR", Exception)
    response= {data: []}

  }
dispatch(slice.actions.getDevices(response.data));
};

export default slice;
