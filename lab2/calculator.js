const resultDiv = document.getElementById('result');
const buttons = document.querySelectorAll('.my-btn');

let currentInput = '0';
let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let waitingForSecondOperand = false;
let shouldResetScreen = false;


let storedValue = 0;
let lastOperation = null;



// Обновление экрана
function updateScreen(value) {
    resultDiv.textContent = value;
    currentInput = value;
    resultDiv.scrollLeft = resultDiv.scrollWidth;
}

// Сброс калькулятора
function clearAll() {
    currentInput = '0';
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    waitingForSecondOperand = false;
    shouldResetScreen = false;
    storedValue = 0;
    lastOperation = null;
    updateScreen('0');
}


function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return 'Ошибка';
    }
    return a / b;
}

function calculate() {
    if (firstOperand === null || currentOperator === null) {
        return parseFloat(currentInput);
    }

    const second = parseFloat(currentInput);
    let result = 0;

    switch (currentOperator) {
        case '+':
            result = add(firstOperand, second);
            break;
        case '-':
            result = subtract(firstOperand, second);
            break;
        case '*':
            result = multiply(firstOperand, second);
            break;
        case '/':
            result = divide(firstOperand, second);
            break;
        default:
            return second;
    }

    return result;
}

// Обработка нажатия оператора
function handleOperator(operator) {
    const inputValue = parseFloat(currentInput);

    if (firstOperand !== null && currentOperator && !waitingForSecondOperand) {
        const result = calculate();
        currentInput = result.toString();
        updateScreen(currentInput);
        firstOperand = result;
    }
    else if (firstOperand === null) {
        firstOperand = inputValue;
    }

    waitingForSecondOperand = true;
    currentOperator = operator;
    shouldResetScreen = true;
}

// Обработка нажатия равно
function handleEqual() {
    if (firstOperand !== null && currentOperator !== null) {
        const result = calculate();
        currentInput = result.toString();
        updateScreen(currentInput);

        firstOperand = result;
        currentOperator = null;
        waitingForSecondOperand = true;
        shouldResetScreen = true;
    }
}

function changeSign() {
    if (currentInput !== '0' && currentInput !== 'Ошибка') {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateScreen(currentInput);
    }
}

function calculatePercent() {
    if (currentInput !== '0' && currentInput !== 'Ошибка') {
        if (firstOperand !== null && currentOperator) {
            let percentValue = (firstOperand * parseFloat(currentInput)) / 100;
            currentInput = percentValue.toString();

            if (waitingForSecondOperand) {
                updateScreen(currentInput);
            }
        } else {
            currentInput = (parseFloat(currentInput) / 100).toString();
            updateScreen(currentInput);
        }
    }
}

function backspace() {
    if (currentInput !== '0' && currentInput !== 'Ошибка') {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateScreen(currentInput);
    }
}

const colors = ['#02818a', '#dd6524', '#2d1b4f', '#4a3863', '#5f4b8b'];
let colorIndex = 0;

function changeBackgroundColor() {
    const calculator = document.getElementById('calculator');
    colorIndex = (colorIndex + 1) % colors.length;
    calculator.style.backgroundColor = colors[colorIndex];
}

function calculateSquareRoot() {
    if (currentInput !== '0' && currentInput !== 'Ошибка') {
        let number = parseFloat(currentInput);
        if (number >= 0) {
            currentInput = Math.sqrt(number).toString();
            updateScreen(currentInput);
        } else {
            updateScreen('Ошибка');
        }
    }
}

function calculateSquare() {
    if (currentInput !== '0' && currentInput !== 'Ошибка') {
        let number = parseFloat(currentInput);
        currentInput = (number * number).toString();
        updateScreen(currentInput);
    }
}

function calculateFactorial() {
    if (currentInput !== '0' && currentInput !== 'Ошибка') {
        let number = parseInt(currentInput);

        if (number < 0) {
            updateScreen('Ошибка');
            return;
        }

        if (number === 0 || number === 1) {
            currentInput = '1';
        } else {
            let factorial = 1;
            for (let i = 2; i <= number; i++) {
                factorial *= i;
            }
            currentInput = factorial.toString();
        }
        updateScreen(currentInput);
    }
}

function addTripleZero() {
    if (currentInput !== '0' && currentInput !== 'Ошибка') {
        currentInput += '000';
    } else {
        currentInput = '0';
    }
    updateScreen(currentInput);
}

function accumulateAddition() {
    let currentNumber = parseFloat(currentInput);

    if (lastOperation === 'accumulate-add') {
        storedValue += currentNumber;
    } else {
        storedValue = currentNumber;
        lastOperation = 'accumulate-add';
    }

    currentInput = storedValue.toString();
    updateScreen(currentInput);
    shouldResetScreen = true;
}

function accumulateSubtraction() {
    let currentNumber = parseFloat(currentInput);

    if (lastOperation === 'accumulate-sub') {
        storedValue -= currentNumber;
    } else {
        storedValue = currentNumber;
        lastOperation = 'accumulate-sub';
    }

    currentInput = storedValue.toString();
    updateScreen(currentInput);
    shouldResetScreen = true;
}

const resultColors = ['#eee', '#e6f3ff', '#e6ffe6', '#fff0e6', '#55686a'];
let resultColorIndex = 0;

function changeResultColor() {
    resultColorIndex = (resultColorIndex + 1) % resultColors.length;
    resultDiv.style.backgroundColor = resultColors[resultColorIndex];
}

