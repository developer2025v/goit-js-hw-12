import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";




const selector = document.querySelector('input#datetime-picker');
const button = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

button.disabled = true;
let userSelectedDate = null;
let intervalId = null;


const options = {
        enableTime: true,
        time_24hr: true,
        defaultDate: new Date(),
        minuteIncrement: 1,
        onClose(selectedDates) {
            console.log(selectedDates[0]);
            
            if(selectedDates[0] < new Date()) {
                iziToast.show({
                    message: 'Please choose a date in the future'
                });
                button.disabled = true;
                return;
            } else {
                userSelectedDate = selectedDates[0];
                button.disabled = false;
            }
        },
};

flatpickr(selector, options);


button.addEventListener('click', e => {
    if (!userSelectedDate) return;

    button.disabled = true;
    selector.disabled = true;

    intervalId = setInterval(() => {
    const currentTime = new Date();
    const diff = userSelectedDate - currentTime;
    
    if (diff < 1000) {
      clearInterval(intervalId);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      selector.disabled = false;
      return;
    }

    const time = convertMs(diff);
    updateTimer(time);
    }, 1000);
});


function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}


function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}



