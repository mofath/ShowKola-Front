import * as Yup from "yup";
import wait from 'src/utils/wait';
import {
    Box, Button, Card, CardActions, CardContent, CardHeader,
    Chip, CircularProgress,
    FormControl, FormGroup, FormHelperText,
    Grid, IconButton, lighten, Stack,
    TextField, useMediaQuery, useTheme, Zoom
} from "@mui/material";
import {Formik} from "formik";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {useEffect, useState} from "react";
import {styled} from "@mui/material/styles";
import { useUpdateDeviceMutation } from 'src/utils/api';
import _ from "lodash";
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom";


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

const jsonSchema = {
    type: "object",
    properties: {
        id: {
            type: "string",
            nullable: true
        },
        brand: {
            type: "string",
            nullable: true
        },
        model: {
            type: "string",
            nullable: true
        },
        host: {
            pattern: "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$",
            type: "string",
            nullable: true
        },
        port: {
            maximum: 65535,
            minimum: 0,
            type: "integer",
            format: "int32"
        },
        password: {
            type: "string",
            nullable: true
        },
        hubPort: {
            type: "integer",
            format: "int32"
        },
        vintSerial: {
            type: "integer",
            format: "int32"
        },
        interval: {
            type: "integer",
            format: "int32"
        },
        watch: {
            type: "boolean"
        },
        fetchedData: {
            type: "object",
            additionalProperties: {
                type: "boolean"
            },
            nullable: true
        }
    },
    additionalProperties: false
};

const config = {
    // for error messages...
    errMessages: {
        port: {
            required: "A person must have an age",
        },
        email: {
            format: "Must be a v4 ip",
        },
    },
};

// const yupSchema = buildSchema(jsonSchema, { types });
// const yupSchema = buildYup(schema, config);

const Form = ({data}) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [updateDevice, { isLoading: isUpdating, error }] = useUpdateDeviceMutation()

    useEffect(()=> {

        console.log("chargement des données:",data)
    },[data]);



    const handleCreateInvoiceSuccess = () => {
        enqueueSnackbar(t('Device successfully updated'), {
            variant: 'success',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            },
            TransitionComponent: Zoom
        });

    };
    const handleUpdateDeviceFailure = (message) => {
        enqueueSnackbar(message, {
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
            initialValues={data}
            onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting, errors }
            ) => {
                try {
                    console.log("submitting...")
                    const device = _values;
                    await updateDevice(device).unwrap();
                    await wait(1000);
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    handleCreateInvoiceSuccess();
                    navigate("/dashboards/devices");
                } catch (err) {
                    const {status} = err.data;
                    if (status === 400){
                        const {errors} = err.data;
                        // On adapte le format des errors pour Formik
                        const formikErrors = _.mapValues(_.mapKeys(errors, (v,k)=>_.camelCase(k)),(x) => x[0]);
                        setErrors({ device: formikErrors});
                    }
                    else if (status === 401){
                        handleUpdateDeviceFailure(t("Operation not allowed"));
                    }
                    else
                        handleUpdateDeviceFailure(t("An error occured"));
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
                  setFieldValue,
                  resetForm
              }) => (
                <form onSubmit={handleSubmit}>
                    <Card>
                      <CardHeader
                          avatar={<EditIcon/>}
                        title={values.brand}
                        subheader={values.model}
                      />
                      <CardContent>
                          <Grid container spacing={3}>
                              <Grid item xs={12} md={6} lg={4}>
                                  <Box pb={1}>
                                      <b>{t('Host')}:</b>
                                  </Box>
                                  <TextField
                                      error={Boolean(touched.host && errors.host)}
                                      fullWidth
                                      helperText={touched.host && errors.host}
                                      name="host"
                                      placeholder={t('Host of the device')}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={values.host || undefined}
                                      variant="outlined"
                                  />
                              </Grid>
                              <Grid item xs={12} md={6} lg={4}>
                                  <Box pb={1}>
                                      <b>{t('Port')}:</b>
                                  </Box>
                                  <TextField
                                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                      error={Boolean(touched.port && errors.port)}
                                      fullWidth
                                      helperText={touched.port && errors.port}
                                      name="port"
                                      placeholder={t('Port of the device')}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={values.port || undefined}
                                      variant="outlined"
                                  />
                              </Grid>
                              <Grid item xs={12} md={6} lg={4}>
                                  <Box pb={1}>
                                      <b>{t('Password')}:</b>
                                  </Box>
                                  <TextField
                                      error={Boolean(touched.password && errors.password)}
                                      fullWidth
                                      helperText={touched.password && errors.password}
                                      name="password"
                                      placeholder={t('Password of the device')}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={values.password || undefined}
                                      variant="outlined"
                                  />
                              </Grid>
                              <Grid item xs={12} md={6} lg={4}>
                                  <Box pb={1}>
                                      <b>{t('Serial number')}:</b>
                                  </Box>
                                  <TextField
                                      error={Boolean(touched.vintSerial && errors.vintSerial)}
                                      fullWidth
                                      helperText={touched.vintSerial && errors.vintSerial}
                                      name="vintSerial"
                                      placeholder={t('Serial number of the device')}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={values.vintSerial || undefined}
                                      variant="outlined"
                                  />
                              </Grid>
                              <Grid item xs={12} md={6} lg={4}>
                                  <Box pb={1}>
                                      <b>{t('Interval')}:</b>
                                  </Box>
                                  <TextField
                                      error={Boolean(touched.interval && errors.interval)}
                                      fullWidth
                                      helperText={touched.interval && errors.interval}
                                      name="interval"
                                      placeholder={t('Fetching interval')}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={values.interval || undefined}
                                      variant="outlined"
                                  />
                              </Grid>
                              <Grid item xs={12} md={6} lg={4}>
                                  <Box pb={1}>
                                      <b>{t('Metrics')}:</b>
                                  </Box>
                                  <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                      <FormGroup>
                                          <Stack spacing={1}>
                                              {values.fetchedData && Object.entries(values.fetchedData).map(([key, value], index) =>
                                                  <Chip
                                                      key = {key}
                                                      name={`fetchedData.${key}`}
                                                      label={key}
                                                      onClick={()=>{setFieldValue(`fetchedData.${key}`,!values.fetchedData[key])}}
                                                      variant={values.fetchedData[key]?"filled":"outlined"}
                                                      color="primary"
                                                      size="small"
                                                  />
                                              )}
                                          </Stack>
                                      </FormGroup>
                                      <FormHelperText>{touched.fetchedData && errors.fetchedData}</FormHelperText>
                                  </FormControl>
                              </Grid>
                          </Grid>
                      </CardContent>
                      <CardActions>
                          <Button
                            fullWidth={mobile}
                            disabled={isSubmitting}
                            variant="outlined"
                            size="large"
                            onClick={()=>{
                                resetForm();
                                navigate("/dashboards/devices");
                            }}
                          >
                              {t('Cancel')}
                          </Button>
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
                      </CardActions>
                  </Card>
                </form>

            )}
        </Formik>
    )
}

export default Form