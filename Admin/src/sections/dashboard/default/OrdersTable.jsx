import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { updateAppointment } from '../../../api/services';

// project imports
// import Dot from 'components/@extended/Dot'; // Removed as we use background color

function createData(id, patientName, doctorName, date, time, status) {
  return { id, patientName, doctorName, date, time, status };
}

const initialRows = [
  // createData(845645, 'Jame Cameron', 'Dr. Smith', '2023-01-05', '10:00 AM', 0),
  // createData(987645, 'John Doe', 'Dr. Jones', '2023-01-05', '11:00 AM', 1),
  // createData(987563, 'John Doe', 'Dr. Brown', '2023-01-06', '09:30 AM', 2),
  // createData(986523, 'John Doe', 'Dr. White', '2023-01-06', '02:00 PM', 3),
  // createData(132865, 'John Doe', 'Dr. Green', '2023-01-07', '10:15 AM', 1),
  // createData(867396, 'John Doe', 'Dr. Black', '2023-01-07', '11:45 AM', 0),
  // createData(132564, 'John Doe', 'Dr. Gray', '2023-01-08', '04:00 PM', 2),
  // createData(987532, 'John Doe', 'Dr. Blue', '2023-01-08', '05:30 PM', 2),
  // createData(987532, 'John Doe', 'Dr. Red', '2023-01-09', '09:00 AM', 1),
  // createData(987532, 'John Doe', 'Dr. Orange', '2023-01-10', '03:20 PM', 0)
];

// Map API status strings to numeric values used by the status dropdown
const statusStringToNumber = {
  'Booked': 0,
  'Scheduled': 1,
  'Completed': 2,
  'Cancelled': 3
};

// Map numeric status values back to API status strings
const statusNumberToString = {
  0: 'Booked',
  1: 'Scheduled',
  2: 'Completed',
  3: 'Cancelled'
};

// Map API response data to the row shape expected by the table
function mapApiDataToRows(apiData) {
  return apiData.map((item) => ({
    id: item.appointmentID,
    patientName: item.fullName,
    doctorName: item.doctorName || 'N/A',
    rawAppointmentDate: item.appointmentDate || '',
    appointmentDate: item.appointmentDate ? item.appointmentDate.split(' ')[0] : 'N/A',
    time: item.appointmentDate ? item.appointmentDate.split(' ')[1] : 'N/A',
    status: typeof item.appointmentStatus === 'string'
      ? (statusStringToNumber[item.appointmentStatus] ?? 0)
      : item.appointmentStatus
  }));
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: '#ID'
  },
  {
    id: 'patientName',
    align: 'left',
    disablePadding: true,
    label: 'Patient Name'
  },
  {
    id: 'doctorName',
    align: 'left',
    disablePadding: false,
    label: 'Doctor Name'
  },
  {
    id: 'date',
    align: 'left',
    disablePadding: false,
    label: 'Date'
  },
  // {
  //   id: 'time',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'Time'
  // },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  }
];

// ==============================|| APPOINTMENT TABLE - HEADER ||============================== //

function AppointmentTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

AppointmentTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

function AppointmentStatus({ status, onChange }) {
  let color;
  let bgcolor;

  switch (status) {
    case 0:
      bgcolor = 'info.lighter';
      color = 'info.main';
      break;
    case 1:
      bgcolor = 'warning.lighter';
      color = 'warning.main';
      break;
    case 2:
      bgcolor = 'success.lighter';
      color = 'success.main';
      break;
    case 3:
      bgcolor = 'error.lighter';
      color = 'error.main';
      break;
    default:
      bgcolor = 'primary.lighter';
      color = 'primary.main';
  }

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={status}
        onChange={onChange}
        variant="outlined"
        sx={{
          color: color,
          bgcolor: bgcolor,
          borderRadius: 1,
          '& .MuiSelect-select': {
            py: 0.75,
            px: 2
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .MuiSvgIcon-root': {
            color: color
          }
        }}
      >
        <MenuItem value={0}>Booked</MenuItem>
        <MenuItem value={1}>Scheduled</MenuItem>
        <MenuItem value={2}>Completed</MenuItem>
        <MenuItem value={3}>Cancelled</MenuItem>
      </Select>
    </FormControl>
  );
}

AppointmentStatus.propTypes = {
  status: PropTypes.number,
  onChange: PropTypes.func
};

// ==============================|| APPOINTMENT TABLE ||============================== //

export default function AppointmentsTable({ appointmentsData }) {
  const [order] = useState('asc');
  const [orderBy] = useState('id');
  const [rows, setRows] = useState(initialRows);
  const { enqueueSnackbar } = useSnackbar();

  // Sync rows with prop data whenever appointmentsData changes
  useEffect(() => {
    if (appointmentsData && appointmentsData.length > 0) {
      setRows(mapApiDataToRows(appointmentsData));
    }
  }, [appointmentsData]);

  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.value;
    const statusString = statusNumberToString[newStatus];

    // Find the row to get the raw appointment date
    const targetRow = rows.find((row) => row.id === id);
    const appointmentDate = targetRow?.rawAppointmentDate || '';

    // Optimistic UI update
    const previousRows = [...rows];
    setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, status: newStatus } : row)));

    try {
      await axios.put(`${'https://aliceblue-grasshopper-530447.hostingersite.com/api/appointments'}?id=${id}`, {
        appointmentDate,
        appointmentStatus: statusString
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      enqueueSnackbar(`Appointment status updated to "${statusString}"`, { variant: 'success' });
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update status. Please try again.';
      enqueueSnackbar(errorMsg, { variant: 'error' });
      // Revert on failure
      setRows(previousRows);
    }
  };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <AppointmentTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary">{"#" + row.id || "NA"}</Link>
                  </TableCell>
                  <TableCell>{row.patientName || "NA"}</TableCell>
                  <TableCell>{"Dr. Praveen Reddy"}</TableCell>
                  <TableCell>{row.appointmentDate || "NA"}</TableCell>
                  {/* <TableCell>{row.time || "NA"}</TableCell> */}
                  <TableCell>
                    <AppointmentStatus status={row.status} onChange={(e) => handleStatusChange(row.id, e)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

AppointmentsTable.propTypes = {
  appointmentsData: PropTypes.array
};

