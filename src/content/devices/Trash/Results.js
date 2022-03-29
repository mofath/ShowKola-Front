import {useState, forwardRef, useCallback, useEffect} from 'react';

import PropTypes from 'prop-types';
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom';
import numeral from 'numeral';

import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Grid,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  TextField,
  Button,
  Typography,
  Dialog,
  FormControl,
  Select,
  InputLabel,
  Zoom,
  InputAdornment,
  styled, useTheme, Skeleton
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSnackbar } from 'notistack';
import {
  useDeleteDevicesMutation,
  useDeleteOneDeviceMutation,
  usePatchDeviceMutation,
  usePatchDevicesMutation
} from "src/utils/api";
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import Label from 'src/components/Label';
import moment from "moment";
import RestoreFromTrashTwoToneIcon from '@mui/icons-material/RestoreFromTrashTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import BulkActions from './BulkActions';


const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const getInvoiceStatusLabel = (invoiceStatus) => {
  const map = {
    pending: {
      text: 'Pending Payment',
      color: 'warning'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    },
    draft: {
      text: 'Draft',
      color: 'info'
    },
    progress: {
      text: 'In progress',
      color: 'primary'
    }
  };

  const { text, color } = map[invoiceStatus];

  return (
    <Label color={color}>
      <b>{text}</b>
    </Label>
  );
};

const applyPagination = (invoices, page, limit) => {
  return invoices.slice(page * limit, page * limit + limit);
};

