import { useQuery } from '@apollo/client';

import { get_Patient_Users } from './PatientListApi';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
  } from '@mui/material';

  

const PatientsList = () => {

  const {data} = useQuery(get_Patient_Users)

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1>List of Patients</h1>
      <div className="patientsList">
      <TableContainer component={Paper} className="table-container">
        <Table className="table">
            <TableHead className="table-header">
            <TableRow>
                <TableCell className="table-header-cell">Name</TableCell>
                <TableCell className="table-header-cell">Email</TableCell>
                <TableCell className="table-header-cell">Phone</TableCell>
            </TableRow>
            </TableHead>
            <TableBody className="table-body">
            {data?.getPatientUsers?.map((patient: any) => (  
              <TableRow key={patient.user_email} className="table-row">
                <TableCell className="table-cell">{patient.user_name}</TableCell>
                <TableCell className="table-cell">{patient.user_email}</TableCell>
                <TableCell className="table-cell">{patient.user_phone}</TableCell>
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

export default PatientsList