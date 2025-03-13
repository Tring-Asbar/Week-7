import { Button,Dialog,DialogActions,DialogContent, TextField, DialogTitle } from "@mui/material"
import { SubmitHandler,useForm } from "react-hook-form";
import { useCallback } from "react";
import { useMutation,gql } from "@apollo/client";
import ToastMessage from "../../Toast/ToastMessage";
import '../../StyleComponents/BookingForm.scss';



type FormData={
    name:string
    email:string
    location:string
    dateTime:string
    disease:string
    doctor:string

}
type BookingFormProps= {
    open: boolean;
    onClose: () => void;
    selectedDoctor:string
}


const book_Appointment = gql`
  mutation BookAppointment($patient_name: String!, $patient_email: String!, $patient_location: String!, $patient_disease: String!, $patient_selecteddoctors: String!,$patient_appointmenttime:String!) {
    bookAppointment(patient_name: $patient_name, patient_email: $patient_email, patient_location: $patient_location, patient_disease: $patient_disease, patient_selecteddoctors: $patient_selecteddoctors,patient_appointmenttime:$patient_appointmenttime) {
      patient_name
      patient_email
      patient_location
      patient_disease
      patient_selecteddoctors
      patient_appointmenttime
    }
  }
`;




// const get_Doctor_Users = gql`
//   query GetDoctorUsers{
//       getDoctorUsers{
//           user_name,user_email,user_phone,user_password,user_role
//       }
//   }
// ` 


const BookingForm = ({ open, onClose ,selectedDoctor }: BookingFormProps) =>{

    const {register,formState:{errors},handleSubmit} = useForm<FormData>({
        defaultValues:{
            name:"",
            email:"",
            location:"",
            dateTime:"",
            disease:"",
            doctor: selectedDoctor || "",
        },
        mode:"onChange"
    });

    // const [getDoctorUsers, { data}] = useLazyQuery(get_Doctor_Users);
    // const [doctors, setDoctors] = useState<string[]>([]);
    
    const [bookAppointment] = useMutation(book_Appointment);

    // Fetch doctors' names when the component mounts
    // useEffect(() => {
    //     getDoctorUsers();
    // }, [getDoctorUsers]);

    // // Update the doctors' list when data is fetched
    // useEffect(() => {
    //     if (data && data.getDoctorUsers) {
    //         const doctorNames = data.getDoctorUsers.map((doctor: { user_name: string }) => doctor.user_name);
    //         setDoctors(doctorNames);
    //     }
    // }, [data]);

    const onSubmit: SubmitHandler<FormData> = useCallback(async(values) => {
        console.log(values);
        try{
            const {data} = await bookAppointment({
                variables: {
                    patient_name:values.name,
                    patient_email:values.email,
                    patient_location:values.location,
                    patient_disease:values.disease,
                    patient_selecteddoctors:values.doctor,
                    patient_appointmenttime:values.dateTime
                },
            });
            if(data){
                ToastMessage({message:"Appointment booked successfully,Details sent to your email",toastType:"success"})
                onClose();
            }
        }
        catch (err) {
            ToastMessage({ message: "Booking failed", toastType: "error" });
            console.error("Booking error:", err);
          }

    },[onClose]);

    

    return(
      <div className="form-container">
        
        <Dialog open={open} onClose={onClose}  maxWidth='sm' fullWidth>
        <DialogTitle maxWidth='sm'>
            <h1>Booking Form</h1>
        </DialogTitle>
        
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="fields">
                <DialogContent>
                    <TextField fullWidth 
                    variant='outlined'
                    label='Name'
                    type='text'
                    className="field"
                    placeholder="Enter name"
                    {...register("name",{
                        required:"Name is required",
                        pattern:{value:/^[a-zA-Z\s]+$/,message:"Name contains only alphabets"}
                    })}
                    />
                    {errors.name && <p style={{color:"red"}}>{errors.name.message}</p> }
                </DialogContent>
            </div>
            <div className="fields">
                <DialogContent>
                    <TextField fullWidth 
                    variant='outlined'
                    label='Email'
                    type='text'
                    className="field"
                    placeholder="Enter email"
                    {...register("email",{
                        required:"Email is required",
                        pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:"Invalid email format"}
                    })}
                    />
                    {errors.email && <p style={{color:"red"}}>{errors.email.message}</p> }
                </DialogContent>
            </div>
            <div className="fields">
                <DialogContent>
                    <TextField fullWidth
                    variant='outlined'
                    label='Location'
                    type='text'
                    className="field"
                    placeholder="Enter Location"
                    {...register("location",{
                        required:"Location is required",
                        pattern:{value:/^[a-zA-Z\s]+$/,message:"Invalid location"}
                    })}
                    />
                    {errors.location && <p style={{color:"red"}}>{errors.location.message}</p> }
                </DialogContent>
            </div>

            <div className="fields">
                <DialogContent>
                    <TextField fullWidth
                    variant='outlined'
                    // label='Appointment Time'
                    type='datetime-local'
                    className="field"
                    placeholder="Enter Date and Time"
                    {...register("dateTime",{
                        required:"Date and Time is required",
                    })}
                    />
                    {errors.dateTime && <p style={{color:"red"}}>{errors.dateTime.message}</p> }
                </DialogContent>
            </div>

            <div className="fields">
                <DialogContent>
                    <TextField fullWidth
                    variant='outlined'
                    label='Disease'
                    type='text'
                    className="field"
                    placeholder="Enter Disease"
                    {...register("disease",{
                        required:"Disease is required",
                        pattern:{value:/^[a-zA-Z\s]+$/,message:"Invalid Disease"}
                    })}
                    />
                    {errors.disease && <p style={{color:"red"}}>{errors.disease.message}</p> }
                </DialogContent>
            </div>
            <div className="fields">
            <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Doctor"
            type="text"
            className="field"
            {...register("doctor")}
            InputProps={{ readOnly: true }} // Make field read-only
          />
          {errors.doctor && <p style={{ color: "red" }}>{errors.doctor.message}</p>}
        </DialogContent>
            </div>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={onClose}>Cancel</Button>
            <Button variant="contained" type="submit" color="primary">Submit</Button>
          </DialogActions>
        </form>
        </Dialog>
      </div>
    )
  }

export default BookingForm