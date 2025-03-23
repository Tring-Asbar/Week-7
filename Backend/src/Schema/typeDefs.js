import gql from "graphql-tag";

const typeDefs = gql`
    type Query {
        getUsers: [User]
        getUserByEmail(user_email: String!): User
        getDoctorUsers:[User]
        getPatientUsers:[User]
        getAppointments(doctor_name:String!):[Appointments]
        getAppointmentsForPatients(applicantName:String!):[Appointments]
        getAppointmentHistoryOfPatients(applicantName:String!):[Appointments]
        getAppointmentsCount:Integer
    }

    type Mutation {
        createUser(input:userDetails): User
        login(input:loginDetails):AuthPayload!
        bookAppointment(input:bookingDetails):Appointments
        updateAppointment(input:updateBookingDetails):Appointments
        deleteAppointment(patient_appointmentid: Int!): Appointments
        approveAppointment(patient_email:String!,patient_name:String!):Response!
        updateDoctorDetails(specialization:String!,working_days:String!,working_time:String!,doctor_id:Int!):Response
    }

    type Response {
        success: Boolean!
        message: String!
    }

    type Integer {
        count:Int
    }

    type AuthPayload {
        token: String
        role:String
        name:String
    }

    type User {
        user_id:Int!
        user_name: String!
        user_email: String!
        user_phone:String!
        user_password: String!
        user_role:String!      
    }

    type Appointments {
        patient_appointmentid:Int!
        patient_name:String!
        patient_email:String!
        patient_location:String!
        patient_disease:String!
        patient_selecteddoctors:String!
        patient_appointmenttime:String!
        created_at:String!
        deleted_at:String
        updated_at:String
        applicant_name:String!
        is_approved: Boolean!
    }

    type DoctorDetails{
        specialization:String!
        working_days:String!
        working_time:String!
        doctor_id:Int!
    }


    input userDetails {
        user_name: String!
        user_email: String!
        user_phone:String!
        user_password: String!
        user_role:String!
    }

    input loginDetails {
        user_email:String!
        user_password:String!
    }

    input bookingDetails {
        patient_name:String!
        patient_email:String!
        patient_location:String!
        patient_disease:String!
        patient_selecteddoctors:String!
        patient_appointmenttime:String!
        applicant_name:String!
    }

    input updateBookingDetails {
        patient_appointmentid:Int!,
        patient_name: String!,
        patient_email: String!,
        patient_location: String!,
        patient_disease: String!,
        patient_selecteddoctors: String!,
        patient_appointmenttime: String!
    }
`;
export default typeDefs;