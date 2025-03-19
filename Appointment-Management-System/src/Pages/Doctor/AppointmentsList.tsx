import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import ToastMessage from "../../Toast/ToastMessage";
import { APPROVE_APPOINTMENT } from "./ApproveAppointmentApi";
import { GET_APPOINTMENTS } from "./AppointmentListApi";

const AppointmentsList = () => {
  // Get doctor's name from localStorage (used for storing approvals)
  const name = localStorage.getItem("name");

  // Fetch appointments data with Apollo Query
  const { data, loading, error } = useQuery(GET_APPOINTMENTS, {
    variables: { doctor_name: name },
  });

  console.log(data);

  // State to track approval status for each appointment
  const [approvedAppointments, setApprovedAppointments] = useState<{
    [key: string]: boolean;
  }>({});

  // Load approvedAppointments from localStorage on component mount
  useEffect(() => {
    if (name) {
      const storedApprovals = localStorage.getItem(
        `approvedAppointments_${name}`
      );
      if (storedApprovals) {
        setApprovedAppointments(JSON.parse(storedApprovals));
      } else {
        setApprovedAppointments({});
      }
    }
  }, [name]);

  // Apollo Mutation for Approve Appointment
  const [approveAppointment] = useMutation(APPROVE_APPOINTMENT);

  // Handle Approval Logic
  const handleApprove = async (appointment: any) => {
    try {
      const { data } = await approveAppointment({
        variables: {
          patient_email: appointment.patient_email,
          patient_name: appointment.patient_name,
        },
      });

      if (data.approveAppointment.success) {
        // Get existing approvals for the current doctor
        const storedApprovals =
          JSON.parse(
            localStorage.getItem(`approvedAppointments_${name}`) || "{}"
          );

        // Update approval state
        const updatedApprovals = {
          ...storedApprovals,
          [appointment.patient_email]: true,
        };

        setApprovedAppointments(updatedApprovals);

        // Save updated approvals to localStorage for this doctor
        localStorage.setItem(
          `approvedAppointments_${name}`,
          JSON.stringify(updatedApprovals)
        );

        ToastMessage({
          message: "Approval email sent successfully!",
          toastType: "success",
        });
      } else {
        ToastMessage({
          message: "Failed to send approval email.",
          toastType: "error",
        });
      }
    } catch (error) {
      console.error("Approval error:", error);
      ToastMessage({
        message: "Error sending email.",
        toastType: "error",
      });
    }
  };

  // Cancel Appointment Logic (Optional)
  const cancelAppointment = (appointment: any) => {
    console.log("Appointment cancelled:", appointment);
    ToastMessage({
      message: "Appointment cancelled successfully!",
      toastType: "info",
    });
  };

  

  // Show loading or error messages
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
                  <TableCell className="table-header-cell">Doctor</TableCell>
                  <TableCell className="table-header-cell">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="table-body">
                {data?.getAppointments?.map((appointment: any) => (
                  <TableRow
                    key={appointment.patient_email}
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
                      {approvedAppointments[appointment.patient_email] ? (
                        <h2 style={{ padding:'2%', color: "green" }}> Approved</h2>
                      ) : (
                        <>
                          <Button
                            className="action-btn"
                            variant="outlined"
                            color="error"
                            onClick={() => cancelAppointment(appointment)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="action-btn"
                            variant="contained"
                            color="success"
                            onClick={() => handleApprove(appointment)}
                          >
                            Approve
                          </Button>
                        </>
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
