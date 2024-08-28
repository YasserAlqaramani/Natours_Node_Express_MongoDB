import axios from 'axios';
import { showAlert } from './alerts';

export const signUp = async (name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/signup',
            data: { name, email, password, passwordConfirm }
        });

        if(res.data.status === 'success') {
            showAlert( 'success', 'Your Account Created Successfully!')
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
        console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: { email, password }
        });

        if(res.data.status === 'success') {
            showAlert( 'success', 'Logged in Successfully')
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
        console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });
        if(res.data.status === 'success') location.replace('/');
    } catch (err) {
        showAlert('error', 'Error logging out! Try again.')
    }
}