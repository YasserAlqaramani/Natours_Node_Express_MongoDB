import '@babel/polyfill';
import { login, logout, signUp } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { booking } from './booking';
import { reviews } from './review';
import { deleteReviewFunction, editReviewFunction } from './editDeleteReview';


// Dom Element
const mapBox = document.getElementById('map');
const loginFrom = document.querySelector('.form--login');
const signupFrom = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookingForm = document.querySelector('.form--booking');
const reviewForm = document.querySelector('.form--review');
const editReview = document.querySelector('.form--review');
const deleteReview = document.querySelector('.form--deleteReview');

if(mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    console.log(locations);
    // displayMap(locations);
}

if(loginFrom) {
    loginFrom.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value; 
        login(email, password);
    });
}

if(signupFrom) {
    signupFrom.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value; 
        const confirmPassword = document.getElementById('confirm-password').value; 
        signUp(name, email, password, confirmPassword);
    });
}

if(logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}

if(userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form  = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateSettings(form, 'data');
    })
}

if(userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';
        const currentPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({ currentPassword, password, passwordConfirm }, 'password');

        document.querySelector('.btn--save-password').textContent = 'Save password';
        document.getElementById('password-current').value = ''; 
        document.getElementById('password').value = ''; 
        document.getElementById('password-confirm').value = ''; 
    })
};

if(bookingForm){
    bookingForm.addEventListener('submit', e => {
        e.preventDefault();
        const tour = document.getElementById('tourId').value; 
        const slug = document.getElementById('slug').value; 
        const price = document.getElementById('price').value;
        booking(tour, slug, price);
    });
};

if(reviewForm) {
    reviewForm.addEventListener('submit', e => {
        e.preventDefault();
        const tourId = document.getElementById('tourId').value; 
        const slug = document.getElementById('slug').value; 
        const review = document.getElementById('review').value; 
        const stars = document.getElementById('stars').value;

        reviews(tourId, slug, review, stars);
    });
}

if(editReview) {
    editReview.addEventListener('submit', e => {
        e.preventDefault();
        const reviewId = document.getElementById('reviewId').value;
        const review = document.getElementById('review').value; 
        const stars = document.getElementById('stars').value;

        editReviewFunction(reviewId, review, stars);
    });
}

if(deleteReview) {
    deleteReview.addEventListener('submit', e => {
        e.preventDefault();
        const reviewId = document.getElementById('reviewId').value;
        deleteReviewFunction(reviewId);
    });
}