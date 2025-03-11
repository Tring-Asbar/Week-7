import { FormControl,InputLabel,Button,Select,MenuItem,Dialog,DialogActions,DialogContent, TextField, DialogTitle } from "@mui/material"
import { SubmitHandler,useForm } from "react-hook-form";
import { useCallback,useState,useEffect } from "react";
import '../../StyleComponents/BookingForm.scss';

type FormData={
    name:string
    email:string
    location:string
    time:string
    disease:string
    doctor:string

}
type BookingFormProps= {
    open: boolean;
    onClose: () => void;
  }


import { useLazyQuery,gql } from "@apollo/client";

const get_Doctor_Users = gql`
  query GetDoctorUsers{
      getDoctorUsers{
          user_name,user_email,user_phone,user_password,user_role
      }
  }
` 


const BookingForm = ({ open, onClose }: BookingFormProps) =>{

    const {register,formState:{errors},handleSubmit} = useForm<FormData>({
        defaultValues:{
            name:"",
            email:"",
            location:"",
            time:"",
            disease:"",
            doctor:""
        },
        mode:"onChange"
    });

    const [getDoctorUsers, { data}] = useLazyQuery(get_Doctor_Users);
    const [doctors, setDoctors] = useState<string[]>([]);
    


    // Fetch doctors' names when the component mounts
    useEffect(() => {
        getDoctorUsers();
    }, [getDoctorUsers]);

    // Update the doctors' list when data is fetched
    useEffect(() => {
        if (data && data.getDoctorUsers) {
            const doctorNames = data.getDoctorUsers.map((doctor: { user_name: string }) => doctor.user_name);
            setDoctors(doctorNames);
        }
    }, [data]);

    const onSubmit: SubmitHandler<FormData> = useCallback(async(values) => {
        console.log(values);
        onClose();
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
                    {errors.name && <p style={{color:"red"}}>{errors.name.message}</p> }
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
                    <FormControl fullWidth>
                    <InputLabel className='field'>Doctors</InputLabel>

                    <Select
                    label="Role"
                    className='field'
                    {...register("doctor",{
                    })} 
                    >
                    {doctors.map((doctor, index) => (
                        <MenuItem key={index} value={doctor}>
                            {doctor}
                        </MenuItem>
                    ))}

                    </Select>
                    

                    </FormControl>
                    {errors.doctor && <p style={{color:"red"}}>{errors.doctor.message}</p> }
                    

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