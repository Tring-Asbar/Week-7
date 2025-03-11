import { Button } from "@mui/material"
import {  useState } from "react"
import BookingForm from "./BookingForm"


const AppointmentBooking = () => {

  const [bookButton,setBookButton] = useState<boolean>()

  const setBookButtonState  = (a:boolean) =>{
    setBookButton(a)
  }

  


  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="booking">
            <Button className="booking-btn" variant="contained" onClick={()=>setBookButtonState(true)}>Book Now</Button>
            {
              bookButton && <BookingForm open={bookButton}
              onClose={() => setBookButtonState(false)}/>
            }
        </div>
      </div>
    </div>
  )
}

export default AppointmentBooking