import { Button } from "@mui/material"
import {  useState } from "react"
import BookingForm from "./BookingForm"
import { useQuery,gql } from "@apollo/client"


const get_Doctor_Users = gql`
  query GetDoctorUsers{
      getDoctorUsers{
        user_name,user_email,user_phone,user_password,user_role
      }
  }
`

const AppointmentBooking = () => {

  const [bookButton,setBookButton] = useState<boolean>(false)

  const [selectedDoctor, setSelectedDoctor] = useState<string>("");

  const setBookButtonState  = (a:boolean) =>{
    setBookButton(a);
  }
  const handleBookNow=(doctorName:string)=>{
    setSelectedDoctor(doctorName);
  }

  const {data} = useQuery(get_Doctor_Users)


  return (
    <div className="dashboard-container">
      <div className="main-content">

        <div className="booking_cover">
        {data?.getDoctorUsers?.map((doctor: any) => (
          <div className="booking_list">
            <label>{doctor.user_name} </label>
            <label> Skin Specialist</label>
            <label> Mon - Fri </label>
            <label> 8:00 pm</label>
            <Button
                className="booking_listbtn"
                variant="contained"
                onClick={() => {
                  handleBookNow(doctor.user_name);
                  setBookButtonState(true); // Ensure the form opens after setting doctor
                }}
              >
                Book Now
              </Button>

              {/* Show the booking form when bookButton is true */}
              {bookButton && (
                <BookingForm 
                  open={bookButton}
                  onClose={() => setBookButtonState(false)}
                  selectedDoctor={selectedDoctor} 
                />
              )}
        </div>
        ))}
        
        </div>


      </div>
    </div>
  )
}

export default AppointmentBooking