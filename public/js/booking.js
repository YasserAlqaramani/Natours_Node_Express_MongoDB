import axios from 'axios';
import { showAlert } from './alerts';

export const booking = async (tourId, slug, price) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/booking',
            data: { tourId, price }
        });

        if(res.data.status === 'success') {
            showAlert( 'success', `${res.data.message}`)
            window.setTimeout(() => {
                location.assign(`/tour/${slug}`);
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};