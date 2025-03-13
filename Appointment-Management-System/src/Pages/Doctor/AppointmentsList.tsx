import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,Button
} from '@mui/material';
import { useQuery,gql } from '@apollo/client';

const get_Appointments = gql`
query GetAppointments{
    getAppointments{
      patient_name,patient_email,patient_location,patient_disease,patient_selecteddoctors
    }
}
`

const AppointmentsList = () => {
  const {data} = useQuery(get_Appointments)
  console.log(data);

  const cancelAppointment = (index: number) =>{
    console.log(data.getAppointments[index])
  }

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1>List of Appointments</h1>
        <div className="doctorsList">
        <TableContainer  className="table-container" >
        <Table className="table" >
            <TableHead className="table-header">
            <TableRow>
                <TableCell className="table-header-cell">Name</TableCell>
                <TableCell className="table-header-cell">Email</TableCell>
                <TableCell className="table-header-cell">Location</TableCell>
                <TableCell className="table-header-cell">Disease</TableCell>
                <TableCell className="table-header-cell">Doctor</TableCell>
                <TableCell className='table-header-cell'>Actions</TableCell>
            </TableRow>
            </TableHead>
            <TableBody className="table-body">
            {data?.getAppointments?.map((appointment:any,index:number)=>(
            <TableRow key={appointment.patient_email} className="table-row">
              <TableCell className="table-cell">{appointment.patient_name}</TableCell>
              <TableCell className="table-cell">{appointment.patient_email}</TableCell>
              <TableCell className="table-cell">{appointment.patient_location}</TableCell>
              <TableCell className="table-cell">{appointment.patient_disease}</TableCell>
              <TableCell className="table-cell">{appointment.patient_selecteddoctors}</TableCell>
              <TableCell className='table-cell'>
                <Button className='action-btn' variant='outlined' color='error' onClick={()=>cancelAppointment(index)}>Cancel</Button>
                <Button className='action-btn' variant='contained' color='success'>Approve</Button>
              </TableCell>
            </TableRow>
            ))}
        </TableBody>
            </Table>
        </TableContainer>

        </div>
      </div>
    </div>
  )
}

export default AppointmentsList