const Results = ({ devices, isLoading, isError, initialError }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDevicesId, setSelectedDevicesId] = useState([]);
  const [patchDevice] = usePatchDeviceMutation();
  const [patchDevices] = usePatchDevicesMutation();
  const [deleteDevices] = useDeleteDevicesMutation();
  const [deleteOneDevice] = useDeleteOneDeviceMutation();
  const selectedBulkActions = selectedDevicesId.length > 0;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    status: null
  });
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [devicesToDelete, setDevicesToDelete] = useState([]);
  const [devicesToRestore, setDevicesToRestore] = useState([]);

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: t('Completed')
    },
    {
      id: 'pending',
      name: t('Pending')
    },
    {
      id: 'failed',
      name: t('Failed')
    }
  ];

  const selectedDevices = !isLoading ? devices.filter(x => selectedDevicesId.includes(x.id)) : [];

  const handleEditClick = useCallback((id) => navigate(`/devices/${id}/edit`, {replace: false}), [navigate]);

  useEffect(()=>{
    // Lorsqu'un device est supprimé, on mets à jour la liste des devices selectionnés, pour éventuellement l'enlever
    selectedDevicesId.forEach((selectedDevice) =>{
      if (!devices.some(x => x.id === selectedDevice)){
        setSelectedDevicesId((prevSelected) =>
            prevSelected.filter((id) => id !== selectedDevice)
        );
      }
    })
  },[devices])

  const handleConfirmDelete = (deviceId) => {
    setDevicesToDelete([deviceId]);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setDevicesToDelete([]);
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
// Si on supprime 1 seul device
    if (devicesToDelete.length === 1){
      deleteOneDevice(devicesToDelete[0]).unwrap()
          .then(()=>{
            setOpenConfirmDelete(false);
            setDevicesToDelete([]);

            enqueueSnackbar(t('Delete action completed successfully'), {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },
              TransitionComponent: Zoom
            });
          })
          .catch(() => handleUpdateDeviceFailure("An error occured"));
    }
    // Si on supprime plusieurs devices
    else if (devicesToDelete.length > 1){
      deleteDevices(devicesToDelete).unwrap()
          .then((response)=>{
            setOpenConfirmDelete(false);
            setDevicesToDelete([]);
            console.log(response);
            enqueueSnackbar(t('Delete action completed successfully'), {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },
              TransitionComponent: Zoom
            });
          })
          .catch(() => handleUpdateDeviceFailure("An error occured"));

    }


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

  const handleStatusChange = (e) => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handleSelectAllDevices = (event) => {
    setSelectedDevicesId(
        event.target.checked
            ? devices.map((device) => device.id)
            : []
    );
  };

  const handleSelectOneDevice = (event, deviceId) => {
    if (!selectedDevicesId.includes(deviceId)) {
      setSelectedDevicesId((prevSelected) => [
        ...prevSelected,
        deviceId
      ]);
    } else {
      setSelectedDevicesId((prevSelected) =>
          prevSelected.filter((id) => id !== deviceId)
      );
    }
  };

  const handleDeviceWatchValueChanged = (event, device) => {
    const patchOperation = [{
      op: "replace",
      path: "/watch",
      value: event.target.checked
    }]
    if(selectedDevicesId.length === 0 || !selectedDevicesId.includes(device.id)){

      patchDevice({device, body: patchOperation}).unwrap()
          .catch(() => handleUpdateDeviceFailure("An error occured"));
    }
    else {
      const body = selectedDevicesId.reduce(
          (obj, item) => Object.assign(obj, { [item]: patchOperation }), {});
      patchDevices({body, selectedDevices}).unwrap()
          .then((response)=>{
            // Déclarer un message d'erreur si problème sur un des objets
            if (response.some(x => !x.success))
              handleUpdateDeviceFailure("An error occured");

          })
          .catch(() => handleUpdateDeviceFailure("An error occured"));
    }

  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedDevices = applyPagination(
      devices,
      page,
      limit
  );
  const selectedSomeDevices =
      selectedDevicesId.length > 0 &&
      selectedDevicesId.length < devices.length;
  const selectedAllDevices =
      selectedDevicesId.length === devices.length;
  const theme = useTheme();

  const displayUtcDate = (date) => {
    if (date === null)
      return t('Never')
    if (moment(date).isAfter(moment().subtract(1, 'hours')))
      return moment(date).fromNow();
    if (moment(date).isSame(moment(),"day"))
      return moment(date,"day");
    return moment(date).local().format(t('YYYY-MM-DD HH:mm:ss'));
  }

  const handleRestoreDevice = (deviceId) => {
    setDevicesToRestore([deviceId]);
  }
  const handleBulkRestore = () => {
    if (selectedBulkActions)
      setDevicesToRestore(selectedDevicesId);
  }
  // Appliquer la restauration des devices
  useEffect(()=>{
    const patchOperation = [{
      op: "replace",
      path: "/isDeleted",
      value: false
    }];
    if (devicesToRestore.length === 1){
      const deviceToRestore = devices.find(x => x.id === devicesToRestore[0]);
      patchDevice({device: deviceToRestore, body: patchOperation}).unwrap()
          .then(()=>{
            setDevicesToRestore([]);

            enqueueSnackbar(t('Restore action completed successfully'), {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },
              TransitionComponent: Zoom
            });
          })
          .catch(() => handleUpdateDeviceFailure("An error occured"));
    }
    else if (devicesToRestore.length > 1){
      const body = devicesToRestore.reduce(
          (obj, item) => Object.assign(obj, { [item]: patchOperation }), {});
      patchDevices({body, selectedDevices}).unwrap()
          .then((response)=>{
            setDevicesToRestore([]);
            enqueueSnackbar(t('Restore action completed successfully'), {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },
              TransitionComponent: Zoom
            });
          })
          .catch(() => handleUpdateDeviceFailure("An error occured"));
    }
  },[devicesToRestore])

  const handleBulkDelete = () => {
    if (selectedBulkActions)
      setDevicesToDelete(selectedDevicesId);
    setOpenConfirmDelete(true);
  }

  return (
    <>
      <Card>
        <Box pl={2} display="flex" alignItems="center">
          {selectedBulkActions && (
            <Box flex={1} p={2}>
              <BulkActions
                  handleBulkDelete={handleBulkDelete}
                  handleBulkRestore={handleBulkRestore}
              />
            </Box>
          )}
          {!selectedBulkActions && (
            <Box
              flex={1}
              p={2}
              display={{ xs: 'block', sm: 'flex' }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography component="span" variant="subtitle1">
                  {t('Showing')}:
                </Typography>{' '}
                <b>{paginatedDevices.length}</b> <b>{t('devices')}</b>
              </Box>
              <TablePagination
                component="div"
                count={devices.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          )}
        </Box>
        <Divider />

        {initialError || (! isLoading &&  paginatedDevices.length === 0) ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {initialError? t("An error occured") : t("No Devices in trash")}
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Checkbox
                        checked={selectedAllDevices}
                        indeterminate={selectedSomeDevices}
                        onChange={handleSelectAllDevices}
                    /></TableCell>
                    <TableCell>{t('Model')}</TableCell>
                    <TableCell>{t('Host')}</TableCell>
                    <TableCell>{t('Deleted time')}</TableCell>
                    <TableCell align="center">{t('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                {!initialError && isLoading ?
                    (
                        <TableBody>
                          {[...Array(limit)].map((e, index) =>
                              <TableRow key={index}>
                                <TableCell padding="checkbox">
                                  <Skeleton/>
                                </TableCell>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell align="right"><Skeleton/></TableCell>
                              </TableRow>
                          )}
                        </TableBody>
                    ) :
                    (
                        <TableBody>
                          {paginatedDevices.map((device) => {
                            const isDeviceSelected = selectedDevicesId.includes(
                                device.id
                            );
                            return (
                                <TableRow
                                    hover
                                    key={device.id}
                                    selected={isDeviceSelected}
                                >
                                  <TableCell>
                                    <Checkbox
                                        checked={isDeviceSelected}
                                        onChange={(event) =>
                                            handleSelectOneDevice(event, device.id)
                                        }
                                        value={isDeviceSelected}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="h5">
                                      {device.brand}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                      {device.model}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        color="text.primary"
                                        gutterBottom
                                        noWrap
                                    >
                                      {device.host}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography noWrap>
                                      {displayUtcDate(device.deletedTimeStamp)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography noWrap>
                                      <Tooltip title={t('Restore')} arrow>
                                        <IconButton
                                            onClick={() => handleRestoreDevice(device.id)}
                                            color="primary"
                                        >
                                          <RestoreFromTrashTwoToneIcon fontSize="small"/>
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title={t('Delete')} arrow>
                                        <IconButton
                                            onClick={() => handleConfirmDelete(device.id)}
                                            color="error"
                                        >
                                          <DeleteForeverTwoToneIcon fontSize="small"/>
                                        </IconButton>
                                      </Tooltip>
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                            );
                          })}
                        </TableBody>
                    )
                }
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                count={devices.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          </>
        )}
      </Card>

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Do you really want to delete this device')}?
          </Typography>

          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {t("You won't be able to revert after deletion")}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

Results.propTypes = {
  devices: PropTypes.array.isRequired
};

Results.defaultProps = {
  devices: []
};

export default Results;
