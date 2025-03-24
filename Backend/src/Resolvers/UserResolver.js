import db from '../../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const UserResolver = {
    Query:{
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
    },
    Mutation:{
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
    }
}

export default UserResolver;