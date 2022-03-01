import {useEffect, useState} from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import wait from 'src/utils/wait';
import numeral from 'numeral';

import {
    Grid,
    Dialog,
    DialogTitle,
    Chip,
    DialogContent,
    Box,
    Zoom,
    Typography,
    TextField,
    CircularProgress,
    Avatar,
    Autocomplete,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Tooltip,
    IconButton,
    lighten,
    useTheme,
    useMediaQuery,
    TableFooter
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {useParams} from "react-router";
import { useGetOneDeviceQuery } from 'src/utils/api'
import Form from "./Form";



function EditForm() {
    const {id} = useParams();
    const { t } = useTranslation();

    const { data, isError, isLoading, error } = useGetOneDeviceQuery(id);

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center">
                {!isLoading &&
                    <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {t('Device')}
                    </Typography>
                    <Typography variant="subtitle1">
                        {data.brand} {data.model}
                    </Typography>
                </Grid>
                }
            </Grid>
            {!isLoading &&
                <Form data={data}/>}

            {isError &&
                <Typography>Erreur</Typography>}
        </>
    );
}

export default EditForm;
