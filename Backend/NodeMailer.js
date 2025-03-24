import { createTransport } from "nodemailer";

const resolvers = {
  Mutation: {
    bookAppointment: async (_, { patient_name, patient_email, patient_location, patient_disease, patient_selecteddoctors }) => {
      // Save appointment to database (if applicable)
      
      // Configure Nodemailer
      const transporter = createTransport({
        service: "gmail",
        auth: {
          user: "2112054@nec.edu.in",
          pass: "A2106@2003r",
        },
      });

      // Email options
      const mailOptions = {
        from: "2112054@nec.edu.in",
        to: "asbar735@gmail.com",
        subject: "Appointment Confirmation",
        text: `Hello ${patient_name},\n\nYour appointment with Dr. ${patient_selecteddoctors} has been confirmed.\n\nDetails:\n- Location: ${patient_location}\n- Disease: ${patient_disease}\n\nThank you!`,
      };

      try {
        await transporter.sendMail(mailOptions);
        return {
          patient_name,
          patient_email,
          patient_location,
          patient_disease,
          patient_selecteddoctors,
        };
      } catch (error) {
        throw new Error("Error sending email: " + error.message);
      }
    },
  },
};

export default resolvers;
