import {Autocomplete, Box, Grid, TextField} from "@mui/material";
import {t} from "i18next";
import {useFormikContext} from "formik";
import {useEffect} from "react";

const Step1 = ({touched, handleBlur, handleChange, values, errors, models, setFieldValue}) => {
    return(
        <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
                <Box pb={1}>
                    <b>{t('Brand')}:</b>
                </Box>
                <Autocomplete
                    error={touched.brand && errors.brand}
                    fullWidth
                    helpertext={touched.brand && errors.brand}
                    name="brand"
                    options={Object.keys(models)}
                    onBlur={handleBlur}
                    onChange={(e, value)=> {
                        setFieldValue("brand", value);
                        setFieldValue("model",models[value] ? models[value][0].model : null);
                    }}
                    value={values.brand || null}
                    variant="outlined"
                    renderInput={(params) => <TextField {...params} label="Brand" />}
                    disableClearable
                />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <Box pb={1}>
                    <b>{t('Model')}:</b>
                </Box>
                <Autocomplete
                    error={touched.model && errors.model}
                    fullWidth
                    helpertext={touched.model && errors.model}
                    name="model"
                    options={values.brand? models[values.brand].map(x => x.model) : []}
                    placeholder={t('Model of the device')}
                    onBlur={handleBlur}
                    onChange={(e, value)=>
                        setFieldValue("model", value)
                    }
                    value={models[values.brand] && models[values.brand].map(x => x.model).includes(values.model) ? values.model : null}
                    variant="outlined"
                    renderInput={(params) => <TextField {...params} label="Model" />}
                    disableClearable
                    autoComplete
                    disabled = {!values.brand}
                />
                <AutoFillFetchedDataContext models={models}/>
            </Grid>
        </Grid>
    )
}

const AutoFillFetchedDataContext = ({models}) => {
    const {values, setFieldValue} = useFormikContext();

    useEffect(()=>{
        if(typeof(values.brand) !== "undefined" && values.model)
            setFieldValue("fetchedData", models[values.brand].find(x => x.model === values.model).fetchedData);
    },[values.model]);

    return null
}

export default Step1;