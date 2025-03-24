// AddDoctor.tsx
import { Button } from "@mui/material";
import { useState } from "react";
import DoctorForm from "./DoctorForm";

const AddDoctor = () => {
  const [addButton, setAddButton] = useState(false);

  // Close the form and reset state
  const setAddButtonState = (value: boolean) => {
    setAddButton(value);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setAddButtonState(true)} fullWidth>
        Add Doctor
      </Button>
      {addButton && <DoctorForm onClose={() => setAddButtonState(false)} />}
    </>
  );
};

export default AddDoctor;
