import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,Button
} from '@mui/material';

const AppointmentsList = () => {
  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1>List of Appointments</h1>
        <div className="doctorsList">
        <TableContainer component={Paper} className="table-container">
        <Table className="table">
            <TableHead className="table-header">
            <TableRow>
                <TableCell className="table-header-cell">ID</TableCell>
                <TableCell className="table-header-cell">Name</TableCell>
                <TableCell className="table-header-cell">Email</TableCell>
                <TableCell className="table-header-cell">Age</TableCell>
                <TableCell className='table-header-cell'>Actions</TableCell>
            </TableRow>
            </TableHead>
            <TableBody className="table-body">
            <TableRow  className="table-row">
              <TableCell className="table-cell">1</TableCell>
              <TableCell className="table-cell">Asbar</TableCell>
              <TableCell className="table-cell">asbar735@gmail.com</TableCell>
              <TableCell className="table-cell">21</TableCell>
              <TableCell className='table-cell'>
                <Button className='action-btn' variant='contained'>Cancel</Button>
                <Button className='action-btn' variant='contained'>Approve</Button>
              </TableCell>
            </TableRow>
        </TableBody>
            </Table>
        </TableContainer>

        </div>
      </div>
    </div>
  )
}

export default AppointmentsList