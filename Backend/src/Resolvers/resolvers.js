import db from '../../db.js';
import jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';
import bcrypt from 'bcryptjs';


const resolvers = {
    Query: {
        getUsers: async () => {
            const allUsers = await db.query("SELECT * FROM applicationUsers");
            return allUsers.rows;
        },

        getUserByEmail: async (_, args) => {
            const userResult = await db.query(
                `SELECT * FROM applicationUsers WHERE user_email = $1`, 
                [args.user_email]
            );

            const user = userResult.rows[0];
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        },

        getDoctorUsers: async () => {
            const users = await db.query(
                `SELECT * FROM applicationUsers WHERE user_role = 'Doctor'`
            );
            return users.rows;
        },

        getPatientUsers: async () => {
            const users = await db.query(
                `SELECT * FROM applicationUsers WHERE user_role = 'Patient'`
            );
            return users.rows;
        },

        getAppointments: async (_,{doctor_name}) => {
            const appointments = await db.query(`SELECT * FROM appointments where deleted_at IS NULL and patient_selecteddoctors = $1`,[doctor_name]);
            console.log(appointments.rows);
            return appointments.rows;
        },

        getAppointmentsCount: async()=>{
            const appointmentsCount = await db.query('SELECT COUNT(*) FROM appointments')
            return { count: appointmentsCount.rows[0].count };
        },

        getAppointmentsForPatients : async(_,{applicantName})=>{
            const appointment = await db.query(`SELECT * FROM appointments where deleted_at IS NULL and applicant_name = $1 ORDER BY patient_appointmentid ASC`,[applicantName]);
            return appointment.rows
        },

        getAppointmentHistoryOfPatients : async(_,{applicantName})=>{
            const appointment = await db.query(`SELECT * FROM appointments where applicant_name = $1 ORDER BY patient_appointmentid DESC`,[applicantName]);
            return appointment.rows
        }
    },

    Mutation: {
        createUser: async (_, {input}) => {
            const {user_name,user_email,user_phone,user_password,user_role} = input
            const newUser = await db.query(
                `INSERT INTO applicationUsers(user_name, user_email, user_phone, user_password, user_role) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
                [user_name, user_email, user_phone,user_password, user_role]
            );
            return newUser.rows[0]; // Ensure it returns the created user
        },
        login:async(_,{input})=>{
            const {user_email,user_password} = input
            const userResult = await db.query('SELECT * FROM applicationUsers WHERE user_email = $1', [user_email]);
            const user = userResult.rows[0];
            if (!user) {
                throw new Error('User not found');
            }

            // Compare the provided password with the stored hashed password
            const isPasswordCorrect = await bcrypt.compare(user_password, user.user_password);
            if (!isPasswordCorrect) {
                throw new Error('Invalid credentials');
            }

            // Generate a JWT
            const token = jwt.sign(
                { id: user.user_id, email: user.user_email, role: user.user_role.toLowerCase() },
                process.env.JWT_SECRET|| 'my secrest key',
                { expiresIn: '1h' }
            );
            console.log(token)
            return {token:token, role:user.user_role,name:user.user_name}
        },

        bookAppointment: async (_, {input}) => {
            try {
                const {patient_name,patient_email,patient_location,patient_disease,patient_selecteddoctors,patient_appointmenttime,applicant_name}=input
                const newAppointment = await db.query(
                    `INSERT INTO appointments(patient_name, patient_email, patient_location, patient_disease, patient_selecteddoctors, patient_appointmenttime,applicant_name) 
                     VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *`,
                    [
                        patient_name,
                        patient_email,
                        patient_location,
                        patient_disease,
                        patient_selecteddoctors,
                        patient_appointmenttime,
                        applicant_name
                        
                    ]
                );

                const transporter = createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER, 
                        pass: process.env.APP_PASSWORD, 
                    },
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: patient_email,
                    subject: "Appointment Confirmation",
                    text: `Hello ${patient_name},\n\nYour appointment with Dr. ${patient_selecteddoctors} has been confirmed.\n\nDetails:\n- Location: ${patient_location}\n- Disease: ${patient_disease}\n\nThank you!`,
                };

                await transporter.sendMail(mailOptions);
                console.log("Email sent successfully", mailOptions);

                return newAppointment.rows[0];
            } catch (error) {
                console.error("Error booking appointment:", error);
                throw new Error("Booking failed: " + error.message);
            }
        },

        updateAppointment: async (_, {input}) => {
            try {
                const {patient_name,patient_email,patient_location,patient_disease,patient_selecteddoctors,patient_appointmenttime,patient_appointmentid} = input
                const result = await db.query(
                    `UPDATE appointments 
                     SET patient_name=$1, patient_email=$2, patient_location=$3, patient_disease=$4, 
                         patient_selecteddoctors=$5, patient_appointmenttime=$6 ,updated_at= Now()
                     WHERE patient_appointmentid=$7 
                     RETURNING *`,
                    [
                        patient_name,
                        patient_email,
                        patient_location,
                        patient_disease,
                        patient_selecteddoctors,
                        patient_appointmenttime,
                        patient_appointmentid,
                    ]
                );

                if (result.rowCount === 0) {
                    throw new Error("Appointment not found or update failed");
                }

                return result.rows[0]; // Return the updated appointment
            } catch (error) {
                console.error("Error updating appointment:", error);
                throw new Error("Failed to update appointment: " + error.message);
            }
        },


        deleteAppointment: async (_, args) => {
            try {
                // Find the appointment to delete
                const appointment = await db.query(
                    `SELECT * FROM appointments WHERE patient_appointmentid = $1`,
                    [args.patient_appointmentid]
                );

                if (appointment.rows.length === 0) {
                    throw new Error("Appointment not found");
                }

                // Delete the appointment
                const result = await db.query(
                    `UPDATE appointments SET deleted_at = NOW() WHERE patient_appointmentid = $1 RETURNING *`,
                    [args.patient_appointmentid]
                );

                if (result.rowCount === 0) {
                    throw new Error("Failed to delete appointment");
                }

                // Return the deleted appointment
                return result.rows[0];
            } catch (error) {
                console.error("Error deleting appointment:", error);
                throw new Error("Failed to delete appointment: " + error.message);
            }
        },

        approveAppointment: async (_, args) => {
            const { patient_email, patient_name } = args;
      
            try {
              const result = await db.query(
                `SELECT * FROM appointments WHERE patient_email = $1 AND patient_name = $2`,
                [patient_email, patient_name]
              );
      
              if (result.rows.length === 0) {
                return {
                  success: false,
                  message: "Appointment not found.",
                };
              }
      
              await db.query(
                `UPDATE appointments SET is_approved = TRUE WHERE patient_email = $1 AND patient_name = $2`,
                [patient_email, patient_name]
              );
      
              const transporter = createTransport({
                service: "gmail",
                auth: {
                  user: process.env.EMAIL_USER, // Your email
                  pass: process.env.APP_PASSWORD, // Your app password
                },
              });
      
              const mailOptions = {
                from: process.env.EMAIL_USER,
                to: patient_email,
                subject: "Appointment Approved",
                text: `Dear ${patient_name},\n\nYour appointment has been approved successfully!\n\nThank you!`,
              };
      
              await transporter.sendMail(mailOptions);
      
              return {
                success: true,
                message: "Appointment approved and email sent successfully!",
              };
            } catch (error) {
              console.error("Error approving appointment or sending email:", error);
              return {
                success: false,
                message: "Failed to approve appointment or send email.",
              };
            }
          },

          updateDoctorDetails: async (_, args) => {
            const { specialization, working_days, working_time, doctor_id } = args;
      
            try {
              // Check if the doctor_id exists in the database
              const checkResult = await db.query(
                `SELECT * FROM doctor_details WHERE doctor_id = $1`,
                [doctor_id]
              );
      
              if (checkResult.rows.length > 0) {
                // Doctor details exist - Perform an update
                await db.query(
                  `UPDATE doctor_details
                   SET specialization = $1, 
                       working_days = $2, 
                       working_time = $3
                   WHERE doctor_id = $4`,
                  [specialization, working_days, working_time, doctor_id]
                );
                return { success: true, message: "Doctor details updated successfully" };
              } else {
                // Doctor details don't exist - Insert new record
                await db.query(
                  `INSERT INTO doctor_details (doctor_id, specialization, working_days, working_time)
                   VALUES ($1, $2, $3, $4)`,
                  [doctor_id, specialization, working_days, working_time]
                );
                return { success: true, message: "Doctor details inserted successfully" };
              }
            } catch (error) {
              console.error("Error updating/inserting doctor details:", error);
              return { success: false, message: "Database error occurred" };
            }
          },

    }
};

export default resolvers;
