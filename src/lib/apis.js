import axios from 'axios';
import config from '../config';


export default { 
    users: { 
        populateDB: async () => {
            let url = 'http://localhost:3001/api/populate-db';

            try {
                const response = await axios(url, { method: 'GET' });
                return response.data;
            }
            catch (err) {
                return err.response.data;
            }
        },

        getUser: async (id) => {
            let url = `http://localhost:3002/api/users/${id}`;

            try {
                const response = await axios(url, { method: "GET" });
                return response.data;
            }
            catch (err) {
                return err.response.data;
            }
        },

        getUsers: async () => {
            let url = `http://localhost:3002/api/users`;

            try {
                const response = await axios(url, { method: "GET" });
                return response.data;
            }
            catch (err) {
                return err.response.data;
            }
        },

        updateUser: async (data) => {
            let url =  `http://localhost:3002/api/edit-user`;

            try {
                const response = await axios(url, {
                    data,
                    method: "PUT",
                });
                return response.data;
            }
            catch (err) {
                return err.response.data;
            }
        },

        deleteUsers: async () => {
            let url = `http://localhost:3002/api/users`;

            try {
                const response = await axios(url, { method: "DELETE" });
                return response.data;
            }
            catch (err) {
                return err.response.data;
            }
        },

        exportData: async (data) => { 
            let url = `http://localhost:3003/api/export-user-data`;

            try {
                const response = await axios(url, { method: "GET" });
                return response.data;
            }
            catch (err) {
                return err.response.data;
            }
        }
    }
}