import axios from 'axios';
import { showAlert } from './alerts';

export const deleteReviewFunction = async (reviewid) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:3000/api/v1/reviews/${reviewid}`
        });
        if(res.data.status === 'success') {
            showAlert( 'success', 'Review Deleted Successfully!')
            window.setTimeout(() => {
                location.assign('/my-reviews');
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}
export const editReviewFunction = async (reviewId, review, rating) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `http://127.0.0.1:3000/api/v1/reviews/${reviewId}`,
            data: { review, rating }
        });
        if(res.data.status === 'success') {
            showAlert( 'success', 'Review Deleted Successfully!')
            location.assign('/my-reviews');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}