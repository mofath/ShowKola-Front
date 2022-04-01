import {Box, Chip, FormControl, FormGroup, FormHelperText, Grid, Stack, TextField} from "@mui/material";
import {t} from "i18next";
import {TimePicker} from "@mui/lab";



const Step2 = ({touched, handleBlur, handleChange, values, errors, models, setFieldValue}) => {

    const handleIntervalValue = (value) => {
        if (value.length < 2)
            return value;
        else if (value.length ===3 )
            return `:${value}`

        return value;
    }

    return(
        <>
            <Grid item xs={12} md={6} lg={4}>
                <Box pb={1}>
                    <b>{t('Interval (hh:mm:ss)')}:</b>
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
        </>
    )
}

export default Step2;