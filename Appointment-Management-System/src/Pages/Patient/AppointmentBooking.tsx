import { Button } from "@mui/material"
import {  useState } from "react"
import BookingForm from "./BookingForm"
import { useQuery } from "@apollo/client"
import { get_Doctor_Users } from "../Admin/DoctorListApi"

const AppointmentBooking = () => {

  const [bookButton,setBookButton] = useState<boolean>(false)

  const [selectedDoctor, setSelectedDoctor] = useState<string>("");

  const setBookButtonState  = (a:boolean) =>{
    setBookButton(a);
  }
  const handleBookNow=(doctorName:string)=>{
    setSelectedDoctor(doctorName);
  }
  const name = localStorage.getItem('name')|| ""
  const {data} = useQuery(get_Doctor_Users)

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="booking_cover">
        {data?.getDoctorUsers?.map((doctor: any) => (
          <div className="booking_list" key={doctor.user_email}>
            <label>{doctor.user_name} </label>
            <label> Skin Specialist</label>
            <label> Mon - Fri </label>
            <label> 8:00 pm</label>
            <Button
                className="booking_listbtn"
                variant="contained"
                onClick={() => {
                  handleBookNow(doctor.user_name);
                  setBookButtonState(true); 
                }}
              >
                Book Now
              </Button>
              {bookButton && (
                <BookingForm 
                  open={bookButton}
                  onClose={() => setBookButtonState(false)}
                  selectedDoctor={selectedDoctor} 
                  applicantName={name}
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