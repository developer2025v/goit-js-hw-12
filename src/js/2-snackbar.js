import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const fulfilled = document.querySelector('.input-ful');
const rejected = document.querySelector('.input-rej');
const form = document.querySelector('.form');




form.addEventListener('submit', e => {
    e.preventDefault();


    const delay = Number(form.elements.delay.value);
    const state = form.elements.state.value;

    const makePromise = (delay, state) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
};


makePromise(delay, state)
    .then((delay) => {
      iziToast.success({
        title: '✅',
        message: `Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch((delay) => {
      iziToast.error({
        title: '❌',
        message: `Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });
});

