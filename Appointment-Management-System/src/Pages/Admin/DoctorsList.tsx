import { useQuery,gql } from "@apollo/client";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
  } from '@mui/material';


  const get_Doctor_Users = gql`
  query GetDoctorUsers{
      getDoctorUsers{
        user_name,user_email,user_phone,user_password,user_role
      }
  }
`

 



const DoctorsList = () => {

  
  const {data} = useQuery(get_Doctor_Users)

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1>List of Doctors</h1>
        <div className="doctorsList">
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
            {data?.getDoctorUsers?.map((doctor: any) => (
              <TableRow key={doctor.user_email}  className="table-row">
                  <TableCell className="table-cell">{doctor.user_name}</TableCell>
                  <TableCell className="table-cell">{doctor.user_email}</TableCell>
                  <TableCell className="table-cell">{doctor.user_phone}</TableCell>
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

export default DoctorsList