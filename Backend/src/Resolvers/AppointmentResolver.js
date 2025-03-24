const AppointmentResolver ={
    Query:{
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

    
}