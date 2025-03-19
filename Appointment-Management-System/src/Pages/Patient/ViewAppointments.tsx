import { useMutation, useQuery, gql } from "@apollo/client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ToastMessage from "../../Toast/ToastMessage";
import { useState } from "react";
import EditForm from "./EditForm";

const GET_APPOINTMENTS_FOR_PATIENTS = gql`
  query GetAppointmentsForPatients($applicantName: String!) {
    getAppointmentsForPatients(applicantName: $applicantName) {
      patient_appointmentid
      patient_name
      patient_email
      patient_location
      patient_disease
      patient_selecteddoctors
      patient_appointmenttime
      applicant_name
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
  const name = localStorage.getItem("name");

  const { data, loading, error } = useQuery(GET_APPOINTMENTS_FOR_PATIENTS, {
    variables: { applicantName: name },
  });

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [deleteButton, setDeleteButton] = useState(false);
  const [filterType, setFilterType] = useState<string>("all"); // Default to 'today'

  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT, {
    onCompleted: () => {
      ToastMessage({
        message: "Appointment deleted successfully!",
        toastType: "info",
      });
      window.location.reload();
      setDeleteButtonState(false);
    },
    onError: (error) => {
      console.error("Failed to delete appointment:", error);
      ToastMessage({
        message: "Failed to delete appointment.",
        toastType: "error",
      });
      setDeleteButtonState(false);
    },
  });

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>Error fetching appointments!</p>;

  // Filter Logic
  const filterAppointments = (appointments: any[], filterType: string) => {
    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0]; // YYYY-MM-DD

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayDateString = yesterday.toISOString().split("T")[0];

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(
        appointment.patient_appointmenttime
      ).toISOString().split("T")[0];

      if (filterType === "today") {
        return appointmentDate === todayDateString;
      } else if (filterType === "yesterday") {
        return appointmentDate === yesterdayDateString;
      } else if (filterType === "all") {
        return true; // Show all appointments
      }
      return false;
    });
  };

  // Apply filter to appointments
  const filteredAppointments = data?.getAppointmentsForPatients
    ? filterAppointments(data.getAppointmentsForPatients, filterType)
    : [];

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(null);
    setSelectedDoctor("");
    setTimeout(() => {
      setSelectedAppointment(appointment);
      setSelectedDoctor(appointment.patient_selecteddoctors);
      setOpenEditDialog(true);
    });
  };

  const setDeleteButtonState = (value: boolean) => {
    setDeleteButton(value);
  };

  const deletePopup = (patient_appointmentid: number) => {
    return (
      <Dialog open={deleteButton}>
        <DialogContent>
          <p>Do you want to cancel your appointment?</p>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setDeleteButtonState(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(patient_appointmentid)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
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

      {/* Filter Dropdown */}
        <FormControl variant="outlined" style={{ width: "150px" }}>
          <InputLabel id="filter-label">Filter by Date</InputLabel>
          <Select
            labelId="filter-label"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Filter by Date"
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </FormControl>

      <TableContainer component={Paper} className="table-container">
        <Table className="table">
          <TableHead className="table-header">
            <TableRow>
              <TableCell className="table-header-cell">Name</TableCell>
              <TableCell className="table-header-cell">Email</TableCell>
              <TableCell className="table-header-cell">Location</TableCell>
              <TableCell className="table-header-cell">Disease</TableCell>
              <TableCell className="table-header-cell">Doctor</TableCell>
              <TableCell className="table-header-cell">
                Appointment Time
              </TableCell>
              <TableCell className="table-header-cell">Actions</TableCell>
              <TableCell className="table-header-cell">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="table-body">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment: any) => (
                <TableRow
                  key={appointment.patient_appointmentid}
                  className="table-row"
                >
                  <TableCell className="table-cell">
                    {appointment.patient_name}
                  </TableCell>
                  <TableCell className="table-cell">
                    {appointment.patient_email}
                  </TableCell>
                  <TableCell className="table-cell">
                    {appointment.patient_location}
                  </TableCell>
                  <TableCell className="table-cell">
                    {appointment.patient_disease}
                  </TableCell>
                  <TableCell className="table-cell">
                    {appointment.patient_selecteddoctors}
                  </TableCell>
                  <TableCell className="table-cell">
                    {new Date(
                      appointment.patient_appointmenttime
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell className="table-cell">
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
                      onClick={() => setDeleteButtonState(true)}
                    >
                      Delete
                    </Button>
                    {deleteButton && deletePopup(appointment.patient_appointmentid)}
                  </TableCell>
                  <TableCell className="table-cell">
                    Pending
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedAppointment && (
        <EditForm
          open={openEditDialog}
          onClose={handleClose}
          selectedDoctor={selectedDoctor}
          initialValues={selectedAppointment}
        />
      )}
    </div>
  );
};

export default ViewAppointments;