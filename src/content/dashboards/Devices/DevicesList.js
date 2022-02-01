import { useState, useEffect, useCallback } from 'react';

import { Card } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';
import DevicesTable from 'src/content/dashboards/Devices/DevicesTable';
import {useDispatch, useSelector} from "src/store";
import {getDevices} from "src/slices/devices";

function DevicesList() {

  const dispatch = useDispatch();
  const {devices}  = useSelector((state) => state);
  const isMountedRef = useRefMounted();

  useEffect(()=>{
    console.log("devices", devices)
  },[devices]);

  useEffect(() => {
    dispatch(getDevices());
  }, [dispatch]);

  return (
    <Card>
      <DevicesTable devices={devices.devices}/>
    </Card>
  );
}

export default DevicesList;
