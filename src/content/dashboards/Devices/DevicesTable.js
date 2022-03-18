import {forwardRef, useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader, Skeleton, Switch, Zoom, Button, styled, Dialog, Avatar, Slide
} from '@mui/material';
import moment from 'moment';
import Label from 'src/components/Label';
import { useTranslation } from 'react-i18next';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from 'src/content/devices/BulkActions';
import {useNavigate} from "react-router-dom";
import {useDeleteOneDeviceMutation, usePatchDeviceMutation, usePatchDevicesMutation} from "src/utils/api";
import {useSnackbar} from "notistack";
import CloseIcon from "@mui/icons-material/Close";

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

const getStatusLabel = (deviceStatus) => {
  const map = {
    failed: {
      text: 'Failed',
      color: 'error'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    },
    pending: {
      text: 'Pending',
      color: 'warning'
    }
  };

  const { text, color } = map[deviceStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (devices, filters) => {
  return devices.filter((devices) => {
    let matches = true;

    if (filters.status && devices.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (devices, page, limit) => {
  return devices.slice(page * limit, page * limit + limit);
};

const DevicesTable = ({ devices, isLoading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDevicesId, setSelectedDevicesId] = useState([]);
  const [patchDevice] = usePatchDeviceMutation();
  const [patchDevices] = usePatchDevicesMutation();
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
    else if (devicesToDelete.length > 1){
      const patchOperation = [{
        op: "replace",
        path: "/isDeleted",
        value: true
      }];
      const body = devicesToDelete.reduce(
          (obj, item) => Object.assign(obj, { [item]: patchOperation }), {});

      patchDevices(body).unwrap()
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

  const handleBulkDelete = () => {
    if (selectedBulkActions)
      setDevicesToDelete(selectedDevicesId);
      setOpenConfirmDelete(true);
  }

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

  const filteredDevices = applyFilters(devices, filters);
  const paginatedDevices = applyPagination(
    filteredDevices,
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

  return (
    <>
      <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions handleBulkDelete={handleBulkDelete} />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{t('Status')}</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label={t('Status')}
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title={t('Devices')}
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllDevices}
                  indeterminate={selectedSomeDevices}
                  onChange={handleSelectAllDevices}
                />
              </TableCell>
              <TableCell>{t('Device brand')}</TableCell>
              <TableCell>{t('Device IP')}</TableCell>
              <TableCell>{t('Last connection')}</TableCell>
              <TableCell>{t('Monitor')}</TableCell>
              <TableCell align="right">{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          {isLoading?
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
                          <TableCell><Skeleton/></TableCell>
                          <TableCell align="right"><Skeleton/></TableCell>
                        </TableRow>
                    )}
                  </TableBody>
              ):
              (
                    <TableBody>
                {paginatedDevices.map((device) => {
                  const isDeviceSelected = selectedDevicesId.includes(
                      device.id
                  );
                  return (

                        <TableRow
                            hover
                            selected={isDeviceSelected}
                            key={device.id}
                        >
                          <TableCell padding="checkbox">
                          <Checkbox
                              color="primary"
                              checked={isDeviceSelected}
                              onChange={(event) =>
                                  handleSelectOneDevice(event, device.id)
                              }
                              value={isDeviceSelected}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                              variant="body1"
                              fontWeight="bold"
                              color="text.primary"
                              gutterBottom
                              noWrap
                          >
                            {device.brand}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
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
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {device.port}
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
                            {displayUtcDate(device.lastOnlineStatusTimeStamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Switch
                              checked={device.watch}
                              onChange={(event)=>handleDeviceWatchValueChanged(event, device)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={t('Edit Order')} arrow>
                            <IconButton
                                sx={{
                                  '&:hover': {
                                    background: theme.colors.primary.lighter
                                  },
                                  color: theme.palette.primary.main
                                }}
                                color="inherit"
                                size="small"
                                onClick={()=>handleEditClick(device.id)}
                            >
                              <EditTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('Delete Order')} arrow>
                            <IconButton
                                sx={{
                                  '&:hover': { background: theme.colors.error.lighter },
                                  color: theme.palette.error.main
                                }}
                                color="inherit"
                                size="small"
                                onClick={()=>handleConfirmDelete(device.id)}
                            >
                              <DeleteTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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
          count={filteredDevices.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
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
            {t('Do you really want to delete this invoice')}?
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

DevicesTable.propTypes = {
  devices: PropTypes.array.isRequired
};

DevicesTable.defaultProps = {
  devices: []
};

export default DevicesTable;
