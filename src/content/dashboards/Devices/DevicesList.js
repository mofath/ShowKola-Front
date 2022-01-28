import { useState, useEffect, useCallback } from 'react';

import { Card } from '@mui/material';
import axios from 'src/utils/axios';
import useRefMounted from 'src/hooks/useRefMounted';
import DevicesTable from './DevicesTable';

function DevicesList() {
  const isMountedRef = useRefMounted();
  const [devices, setDevices] = useState([]);

  const getDevices = useCallback(async () => {
    try {
      const response = await axios.get('/api/device');

      if (isMountedRef.current) {
        setDevices(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  return (
    <Card>
      <DevicesTable devices={devices}/>
    </Card>
  );
}

export default DevicesList;
