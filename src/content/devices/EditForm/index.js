import { useTranslation } from 'react-i18next';
import {
    Typography,
} from '@mui/material';
import {useParams} from "react-router";
import { useGetOneDeviceQuery } from 'src/utils/api'
import Form from "./Form";

function EditForm() {
    const {id} = useParams();
    const { t } = useTranslation();

    const { data, isError, isLoading, error } = useGetOneDeviceQuery(id);

    return (
        <>
            {!isLoading &&
                <Form data={data}/>}

            {isError &&
                <Typography>Erreur</Typography>}
        </>
    );
}

export default EditForm;
