import { Button,TextField ,FormControl,InputLabel,Select,MenuItem} from "@mui/material"
import { useForm ,SubmitHandler} from "react-hook-form"
import { useCallback } from "react"
import '../../StyleComponents/DoctorProfile.scss'
import ToastMessage from "../../Toast/ToastMessage"




type FormData = {
    specialization:String,
    workingDays:String,
    workingHours:String,
}


const DoctorProfile = () => {
    const {register,formState:{errors},handleSubmit} = useForm<FormData>({
        defaultValues: {
            specialization:"",
            workingDays:"",
            workingHours:""
        },
        mode:"onChange"
    })

    const onSubmit: SubmitHandler<FormData> = useCallback(async (values) => {
        ToastMessage({message:"Details updated successfully",toastType:"success"})
        console.log('User Data:', values);
    },[])
  return (
    <>
    <div>
        <h1>My Profile</h1>
    </div>
    <div className="update">
        <div className="profile">
        
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <TextField fullWidth
                    variant='outlined'
                    label='Specialization'
                    type='text'
                    placeholder='Enter Specializiation'
                    className="profile_field"
                    {...register('specialization', {
                    required: 'Specialization is required',
                    //   pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
                    })}
                    />
                {errors.specialization && <p className='err-msg'>{errors.specialization.message}</p>}
                </div>

                

                <div>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Working Days</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        className="profile_field"
                        
                        {...register('workingDays', {
                            required: 'Working Days is required',
                        })}
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="Mon to Fri">Mon - Fri</MenuItem>
                        <MenuItem value="Mon to Wed">Mon - Wed</MenuItem>
                        <MenuItem value="Wed to Fri">Wed - Fri</MenuItem>
                    </Select>
                </FormControl>
                {errors.workingDays && <p className='err-msg'>{errors.workingDays.message}</p>}
                </div>

                <div>
                    <TextField fullWidth
                    variant='outlined'
                    label='Working Hours'
                    type='text'
                    placeholder='Enter working hours'
                    className="profile_field"
                    {...register('workingHours', {
                    required: 'Working Hours is required',
                    pattern:{value:/^\d+$/,message:"Invalid working hours"}
                    //   pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
                    })}
                    />
                {errors.workingHours && <p className='err-msg'>{errors.workingHours.message}</p>}
                </div>
                <div>
                    <Button type="submit" variant="contained" className="profile_field">Update Profile</Button>
                </div>
            </form>
        </div>
    </div>
    </>
  )
}

export default DoctorProfile