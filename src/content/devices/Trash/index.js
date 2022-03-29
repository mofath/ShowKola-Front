import { useState, useEffect, useCallback } from 'react';
import axios from 'src/utils/axiosMock';
import {useTranslation} from "react-i18next";
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';

import Results from './Results';
import PageHeader from './PageHeader';
import {useGetAllDevicesQuery} from "../../../utils/api";

function Trash() {
    const { data, isError, isLoading, error, isFetching } = useGetAllDevicesQuery({isDeleted :true},{
        pollingInterval: 5000
    });
    const { t } = useTranslation()
    const[initialError, setInitialError] = useState(false);

    // On regarde si il y a une erreur sur le premier chargement
    useEffect(()=>{
        if (isError && !isLoading && !initialError)
            setInitialError(true);
        if(initialError && !isLoading && !isError)
            setInitialError(false);
    },[isError, isLoading]);


    return (
    <>
      <Helmet>
        <title>{t('Deleted Devices')}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <Results devices={data} isLoading={isLoading} isError={isError} initialError={initialError}/>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default Trash;
