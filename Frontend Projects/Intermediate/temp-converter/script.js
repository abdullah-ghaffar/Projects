document.addEventListener('DOMContentLoaded', () => {
    const tempInput = document.getElementById('tempValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const convertBtn = document.getElementById('convertBtn');
    const resultArea = document.getElementById('resultArea');

    // Button Enable/Disable Logic
    const validate = () => {
        if (tempInput.value !== "" && fromUnit.value !== "" && toUnit.value !== "") {
            convertBtn.disabled = false;
        } else {
            convertBtn.disabled = true;
        }
    };

    [tempInput, fromUnit, toUnit].forEach(element => {
        element.addEventListener('input', validate);
        element.addEventListener('change', validate);
    });

    // Conversion Logic
    convertBtn.addEventListener('click', () => {
        let val = parseFloat(tempInput.value);
        let from = fromUnit.value;
        let to = toUnit.value;
        let result = 0;

        if (from === to) {
            result = val;
        } else if (from === "Celsius") {
            result = (to === "Fahrenheit") ? (val * 9/5) + 32 : val + 273.15;
        } else if (from === "Fahrenheit") {
            let celsius = (val - 32) * 5/9;
            result = (to === "Celsius") ? celsius : celsius + 273.15;
        } else if (from === "Kelvin") {
            let celsius = val - 273.15;
            result = (to === "Celsius") ? celsius : (celsius * 9/5) + 32;
        }

        resultArea.textContent = `${val} ${from} is ${result.toFixed(2)} ${to}`;
    });
});