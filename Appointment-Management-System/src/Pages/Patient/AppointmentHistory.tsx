import { useQuery, gql } from "@apollo/client";
import { Card, CardContent, Typography,Button } from "@mui/material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export const GET_APPOINTMENT_HISTORY_OF_PATIENTS = gql`
  query GetAppointmentHistoryOfPatients($applicantName: String!) {
    getAppointmentHistoryOfPatients(applicantName: $applicantName) {
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

const AppointmentHistory = () => {
  const name = localStorage.getItem("name");

  const { data, loading, error } = useQuery(GET_APPOINTMENT_HISTORY_OF_PATIENTS, {
    variables: { applicantName: name },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error occurred!</p>;

  return (
    <>
      {data?.getAppointmentHistoryOfPatients?.length > 0 ? (
        data.getAppointmentHistoryOfPatients.map((appointment: any) => (
          <Card
            key={appointment.patient_appointmentid}
            variant="outlined"
            style={{ display:'flex', justifyContent:'space-between',margin: "10px", padding: "10px" }}
          >
            <CardContent>
              <Typography variant="h6">
                Appointment ID: {appointment.patient_appointmentid}
              </Typography>
              <Typography variant="body1">Name: {appointment.patient_name}</Typography>
              <Typography variant="body1">Disease: {appointment.patient_disease}</Typography>
              <Typography variant="body2">
                Date: {new Date(appointment.patient_appointmenttime).toLocaleString()}
              </Typography>
            </CardContent>
            <CardContent>
                <Button variant='contained'>View</Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No appointment history found.</p>
      )}
    </>
  );
};

export default AppointmentHistory;
