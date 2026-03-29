import flatpickr from "flatpickr";
import { DateTime } from "luxon";
import "flatpickr/dist/flatpickr.min.css";

document.addEventListener("DOMContentLoaded", () => {
  const birthdateInput = document.getElementById("birthdate");
  const calculateBtn = document.getElementById("calculateBtn");
  const resultDiv = document.getElementById("result");

  // Initialize Flatpickr (JavaScript datepicker - no default HTML picker)
  flatpickr(birthdateInput, {
    dateFormat: "d/m/Y",
    maxDate: "today",
    defaultDate: new Date(2002, 10, 21), // screenshot wala date
    allowInput: true,
    position: "auto",
  });

  function calculateAge() {
    const dateStr = birthdateInput.value;
    
    if (!dateStr) {
      showResult("Please select your birth date", true);
      return;
    }

    try {
      // Luxon se exact age calculate
      const birthDate = DateTime.fromFormat(dateStr, "dd/MM/yyyy");
      
      if (!birthDate.isValid) {
        showResult("Please enter a valid date", true);
        return;
      }

      const now = DateTime.now();

      if (birthDate > now) {
        showResult("Birth date cannot be in the future!", true);
        return;
      }

      // Exact years, months, days
      const diff = now.diff(birthDate, ["years", "months", "days"]).toObject();

      const years = Math.floor(diff.years || 0);
      const months = Math.floor(diff.months || 0);
      const days = Math.floor(diff.days || 0);

      const resultHTML = `You are <strong>${years} years ${months} months ${days} days old</strong>`;
      
      resultDiv.innerHTML = resultHTML;
      resultDiv.classList.add("show");
    } catch (err) {
      showResult("Error calculating age", true);
    }
  }

  function showResult(message, isError = false) {
    if (isError) {
      resultDiv.innerHTML = `<span class="error">${message}</span>`;
    } else {
      resultDiv.innerHTML = message;
    }
    resultDiv.classList.add("show");
  }

  // Calculate button
  calculateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    calculateAge();
  });

  // Auto calculate jab date change ho
  birthdateInput.addEventListener("change", calculateAge);

  // Page load pe default date ka result show (screenshot jaisa)
  setTimeout(() => {
    calculateAge();
  }, 300);
});