function calculateNaCl() {
    const molarMassNaCl = 58.44;
    let currentNumber = parseFloat(currentInput);

    if (!isNaN(currentNumber) && currentInput !== 'Ошибка' && currentInput !== '') {
        let mass = currentNumber * molarMassNaCl;

        if (mass === Math.floor(mass)) {
            currentInput = mass.toString();
        } else {
            currentInput = mass.toFixed(4).toString();
        }

        updateScreen(currentInput);
        shouldResetScreen = true;
    }
}

// Обработка нажатия цифр
function handleDigit(digit) {
    if (shouldResetScreen) {
        currentInput = '0';
        shouldResetScreen = false;
    }

    if (waitingForSecondOperand) {
        currentInput = '0';
        waitingForSecondOperand = false;
    }

    if (currentInput === '0') {
        currentInput = digit;
    } else {
        currentInput += digit;
    }

    updateScreen(currentInput);
}

// Обработка точки
function handleDot() {
    if (waitingForSecondOperand) {
        currentInput = '0';
        waitingForSecondOperand = false;
    }

    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateScreen(currentInput);
    }
}

function toggleTheme() {
    const calculator = document.getElementById('calculator');
    const themeToggleBtn = document.getElementById('themeToggle');
    calculator.classList.toggle('light-theme');

    if (calculator.classList.contains('light-theme')) {
        themeToggleBtn.innerHTML = '☀️';
    } else {
        themeToggleBtn.innerHTML = '🌙';
    }
}

// ИНИЦИАЛИЗАЦИЯ И ОБРАБОТЧИКИ СОБЫТИЙ
document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i <= 9; i++) {
        const digitBtn = document.getElementById(`btn_digit_${i}`);
        if (digitBtn) {
            digitBtn.addEventListener('click', () => handleDigit(i.toString()));
        }
    }

    const plusBtn = document.getElementById('btn_op_plus');
    if (plusBtn) {
        plusBtn.addEventListener('click', () => handleOperator('+'));
    }

    const minusBtn = document.getElementById('btn_op_minus');
    if (minusBtn) {
        minusBtn.addEventListener('click', () => handleOperator('-'));
    }

    const multBtn = document.getElementById('btn_op_mult');
    if (multBtn) {
        multBtn.addEventListener('click', () => handleOperator('*'));
    }

    const divBtn = document.getElementById('btn_op_div');
    if (divBtn) {
        divBtn.addEventListener('click', () => handleOperator('/'));
    }

    const clearBtn = document.getElementById('btn_op_clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAll);
    }

    const signBtn = document.getElementById('btn_op_sign');
    if (signBtn) {
        signBtn.addEventListener('click', changeSign);
    }

    const percentBtn = document.getElementById('btn_op_percent');
    if (percentBtn) {
        percentBtn.addEventListener('click', calculatePercent);
    }

    const equalBtn = document.getElementById('btn_op_equal');
    if (equalBtn) {
        equalBtn.addEventListener('click', handleEqual);
    }

    const dotBtn = document.getElementById('btn_digit_dot');
    if (dotBtn) {
        dotBtn.addEventListener('click', handleDot);
    }

    const backspaceBtn = document.getElementById('btn_backspace');
    if (backspaceBtn) {
        backspaceBtn.addEventListener('click', backspace);
    }

    const sqrtBtn = document.getElementById('btn_sqrt');
    if (sqrtBtn) {
        sqrtBtn.addEventListener('click', calculateSquareRoot);
    }

    const squareBtn = document.getElementById('btn_square');
    if (squareBtn) {
        squareBtn.addEventListener('click', calculateSquare);
    }

    const factorialBtn = document.getElementById('btn_factorial');
    if (factorialBtn) {
        factorialBtn.addEventListener('click', calculateFactorial);
    }

    const tripleZeroBtn = document.getElementById('btn_triple_zero');
    if (tripleZeroBtn) {
        tripleZeroBtn.addEventListener('click', addTripleZero);
    }

    const accumAddBtn = document.getElementById('btn_accum_add');
    if (accumAddBtn) {
        accumAddBtn.addEventListener('click', accumulateAddition);
    }

    const accumSubBtn = document.getElementById('btn_accum_sub');
    if (accumSubBtn) {
        accumSubBtn.addEventListener('click', accumulateSubtraction);
    }

    const resultColorBtn = document.getElementById('btn_result_color');
    if (resultColorBtn) {
        resultColorBtn.addEventListener('click', changeResultColor);
    }

    const naclBtn = document.getElementById('btn_nacl');
    if (naclBtn) {
        naclBtn.addEventListener('click', calculateNaCl);
    }

    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
});

window.clearAll = clearAll;
window.changeSign = changeSign;
window.calculatePercent = calculatePercent;
window.backspace = backspace;
window.changeBackgroundColor = changeBackgroundColor;
window.calculateSquareRoot = calculateSquareRoot;
window.calculateSquare = calculateSquare;
window.calculateFactorial = calculateFactorial;
window.addTripleZero = addTripleZero;
window.accumulateAddition = accumulateAddition;
window.accumulateSubtraction = accumulateSubtraction;
window.changeResultColor = changeResultColor;
window.calculateNaCl = calculateNaCl;
window.handleOperator = handleOperator;
window.handleEqual = handleEqual;
window.toggleTheme = toggleTheme;
