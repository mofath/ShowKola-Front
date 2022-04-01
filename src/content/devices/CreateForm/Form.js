import React, {useEffect, useState} from 'react';
import * as Yup from "yup";
import wait from 'src/utils/wait';
import {
    Box, Button, Card, CardActions, CardContent, CardHeader,
    Chip, CircularProgress,
    FormControl, FormGroup, FormHelperText,
    Grid, IconButton, lighten, Slide, Stack, Step, StepLabel, Stepper,
    TextField, Typography, useMediaQuery, useTheme, Zoom
} from "@mui/material";
import {Formik} from "formik";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {styled} from "@mui/material/styles";
import {useCreateDeviceMutation, useUpdateDeviceMutation} from 'src/utils/api';
import _ from "lodash";
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

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

const createDeviceValidationSchema=
    [
        Yup.object().shape({
            brand: Yup.string()
                .required('Brand required'),
            model: Yup.string()
                .required('Model required'),
            }),
        Yup.object().shape({
            host: Yup.string()
                .required('Host required')
                .matches('^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$','must be valid ip v4 address'),
            port: Yup.number()
                .required('Port number required')
                .min(0, "Port must be between 0 and 65535")
                .max(65535, "Port must be between 0 and 65535"),
            password: Yup.string(),
            vintSerial: Yup.string(),
        }),
        Yup.object().shape({
            interval: Yup.string()
                .required('Interval required')
                .matches('^\\d{2}:([0-5][0-9]):([0-5][0-9])$', 'format must be hh:mm:ss'),
        }),
];

const formInitialValues = {
    brand: "",
    model: "",
    host: "",
    port: "",
    password: "",
    vintSerial: "",
    interval: "",
    fetchedData: {}
}

const steps = ['Device Model', 'Network Configuration', 'Metrics'];

const Form = ({models}) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [createDevice, { isLoading: isUpdating, error }] = useCreateDeviceMutation()
    const [activeStep, setActiveStep] = useState(0)
    const isLastStep = activeStep === steps.length - 1;
    const [displayState, setDisplayState] = useState(0);
    const [trigger, setTrigger] = useState(true)

    const currentValidationSchema = createDeviceValidationSchema[activeStep];

    // Les deux useEffect suivant permettent de gerer la transition entre deux étapes du formulaire
    useEffect(()=>{
        if(trigger)
            setDisplayState(activeStep)

    },[trigger])

    useEffect(()=>{
        if(!trigger)
            setDisplayState(null)
    },[activeStep])

    const handleSuccess = (message) => {
        enqueueSnackbar(t(message), {
            variant: 'success',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            },
            TransitionComponent: Zoom
        });

    };

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

    return(
        <Formik
            initialValues={formInitialValues}
            validationSchema={currentValidationSchema}
            onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting, errors }
            ) => {
                if (isLastStep){
                    try {
                        console.log("submitting...")
                        const device = _values;
                        await createDevice(device).unwrap();
                        await wait(1000);
                        resetForm();
                        setStatus({ success: true });
                        setSubmitting(false);
                        handleSuccess("Device added to ShowKola");
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
                            handleFailure(t("Operation not allowed"));
                        }
                        else
                            handleFailure(t("An error occured"));
                        setStatus({ success: false });
                        setSubmitting(false);
                    }
                }
                else
                    setActiveStep(activeStep + 1);

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
                  resetForm,
                  isValid,
                dirty
              }) => (
                <form onSubmit={handleSubmit}>
                    <Card>
                      <CardHeader
                          avatar={<EditIcon/>}
                          title={<Typography variant="h4">{t('Add device')}</Typography>}
                      />
                      <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stepper activeStep={activeStep}>
                                    {steps.map(label => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Grid>
                              <Grid item xs={12}>
                                  <Slide direction="left"
                                         in={displayState===0}
                                         mountOnEnter unmountOnExit
                                         addEndListener = {()=>setTrigger(!trigger)}
                                  >
                                      <Box>
                                          <Step1
                                              activeStep={activeStep}
                                              touched= {touched}
                                              handleBlur= {handleBlur}
                                              handleChange= {handleChange}
                                              values= {values}
                                              errors={errors}
                                              models={models}
                                              setFieldValue = {setFieldValue}
                                          />
                                      </Box>
                                  </Slide>
                                  <Slide
                                      direction="left"
                                      in={displayState===1}
                                      mountOnEnter
                                      unmountOnExit
                                      addEndListener = {()=>setTrigger(!trigger)}
                                  >
                                      <Box>
                                          <Step2
                                              activeStep={activeStep}
                                              touched= {touched}
                                              handleBlur= {handleBlur}
                                              handleChange= {handleChange}
                                              values= {values}
                                              errors={errors}
                                              models={models}
                                              setFieldValue = {setFieldValue}
                                          />
                                      </Box>
                                  </Slide>
                                  <Slide direction="left"
                                         in= {displayState===2}
                                         mountOnEnter unmountOnExit
                                         setFieldValue = {setFieldValue}
                                         addEndListener = {()=>setTrigger(!trigger)}
                                  >
                                      <Box>
                                          <Step3
                                              activeStep={activeStep}
                                              touched= {touched}
                                              handleBlur= {handleBlur}
                                              handleChange= {handleChange}
                                              values= {values}
                                              errors={errors}
                                              models={models}
                                              setFieldValue = {setFieldValue}
                                          />
                                      </Box>
                                  </Slide>


                              </Grid>
                          </Grid>
                      </CardContent>
                      <CardActions>
                          <Grid container columnSpacing={1} justifyContent="space-between">
                              <Grid item>
                                  <Button
                                      disabled={activeStep===0 || isSubmitting}
                                      fullWidth={mobile}
                                      variant="outlined"
                                      size="large"
                                      onClick={()=>{
                                          setActiveStep(activeStep - 1);
                                      }}
                                  >
                                      {t('Previous')}
                                  </Button>
                              </Grid>
                              <Grid item>
                                  <Stack spacing={1} direction="row">
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
                                          disabled={!(isValid && dirty)  || isSubmitting}
                                          variant="contained"
                                          size="large"
                                      >
                                          {isLastStep? t('Apply changes') : t('Next')}
                                      </Button>
                                  </Stack>
                              </Grid>
                          </Grid>

                      </CardActions>
                  </Card>
                </form>

            )}
        </Formik>
    )
}

export default Form