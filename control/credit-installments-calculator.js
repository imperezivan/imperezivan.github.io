
const getValue = (id) => {
    let value = document.getElementById(id).value;
    return value ? parseFloat(value.replaceAll(',','')) : 0;
}

const setValue = (id, value, places) => {
   document.getElementById(id).value = value.toFixed(places);
}

const formatFloat = (number) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}


const updateDownPaymentAmountAndCreditAmount = () => {
    const realEstateValueInput = document.getElementById('realEstateValue');
    const downpaymentInput = document.getElementById('downpayment');

    const realEstateValue = parseFloat(realEstateValueInput.value) || 0;
    const downpayment = parseFloat(downpaymentInput.value) || 0;

    const downpaymentAmount = realEstateValue * (downpayment / 100);
    const creditAmount = realEstateValue - downpaymentAmount;

    document.getElementById('downpaymentAmount').value = formatFloat(downpaymentAmount);
    document.getElementById('creditAmount').value = formatFloat(creditAmount);
};

const updateInterestFactors = () => {
    updateYearlyInterestFactor();
    updateMonthlyInterestFactor();
}

const updateYearlyInterestFactor = () => {
    let interest = document.getElementById('interest').value;
    if (interest) {
        yearlyInterestFactor = 1 + (interest / 100);
    } else {
        yearlyInterestFactor = 0.0;
    }
    document.getElementById('yearlyInterestFactor').value = yearlyInterestFactor.toFixed(6);
}

const updateMonthlyInterestFactor = () => {
    let yearlyInterestFactor = document.getElementById('yearlyInterestFactor').value;
    document.getElementById('monthlyInterestFactor').value = Math.pow(yearlyInterestFactor, 1/12).toFixed(6);
}

const updateInstallment = () => {
    let creditAmount = getValue('creditAmount');
    let years = getValue('years');
    let interest = getValue('yearlyInterestFactor');

    let installment = (creditAmount * (Math.pow(interest, years + 1/12) - Math.pow(interest, years)) )/ (Math.pow(interest, years) - 1);
    document.getElementById('installment').value = formatFloat(installment);

}

const onUpdateRealEstateValue = () => {
    updateDownPaymentAmountAndCreditAmount();
    updateInstallment();
}

const onUpdateDownpayment = () => {
    updateDownPaymentAmountAndCreditAmount();
    updateInstallment();
}

const onUpdateInterest = () => {
    updateInterestFactors();
    updateInstallment();
}


const generateInstallmentTable = () => {
    const tableBody = document.getElementById('installmentTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    const creditAmount = getValue('creditAmount');
    const years = getValue('years');
    const yearlyInterestFactor = getValue('yearlyInterestFactor');
    const annualPaymentIncrease = getValue('annualPaymentIncrease');
    const monthlyInterestFactor = Math.pow(yearlyInterestFactor, 1/12);
    let previousDebt = creditAmount;
    let payment = getValue('installment');

    for (let year = 1; year <= years; year++) {
        for (let month = 1; month <= 12; month++) {
            const interest = previousDebt * (monthlyInterestFactor - 1);
            const totalDebt = previousDebt + interest;
            const paymentIncrease = payment * (Math.pow(1 + (annualPaymentIncrease / 100), year - 1)-1);
            let finalPayment = payment + paymentIncrease;
            if (finalPayment > totalDebt) {
                finalPayment = totalDebt;
            }
            const debtAfterPayment = totalDebt - finalPayment;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${year}</td>
                <td>${month}</td>
                <td>${formatFloat(previousDebt)}</td>
                <td>${formatFloat(interest)}</td>
                <td>${formatFloat(totalDebt)}</td>
                <td>${formatFloat(paymentIncrease)}</td>
                <td>${formatFloat(finalPayment)}</td>
                <td>${formatFloat(debtAfterPayment)}</td>
            `;
            tableBody.appendChild(row);
            if(debtAfterPayment <=0){
                return;
            }
            previousDebt = debtAfterPayment;

        }
        payment += annualPaymentIncrease;
    }
};


document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('realEstateValue').addEventListener('input', onUpdateRealEstateValue);
    document.getElementById('downpayment').addEventListener('input', onUpdateDownpayment);
    document.getElementById('interest').addEventListener('input', onUpdateInterest);
    document.getElementById('years').addEventListener('input', updateInstallment);
    updateInterestFactors();
      document.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            generateInstallmentTable();
        });
});

// Add this JavaScript code to toggle the visibility of divs with the class 'rule-tooltip'
document.getElementById('toggleRules').addEventListener('click', () => {
    const ruleTooltips = document.querySelectorAll('.rule-tooltip');
    ruleTooltips.forEach(div => {
        if (div.style.display === 'none') {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
        }
    });
});
