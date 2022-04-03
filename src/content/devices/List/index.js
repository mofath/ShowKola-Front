import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Helmet } from 'react-helmet-async';

import {Card, Grid} from '@mui/material';

import PageHeader from './PageHeader';
import {useGetAllDevicesQuery} from "../../../utils/api";
import Results from "./Results";

const DashboardReports = () => {

  const { data, isError, isLoading, error } = useGetAllDevicesQuery(undefined,{pollingInterval: 5000});

  return (
    <>
      <Helmet>
        <title>Devices Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <div className="App">
        {isError ? (
            <>Oh no, there was an error</>
        ) : data || isLoading ? (
              <Results devices={data} isLoading={isLoading}/>
        ) : null}
      </div>
      <Footer />
    </>
  );
}

export default DashboardReports;
