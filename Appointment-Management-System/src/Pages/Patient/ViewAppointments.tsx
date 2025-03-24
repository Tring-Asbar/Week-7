import { useQuery, gql } from "@apollo/client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
// import ToastMessage from "../../Toast/ToastMessage";
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
      is_approved
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
  const [filterType, setFilterType] = useState<string>("all");

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>Error fetching appointments!</p>;

  // Filter Appointments Logic
  const filterAppointments = (appointments: any[], filterType: string) => {
    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0];

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
        return true;
      }
      return false;
    });
  };

  // Apply filter to appointments
  const filteredAppointments = data?.getAppointmentsForPatients
    ? filterAppointments(data.getAppointmentsForPatients, filterType)
    : [];

  // Handle Edit Action
  const handleEdit = (appointment: any) => {
    setSelectedAppointment(null);
    setSelectedDoctor("");
    setTimeout(() => {
      setSelectedAppointment(appointment);
      setSelectedDoctor(appointment.patient_selecteddoctors);
      setOpenEditDialog(true);
    });
  };

  // Close Edit Dialog
  const handleClose = () => {
    setOpenEditDialog(false);
  };

  return (
    <div className="appointments-container">
      <h1>Booked Appointments</h1>

      {/* Date Filter */}
      <FormControl variant="outlined" style={{ width: "150px" }}>
        <InputLabel id="filter-label">Filter by Date</InputLabel>
        <Select
          labelId="filter-label"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="yesterday">Yesterday</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </Select>
      </FormControl>

      {/* Table for Appointments */}
      <TableContainer component={Paper} className="table-container">
        <Table className="table">
          <TableHead className="table-header">
            <TableRow>
              <TableCell className="table-header-cell">Name</TableCell>
              <TableCell className="table-header-cell">Email</TableCell>
              <TableCell className="table-header-cell">Location</TableCell>
              <TableCell className="table-header-cell">Disease</TableCell>
              <TableCell className="table-header-cell">Doctor</TableCell>
              <TableCell className="table-header-cell">Appointment Time</TableCell>
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

                  {/* Action Buttons */}
                  <TableCell className="table-cell">
                    <Button
                      variant="contained"
                      color="primary"
                      className="action-btn"
                      onClick={() => handleEdit(appointment)}
                      disabled={appointment.is_approved}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      className="action-btn"
                      disabled={appointment.is_approved}
                    >
                      Delete
                    </Button>
                  </TableCell>

                  {/* Status Column */}
                  <TableCell className="table-cell">
                    {appointment.is_approved ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Accepted
                      </span>
                    ) : (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Pending
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Appointment Dialog */}
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
