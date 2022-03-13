import {useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
import {useSnackbar} from "notistack";
import {
    Typography, Zoom,
} from '@mui/material';
import {useParams} from "react-router";
import {useGetModelsQuery, useGetOneDeviceQuery} from 'src/utils/api'
import Form from "./Form";

const CreateForm = () => {
    const { data : models, isError: isModelsError, isLoading: isModelsLoading, error: modelsError } = useGetModelsQuery();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    const handleFailure = (message) => {
        enqueueSnackbar(message, {
            variant: 'error',
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
            },
            TransitionComponent: Zoom
        });
    }

    useEffect(()=>{
        if (isModelsError)
            handleFailure(t('An error occured'))
    },[isModelsError])

    return (
        <>
            {!isModelsLoading &&
                <Form models={models}/>}

            {(isModelsError) &&
                <Typography>Erreur</Typography>}
        </>
    );
}

export default CreateForm;
