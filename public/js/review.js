import axios from 'axios';
import { showAlert } from './alerts';

export const reviews = async (tourId, slug, review, rating) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `http://127.0.0.1:3000/api/v1/tours/${tourId}/reviews`,
            data: { review, rating }
        });

        if(res.data.status === 'success') {
            showAlert( 'success', 'Review Added Successfully!')
            window.setTimeout(() => {
                location.assign(`/tour/${slug}`);
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}