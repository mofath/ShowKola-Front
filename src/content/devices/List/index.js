import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Helmet } from 'react-helmet-async';
import {useGetAllDevicesQuery} from "src/utils/api";
import Results from "./Results";
import PageHeader from './PageHeader';


const DevicesList = () => {

  const { data, isError, isLoading, error } = useGetAllDevicesQuery(undefined,{pollingInterval: 5000});

  return (
    <>
      <Helmet>
        <title>Devices</title>
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

export default DevicesList;