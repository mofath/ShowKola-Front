import { useState, useEffect, useCallback } from 'react';

import { Card } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';
import DevicesTable from 'src/content/dashboards/Devices/DevicesTable';
import {useDispatch, useSelector} from "src/store";
import {fetchDevices} from "src/slices/devices";
import { useGetAllDevicesQuery } from 'src/utils/api'


function DevicesList() {

  const { data, isError, isLoading, error } = useGetAllDevicesQuery();
  const dispatch = useDispatch();
  const {devices}  = useSelector((state) => state);
  const isMountedRef = useRefMounted();

  return (
      <div className="App">
        {isError ? (
            <>Oh no, there was an error</>
        ) : data || isLoading ? (
            <Card>
              <DevicesTable devices={data} isLoading={isLoading}/>
            </Card>
        ) : null}
      </div>
  )
}

export default DevicesList;
