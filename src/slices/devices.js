import { createSlice } from '@reduxjs/toolkit';

import _ from 'lodash';

import axios from 'src/utils/axios';
import objectArray from 'src/utils/objectArray';

const initialState = {
  isLoaded: false,
  devices: {
    byId: {},
    allIds: []
  },
  tasks: {
    byId: {},
    allIds: []
  },
  members: {
    byId: {},
    allIds: []
  }
};

const slice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    getDevices(state, action) {
      const  devices  = action.payload;

      state.devices.byId = objectArray(devices);
      state.devices.allIds = Object.keys(state.devices.byId);
    },
    updateList(state, action) {
      const { list } = action.payload;

      state.lists.byId[list.id] = list;
    },

    moveTask(state, action) {
      const { taskId, position, listId } = action.payload;
      const { listId: sourceListId } = state.tasks.byId[taskId];

      _.pull(state.lists.byId[sourceListId].taskIds, taskId);
      if (listId) {
        state.tasks.byId[taskId].listId = listId;
        state.lists.byId[listId].taskIds.splice(position, 0, taskId);
      } else {
        state.lists.byId[sourceListId].taskIds.splice(position, 0, taskId);
      }
    }
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
