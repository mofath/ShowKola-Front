import * as Yup from "yup";
import wait from 'src/utils/wait';
import {
    Autocomplete,
    Avatar,
    Box, Button, Checkbox,
    Chip, CircularProgress,
    DialogContent, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel,
    Grid, IconButton, lighten,
    Table, TableBody, TableCell,
    TableContainer, TableFooter,
    TableHead, TableRow,
    TextField, Tooltip, Typography, useMediaQuery, useTheme, Zoom
} from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import numeral from "numeral";
import {FieldArray, Formik} from "formik";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {useEffect, useState} from "react";
import {styled} from "@mui/material/styles";
import { useUpdateDeviceMutation } from 'src/utils/api';
import _ from "lodash";


const IconButtonError = styled(IconButton)(
    ({ theme }) => `
     background: ${theme.colors.error.lighter};
     color: ${theme.colors.error.main};
     padding: ${theme.spacing(0.5)};

     &:hover {
      background: ${lighten(theme.colors.error.lighter, 0.4)};
     }
`
);

const Form = ({data}) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [updateDevice, { isLoading: isUpdating, error }] = useUpdateDeviceMutation()

    useEffect(()=> {

        console.log("chargement des données:",data)
    },[data]);

    const members = [
        {
            avatar: '/static/images/avatars/1.jpg',
            name: 'Maren Lipshutz'
        },
        {
            avatar: '/static/images/avatars/2.jpg',
            name: 'Zain Vetrovs'
        },
        {
            avatar: '/static/images/avatars/3.jpg',
            name: 'Hanna Siphron'
        },
        {
            avatar: '/static/images/avatars/4.jpg',
            name: 'Cristofer Aminoff'
        },
        {
            avatar: '/static/images/avatars/5.jpg',
            name: 'Maria Calzoni'
        }
    ];
    const itemsList = [
        {
            id: 1,
            name: 'Design services for March',
            quantity: 1,
            price: 8945,
            currency: '$'
        },
        {
            id: 2,
            name: 'Website migration services',
            quantity: 3,
            price: 2367,
            currency: '$'
        }
    ];



    const [value, setValue] = useState(null);
    const [value1, setValue1] = useState(null);

    const [items] = useState(itemsList);


    const handleCreateInvoiceSuccess = () => {
        enqueueSnackbar(t('A new invoice has been created successfully'), {
            variant: 'success',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            },
            TransitionComponent: Zoom
        });

    };
    const handleUpdateDeviceFailure = () => {
        enqueueSnackbar(t('An error occured'), {
            variant: 'error',
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
            },
            TransitionComponent: Zoom
        });
    }
    return(
        <Formik
            initialValues={{
                device: data,
                submit: null
            }}
            onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting, errors }
            ) => {
                try {
                    const {device} = _values;
                    await updateDevice(device).unwrap();
                    await wait(1000);
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    handleCreateInvoiceSuccess();
                } catch (err) {
                    const {status} = err.data;
                    if (status === 400){
                        const {errors} = err.data;
                        // On adapte le format des errors pour Formik
                        const formikErrors = _.mapValues(_.mapKeys(errors, (v,k)=>_.camelCase(k)),(x) => x[0]);
                        setErrors({ device: formikErrors});

                    }
                    else
                        handleUpdateDeviceFailure();

                    setStatus({ success: false });
                    setSubmitting(false);
                }
            }}
        >
            {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
                  setFieldValue
              }) => (
                <form onSubmit={handleSubmit}>

                        <Grid container spacing={3}>

                            <Grid item xs={12} md={6}>
                                <Box pb={1}>
                                    <b>{t('Host')}:</b>
                                </Box>
                                <TextField
                                    error={Boolean(touched.host && errors.host)}
                                    fullWidth
                                    helperText={touched.host && errors.host}
                                    name="device.host"
                                    placeholder={t('Host of the device')}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.device.host}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box pb={1}>
                                    <b>{t('Port')}:</b>
                                </Box>
                                <TextField
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                    error={Boolean(touched.device && touched.device.port && errors.device && errors.device.port)}
                                    fullWidth
                                    helperText={touched.device && touched.device.port && errors.device && errors.device.port}
                                    name="device.port"
                                    placeholder={t('Port of the device')}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.device.port}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box pb={1}>
                                    <b>{t('Watch device')}:</b>
                                </Box>

                            </Grid>
                            <Grid>
                                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                    <FormLabel component="legend">{t("Tracking commands")}</FormLabel>
                                    <FormGroup>
                                        {Object.entries(values.device.fetchedData).map(([key, value], index) =>
                                            <FormControlLabel
                                                key = {key}
                                                control={
                                                    <Checkbox checked={values.device.fetchedData[key]}
                                                              onChange={handleChange}
                                                              onClick={()=>console.log(values.device.fetchedData[key])}
                                                              name={`device.fetchedData.${key}`}/>
                                                }
                                                label={key}
                                            />
                                        )}

                                        </FormGroup>
                                        <FormHelperText>{touched.fetchedData && errors.fetchedData}</FormHelperText>
                                    </FormControl>
                            </Grid>
                        </Grid>

                    <Box
                        sx={{
                            display: { xs: 'block', sm: 'flex' },
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 3
                        }}
                    >
                        <Box>
                            <Button fullWidth={mobile} variant="outlined">
                                {t('Preview invoice')}
                            </Button>
                        </Box>
                        <Box>
                            <Button
                                fullWidth={mobile}
                                type="submit"
                                startIcon={
                                    isSubmitting ? <CircularProgress size="1rem" /> : null
                                }
                                disabled={Boolean(errors.submit) || isSubmitting}
                                variant="contained"
                                size="large"
                            >
                                {t('Apply changes')}
                            </Button>
                        </Box>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default Form