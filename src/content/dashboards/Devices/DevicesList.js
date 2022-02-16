import { useState, useEffect, useCallback } from 'react';

import { Card } from '@mui/material';
import DevicesTable from 'src/content/dashboards/Devices/DevicesTable';
import { useGetAllDevicesQuery } from 'src/utils/api'


function DevicesList() {

  const { data, isError, isLoading, error } = useGetAllDevicesQuery();

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
