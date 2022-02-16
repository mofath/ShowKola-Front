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

    useEffect(()=> {
        const toto= "INITIALISATION"
        console.log(data.fetchedData[toto])
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
    return(
        <Formik
            initialValues={{
                device: data,
                submit: null
            }}
            validationSchema={Yup.object().shape({
                number: Yup.string()
                    .max(255)
                    .required(t('The invoice number field is required'))
            })}
            onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
                try {
                    console.log(_values);
                    await wait(1000);
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    handleCreateInvoiceSuccess();
                } catch (err) {
                    console.error(err);
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
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
                                    <b>{t('Brand')}:</b>
                                </Box>
                                <TextField
                                    error={Boolean(touched.brand && errors.brand)}
                                    fullWidth
                                    helperText={touched.brand && errors.brand}
                                    name="device.brand"
                                    placeholder={t('Brand of the device')}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.device.brand}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box pb={1}>
                                    <b>{t('Model')}:</b>
                                </Box>
                                <TextField
                                    error={Boolean(touched.model && errors.model)}
                                    fullWidth
                                    helperText={touched.model && errors.model}
                                    name="device.model"
                                    placeholder={t('Model of the device')}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.device.model}
                                    variant="outlined"
                                />
                            </Grid>
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
                                    error={Boolean(touched.port && errors.port)}
                                    fullWidth
                                    helperText={touched.port && errors.port}
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
                                <TextField
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                    error={Boolean(touched.port && errors.port)}
                                    fullWidth
                                    helperText={touched.port && errors.port}
                                    name="device.port"
                                    placeholder={t('Port of the device')}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.device.port}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid>
                                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                    <FormLabel component="legend">{t("Tracking commands")}</FormLabel>
                                    <FormGroup>
                                        {Object.entries(values.device.fetchedData).map(([key, value], index) =>
                                            <FormControlLabel
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