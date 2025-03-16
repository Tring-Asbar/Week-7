import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { useMutation, gql } from "@apollo/client";
import ToastMessage from "../../Toast/ToastMessage";

const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment(
    $patient_appointmentid: Int!,
    $patient_name: String!,
    $patient_email: String!,
    $patient_location: String!,
    $patient_disease: String!,
    $patient_selecteddoctors: String!,
    $patient_appointmenttime: String!
  ) {
    updateAppointment(
      patient_appointmentid: $patient_appointmentid,
      patient_name: $patient_name,
      patient_email: $patient_email,
      patient_location: $patient_location,
      patient_disease: $patient_disease,
      patient_selecteddoctors: $patient_selecteddoctors,
      patient_appointmenttime: $patient_appointmenttime
    ) {
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

const EditForm = ({ open, onClose, initialValues }: any) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      patient_appointmentid: "",
      patient_name: "",
      patient_email: "",
      patient_location: "",
      patient_disease: "",
      patient_selecteddoctors: "",
      patient_appointmenttime: "",
    },
  });

  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: any) => {
    try {
      console.log("Updating Appointment Data:", data);

      if (!initialValues?.patient_appointmentid) {
        console.error("Error: Missing patient_appointmentid");
        return;
      }

      const variables = {
        patient_appointmentid: initialValues.patient_appointmentid,
        patient_name: data.patient_name,
        patient_email: data.patient_email,
        patient_location: data.patient_location,
        patient_disease: data.patient_disease,
        patient_selecteddoctors: data.patient_selecteddoctors,
        patient_appointmenttime: data.patient_appointmenttime,
      };

      console.log("Sending Mutation Request:", variables);

      const response = await updateAppointment({ variables });

      console.log("Mutation Response:", response);

      ToastMessage({ message: "Appointment updated successfully!", toastType: "success" });
      window.location.reload()
      onClose();
    } catch (error) {
      console.error("Failed to update appointment:", error);
      ToastMessage({ message: "Failed to update appointment.", toastType: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Appointment</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="patient_appointmentid"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Appointment ID" fullWidth margin="normal" InputProps={{ readOnly: true }} />
            )}
          />
          <Controller
            name="patient_name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Name" fullWidth margin="normal" />
            )}
          />
          <Controller
            name="patient_email"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Email" fullWidth margin="normal" />
            )}
          />
          <Controller
            name="patient_location"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Location" fullWidth margin="normal" />
            )}
          />
          <Controller
            name="patient_disease"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Disease" fullWidth margin="normal" />
            )}
          />
          <Controller
            name="patient_selecteddoctors"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Doctor" fullWidth margin="normal" InputProps={{ readOnly: true }} />
            )}
          />
          <Controller
            name="patient_appointmenttime"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Appointment Time" type="datetime-local" fullWidth margin="normal" />
            )}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditForm;