import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
// import { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import ToastMessage from "../../Toast/ToastMessage";

const GET_APPOINTMENTS = gql`
  query GetAppointments($doctor_name: String!) {
    getAppointments(doctor_name: $doctor_name) {
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

const APPROVE_APPOINTMENT = gql`
  mutation ApproveAppointment($patient_email: String!, $patient_name: String!) {
    approveAppointment(patient_email: $patient_email, patient_name: $patient_name) {
      success
      message
    }
  }
`;

const AppointmentsList = () => {
  const name = localStorage.getItem("name");

  const { data, loading, error, refetch } = useQuery(GET_APPOINTMENTS, {
    variables: { doctor_name: name },
  });

  const [approveAppointment] = useMutation(APPROVE_APPOINTMENT);

  const handleApprove = async (appointment: any) => {
    try {
      const { data } = await approveAppointment({
        variables: {
          patient_email: appointment.patient_email,
          patient_name: appointment.patient_name,
        },
      });

      if (data.approveAppointment.success) {
        ToastMessage({
          message: "Appointment approved successfully!",
          toastType: "success",
        });
        refetch(); // Refresh data to update status
      } else {
        ToastMessage({
          message: "Failed to approve appointment.",
          toastType: "error",
        });
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
      ToastMessage({
        message: "Error approving appointment.",
        toastType: "error",
      });
    }
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>Error fetching appointments!</p>;

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1>List of Appointments</h1>
        <div className="doctorsList">
          <TableContainer className="table-container">
            <Table className="table">
              <TableHead className="table-header">
                <TableRow>
                  <TableCell className="table-header-cell">Name</TableCell>
                  <TableCell className="table-header-cell">Email</TableCell>
                  <TableCell className="table-header-cell">Location</TableCell>
                  <TableCell className="table-header-cell">Disease</TableCell>
                  <TableCell className="table-header-cell">Time</TableCell>
                  <TableCell className="table-header-cell">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="table-body">
                {data?.getAppointments?.map((appointment: any) => (
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
                      {appointment.patient_appointmenttime}
                    </TableCell>

                    {/* Approve Button or Status */}
                    <TableCell className="table-cell">
                      {appointment.is_approved ? (
                        <h2 style={{ padding: "2%", color: "green" }}>
                          Approved
                        </h2>
                      ) : (
                        <Button
                          className="action-btn"
                          variant="contained"
                          color="success"
                          onClick={() => handleApprove(appointment)}
                        >
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsList;
