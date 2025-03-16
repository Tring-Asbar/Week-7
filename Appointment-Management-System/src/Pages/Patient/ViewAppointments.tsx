import { useMutation,useQuery, gql } from "@apollo/client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import ToastMessage from "../../Toast/ToastMessage";
import { useState } from "react";
import EditForm from "./EditForm";

const GET_APPOINTMENTS = gql`
  query GetAppointments {
    getAppointments {
      patient_appointmentid
      patient_name
      patient_email
      patient_location
      patient_disease
      patient_selecteddoctors
      patient_appointmenttime
    }
  }
`;

const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($patient_appointmentid: Int!) {
    deleteAppointment(patient_appointmentid: $patient_appointmentid) {
      patient_appointmentid
    }
  }
`;

const ViewAppointments = () => {
  const { data, loading, error} = useQuery(GET_APPOINTMENTS);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");

  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT, {
    onCompleted: () => {
      ToastMessage({ message: "Appointment deleted successfully!", toastType: "info" });
      window.location.reload()
    },
    onError: (error) => {
      console.error("Failed to delete appointment:", error);
      ToastMessage({ message: "Failed to delete appointment.", toastType: "error" });
    },
  });

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>Error fetching appointments!</p>;


  

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(null);
    setSelectedDoctor("")
    console.log(appointment.patient_appointmentid)
    setTimeout(()=>{
      setSelectedAppointment(appointment);
      setSelectedDoctor(appointment.patient_selecteddoctors);
      setOpenEditDialog(true);
    })
    // setOpenEditDialog(true);
  };

  const handleDelete = async (patient_appointmentid: number) => {
    try {
      await deleteAppointment({ variables: { patient_appointmentid } });
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleClose = () => {
    setOpenEditDialog(false);
  };

  return (
    <div className="appointments-container">
      <h1>Booked Appointments</h1>
      <TableContainer component={Paper} className="table-container">
        <Table className="table">
          <TableHead className="table-header">
            <TableRow>
              <TableCell className="table-header-cell">Name</TableCell>
              <TableCell className="table-header-cell">Email</TableCell>
              <TableCell className="table-header-cell">Location</TableCell>
              <TableCell className="table-header-cell">Disease</TableCell>
              <TableCell className="table-header-cell">Doctor</TableCell>
              <TableCell className="table-header-cell" >Appointment Time</TableCell>
              <TableCell className="table-header-cell">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="table-body">
            {data?.getAppointments?.map((appointment: any) => (
              <TableRow key={appointment.patient_appointmentid} className="table-row">
                <TableCell className="table-cell">{appointment.patient_name}</TableCell>
                <TableCell className="table-cell">{appointment.patient_email}</TableCell>
                <TableCell className="table-cell">{appointment.patient_location}</TableCell>
                <TableCell className="table-cell">{appointment.patient_disease}</TableCell>
                <TableCell className="table-cell">{appointment.patient_selecteddoctors}</TableCell>
                <TableCell>{new Date(appointment.patient_appointmenttime).toLocaleString()}</TableCell>
                <TableCell>
                <Button
                    variant="contained"
                    color="primary"
                    className="action-btn"
                    onClick={() => handleEdit(appointment)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    className="action-btn"
                    onClick={() => handleDelete(appointment.patient_appointmentid)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedAppointment && (
        <EditForm
          open={openEditDialog}
          onClose={handleClose}
          selectedDoctor={selectedDoctor}
          initialValues={selectedAppointment} // Pass appointment data for editing
        />
      )}
    </div>
  );
};

export default ViewAppointments;
