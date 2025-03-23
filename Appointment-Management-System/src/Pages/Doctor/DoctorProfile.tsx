import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import "../../StyleComponents/DoctorProfile.scss";
import ToastMessage from "../../Toast/ToastMessage";
import { gql, useMutation } from "@apollo/client";
import { jwtDecode , JwtPayload } from "jwt-decode";
// Define custom JwtPayload if needed
interface MyJwtPayload extends JwtPayload {
  id: number;
}

// Define types for form data
type FormData = {
  specialization: string;
  workingDays: string;
  workingTime: string;
};

// GraphQL Mutation to Update/Insert Doctor Details
const UPDATE_DOCTOR_DETAILS = gql`
  mutation UpdateDoctorDetails(
    $specialization: String!
    $working_days: String!
    $working_time: String!
    $doctor_id: Int!
  ) {
    updateDoctorDetails(
      specialization: $specialization
      working_days: $working_days
      working_time: $working_time
      doctor_id: $doctor_id
    ) {
      success
      message
    }
  }
`;

const DoctorProfile = () => {
  // Form Initialization
  const { register, formState: { errors }, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      specialization: "",
      workingDays: "",
      workingTime: "",
    },
    mode: "onChange",
  });

  // State to Track if Form is Filled
  const [isFilled, setIsFilled] = useState<boolean>(false);

  // Extract doctor_id from JWT Token
  const [doctorId, setDoctorId] = useState<number | null>(null);

  // Decode JWT to get doctor_id on component load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<MyJwtPayload>(token);
        if (decodedToken?.id) {
          setDoctorId(decodedToken.id);
        } else {
          console.error("Doctor ID not found in token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Mutation to Update or Insert Doctor Profile
  const [updateDoctorDetails] = useMutation(UPDATE_DOCTOR_DETAILS);

  // Watch Form Fields
  const watchAllFields = watch();

  // Check if All Fields Are Filled
  const checkIfFilled = () => {
    return (
      watchAllFields.specialization.trim() !== "" &&
      watchAllFields.workingDays.trim() !== "" &&
      watchAllFields.workingTime.trim() !== ""
    );
  };

  // Handle Submit to Insert/Update Details
  const onSubmit: SubmitHandler<FormData> = useCallback(
    async (values) => {
      if (!doctorId) {
        ToastMessage({
          message: "Doctor ID not found! Please log in again.",
          toastType: "error",
        });
        return;
      }

      try {
        const { data } = await updateDoctorDetails({
          variables: {
            specialization: values.specialization,
            working_days: values.workingDays,
            working_time: values.workingTime,
            doctor_id: doctorId,
          },
        });

        if (data?.updateDoctorDetails?.success) {
          ToastMessage({
            message: data.updateDoctorDetails.message,
            toastType: "success",
          });
          setIsFilled(true);
        } else {
          ToastMessage({
            message: "Failed to update profile.",
            toastType: "error",
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        ToastMessage({
          message: "Error submitting form. Please try again.",
          toastType: "error",
        });
      }
    },
    [doctorId, updateDoctorDetails]
  );

  return (
    <>
      <div>
        <h1>My Profile</h1>
      </div>

      <div className="update">
        <div className="profile">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Specialization */}
            <div>
              <TextField
                fullWidth
                variant="outlined"
                label="Specialization"
                type="text"
                placeholder="Enter Specialization"
                className="profile_field"
                {...register("specialization", {
                  required: "Specialization is required",
                })}
              />
              {errors.specialization && <p className="err-msg">{errors.specialization.message}</p>}
            </div>

            {/* Working Days */}
            <div>
              <FormControl fullWidth>
                <InputLabel id="working-days-label">Working Days</InputLabel>
                <Select
                  labelId="working-days-label"
                  id="working-days-select"
                  className="profile_field"
                  defaultValue=""
                  {...register("workingDays", {
                    required: "Working Days is required",
                  })}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Mon to Fri">Mon - Fri</MenuItem>
                  <MenuItem value="Mon to Wed">Mon - Wed</MenuItem>
                  <MenuItem value="Wed to Fri">Wed - Fri</MenuItem>
                </Select>
              </FormControl>
              {errors.workingDays && <p className="err-msg">{errors.workingDays.message}</p>}
            </div>

            {/* Working Time */}
            <div>
              <FormControl fullWidth>
                <InputLabel id="working-time-label">Working Time</InputLabel>
                <Select
                  labelId="working-time-label"
                  id="working-time-select"
                  className="profile_field"
                  defaultValue=""
                  {...register("workingTime", {
                    required: "Working Time is required",
                  })}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="8 to 10 pm">8-10</MenuItem>
                  <MenuItem value="5 to 7 pm">5-7</MenuItem>
                  <MenuItem value="7 to 10 pm">7-10</MenuItem>
                </Select>
              </FormControl>
              {errors.workingTime && <p className="err-msg">{errors.workingTime.message}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="contained"
                className="profile_field"
                disabled={!checkIfFilled()}
              >
                {isFilled ? "Update" : "Fill"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DoctorProfile;
