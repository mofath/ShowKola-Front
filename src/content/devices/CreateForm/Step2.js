import {Box, Grid, TextField} from "@mui/material";
import {t} from "i18next";

const Step2 = ({touched, handleBlur, handleChange, values, errors, models, setFieldValue}) => {

    return(
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
                    value={values.host}
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
                    value={values.port}
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
                    value={values.password}
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
                    value={values.vintSerial}
                    variant="outlined"
                />
            </Grid>
        </Grid>
    )
}

export default Step2;