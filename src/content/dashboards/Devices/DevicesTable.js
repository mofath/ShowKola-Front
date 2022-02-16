import {useCallback, useState} from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
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
  CardHeader, Skeleton
} from '@mui/material';
import moment from 'moment';
import Label from 'src/components/Label';
import { useTranslation } from 'react-i18next';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from 'src/content/management/Products/BulkActions';
import {useNavigate} from "react-router-dom";

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
  console.log("devices", devices)
  return devices.slice(page * limit, page * limit + limit);
};

const DevicesTable = ({ devices, isLoading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDevices, setSelectedDevices] = useState([]);
  const selectedBulkActions = selectedDevices.length > 0;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    status: null
  });

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

  const handleEditClick = useCallback((id) => navigate(`/devices/${id}/edit`, {replace: false}), [navigate]);

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
    setSelectedDevices(
      event.target.checked
        ? devices.map((device) => device.id)
        : []
    );
  };

  const handleSelectOneDevice = (event, deviceId) => {
    if (!selectedDevices.includes(deviceId)) {
      setSelectedDevices((prevSelected) => [
        ...prevSelected,
        deviceId
      ]);
    } else {
      setSelectedDevices((prevSelected) =>
        prevSelected.filter((id) => id !== deviceId)
      );
    }
  };

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
    selectedDevices.length > 0 &&
    selectedDevices.length < devices.length;
  const selectedAllDevices =
    selectedDevices.length === devices.length;
  const theme = useTheme();

  const displayUtcDate = (date) => {
    if (moment(date).isAfter(moment().subtract(1, 'hours')))
      return moment(date).fromNow();
    if (moment(date).isSame(moment(),"day"))
      return moment(date,"day");
    return moment(date).local().format(t('YYYY-MM-DD HH:mm:ss'));
  }

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
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
                          <TableCell align="right"><Skeleton/></TableCell>
                        </TableRow>
                    )}

                  </TableBody>
              ):
              (
                  <TableBody>
                {paginatedDevices.map((device) => {
                  const isDeviceSelected = selectedDevices.includes(
                      device.id
                  );
                  return (
                      <TableRow
                          hover
                          key={device.id}
                          selected={isDeviceSelected}
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
  );
};

DevicesTable.propTypes = {
  devices: PropTypes.array.isRequired
};

DevicesTable.defaultProps = {
  devices: []
};

export default DevicesTable;
