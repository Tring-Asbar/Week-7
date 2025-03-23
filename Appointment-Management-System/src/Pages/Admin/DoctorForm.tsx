// DoctorForm.tsx
import { useEffect, useState, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, InputLabel, FormControl, MenuItem, Select, TextField, DialogActions } from "@mui/material";
import "../../StyleComponents/UserForm.scss";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ToastMessage from "../../Toast/ToastMessage";
import bcrypt from "bcryptjs";
import { useMutation } from "@apollo/client";
import { create_User } from "../../SignUp/SignUpFormApi";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobileNumber: string;
  role: string;
}

interface DoctorFormProps {
  onClose: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [id, setId] = useState<string | null>(null);

  const { register, formState: { errors }, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobileNumber: "",
      role: "",
    },
    mode: "onChange",
  });

  const [createUser] = useMutation(create_User);

  const generateId = (): void => {
    setId(null);
    setId(uuidv4());
    console.log("Generated UUID:", id);
  };

  // Hash password before submitting
  const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  const onSubmit: SubmitHandler<FormData> = useCallback(async (values) => {
    generateId();
    console.log("User Data:", values);
    console.log("UUID:", id);

    try {
      const hashedPassword = await hashPassword(values.password);

      const { data } = await createUser({
        variables: {
          input: {
            user_name: values.name,
            user_email: values.email,
            user_phone: values.mobileNumber,
            user_password: hashedPassword,
            user_role: values.role,
          },
        },
      });

      if (data) {
        ToastMessage({ message: "Register successful", toastType: "success" });
        navigate("/login");
      }
    } catch (err) {
      ToastMessage({ message: "Registration failed", toastType: "error" });
      console.error("Registration error:", err);
    }
  }, []);

  const pwd = watch("password");
  const confirmPassword = watch("confirmPassword");
  useEffect(() => {
    if (pwd.includes(" ")) {
      setValue("password", pwd.replace(/\s/g, ""));
    }
    if (confirmPassword.includes(" ")) {
      setValue("confirmPassword", confirmPassword.replace(/\s/g, ""));
    }
  }, [pwd, confirmPassword, setValue]);

  return (
    <div className="container">
      <h1>Add Doctor</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="fields">
          <TextField
            variant="outlined"
            label="Name"
            type="text"
            className="field"
            placeholder="Enter name"
            {...register("name", {
              required: "Name is required",
              maxLength: { value: 50, message: "Name is too long" },
              pattern: { value: /^[a-zA-Z\s]+$/, message: "Name contains only alphabets" },
            })}
          />
          {errors.name && <p className="err-msg">{errors.name.message}</p>}
        </div>
        <div className="fields">
          <TextField
            variant="outlined"
            label="Email"
            type="text"
            className="field"
            placeholder="Enter email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
            })}
          />
          {errors.email && <p className="err-msg">{errors.email.message}</p>}
        </div>
        <div className="fields">
          <TextField
            variant="outlined"
            label="Mobile Number"
            type="text"
            className="field"
            placeholder="Enter mobile number"
            {...register("mobileNumber", {
              required: "Mobile number is required",
              pattern: { value: /^[0-9\s]+$/, message: "Invalid Mobile Number" },
              maxLength: { value: 10, message: "Mobile number contains 10 digits" },
              minLength: { value: 10, message: "Mobile number contains 10 digits" },
            })}
          />
          {errors.mobileNumber && <p className="err-msg">{errors.mobileNumber.message}</p>}
        </div>
        <div className="fields">
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            className="field"
            placeholder="Enter Password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
          />
          {errors.password && <p className="err-msg">{errors.password.message}</p>}
        </div>
        <div className="fields">
          <TextField
            variant="outlined"
            label="Confirm Password"
            type="password"
            className="field"
            placeholder="Enter same password"
            {...register("confirmPassword", {
              required: "Password is required",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && <p className="err-msg">{errors.confirmPassword.message}</p>}
        </div>
        <div className="fields">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Role"
              className="field"
              {...register("role", { required: "Role is required" })}
            >
              <MenuItem value="Doctor">Doctor</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="fields">
          <DialogActions>
            <Button variant="outlined" className="field" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" className="field" type="submit">
              Submit
            </Button>          
          </DialogActions>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
