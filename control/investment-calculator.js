
const getValue = (id) => {
    let value = document.getElementById(id).value;
    return value ? parseFloat(value.replaceAll(',','')) : 0;
}

const setValue = (id, value, places) => {
   document.getElementById(id).value = value.toFixed(places);
}

const log = (base, n) => {
    return Math.log(n) / Math.log(base);
};

const formatFloat = (number) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

const calculateMonthlySaving = () => {
    setValue('monthlySaving', 0.0, 2);
    let initialAmount = getValue('initialAmount');
    let goal = getValue('goal');
    let yearlyYield = getValue('yield');
    let saving = 0;
    let months = getValue('months');
    if (months) {
        if(yearlyYield > 0) {
             let yield = Math.pow(1 + (getValue('yield') / 100), 1/12);

             let savingAuxA1 = goal - (initialAmount * Math.pow(yield, months));
             let savingAuxA2 = 1 - yield;
             let savingAuxA3 = 1 - Math.pow(yield, months);
             saving =  (savingAuxA1 * savingAuxA2) / savingAuxA3;
        } else {
            saving = (goal - initialAmount) / months;
        }

        setValue('monthlySaving', saving, 2);
    } else {
        console.log('Months is required');
    }
}

const calculateMonths = () => {
    setValue('months', 0.0, 2);
    let initialAmount = getValue('initialAmount');
    let monthlySaving = getValue('monthlySaving');
    let goal = getValue('goal');
    let yearlyYield = getValue('yield');
    let months = 0;
    if( initialAmount > 0) {
        if( monthlySaving > 0) {
            if (yearlyYield > 0) {
                 let yield = Math.pow(1 + (yearlyYield / 100), 1/12)
                 let aux1 = goal * (1 - yield) - monthlySaving;
                 let aux2 = -monthlySaving + initialAmount - initialAmount * yield;
                 months = log(yield, aux1 / aux2);
            } else {
                months = (goal - initialAmount) / monthlySaving;
            }

            setValue('months', months, 2);
            setValue('years', parseFloat(months) / 12, 2);
        } else {
            console.log('monthlySaving is required');
        }
    } else {
        console.log('initialAmount is required');
    }

}

const calculateGoal = () => {
    setValue('goal', 0.0, 2);
    let initialAmount = getValue('initialAmount');
    let monthlySaving = getValue('monthlySaving');
    let months = getValue('months');
    let yearlyYield = getValue('yield');
    let goal = 0;
    if (months > 0) {
        if (yearlyYield > 0) {
            let yield = Math.pow(1 + (yearlyYield / 100), 1/12);
            let aux1 = (monthlySaving * ( 1 - Math.pow(yield, months)));
            let aux2 = (1 - yield);
            goal = (aux1 / aux2) + (initialAmount * Math.pow(yield, months)) ;
        } else {
            goal = initialAmount + (monthlySaving * months);
        }
        setValue('goal', goal, 2);
    } else {
        console.log('Months is required');
    }

}

const calculate = (event) => {

    const selectedType = document.getElementById('type').value;
    switch (selectedType) {
        case 'monthlySaving':
            calculateMonthlySaving();
            break;
        case 'months':
            calculateMonths();
            break;
        case 'goal':
            calculateGoal();
            break;
    }
};

const onInitialAmountChange = (event) => {
    calculate(event);
}

const onMonthlySavingChange = (event) => {
    calculate(event);
}

const onYieldChange = (event) => {
    calculate(event);
}

const onGoalChange = (event) => {
    calculate(event);
}

const onMonthsChange = (event) => {
    calculate(event);
    setValue('years', getValue('months') / 12, 2);

}

const onYearsChange = (event) => {
    document.getElementById('months').value = getValue('years')  * 12;
    calculate(event);
}


document.getElementById('initialAmount').addEventListener('input', (event) => {onInitialAmountChange(event);});
document.getElementById('monthlySaving').addEventListener('input', (event) => {onMonthlySavingChange(event);});
document.getElementById('yield').addEventListener('input', (event) => {onYieldChange(event);});
document.getElementById('goal').addEventListener('input', (event) => {onGoalChange(event);});
document.getElementById('months').addEventListener('input', (event) => {onMonthsChange(event);});
document.getElementById('years').addEventListener('input', (event) => {onYearsChange(event);});


document.getElementById('type').addEventListener('change', (event) => {
    const selectedType = event.target.value;
    const fields = ['initialAmount', 'monthlySaving', 'yield', 'goal', 'yearlyPaymentIncrease', 'months', 'years'];

    fields.forEach(field => {
        document.getElementById(field).readOnly = false;
    });

    switch (selectedType) {
        case 'monthlySaving':
            document.getElementById('monthlySaving').readOnly = true;
            break;
        case 'months':
            document.getElementById('months').readOnly = true;
            break;
        case 'goal':
            document.getElementById('goal').readOnly = true;
            break;
    }
});


function showTable() {
    const tableBody = document.getElementById('savingsTableBody');
    tableBody.innerHTML = '';
    let months = getValue('months');
    if(months > 0) {
        let data = [];
        let year = 0;
        let prevSavings = getValue('initialAmount');
        let monthlyYieldFactor = Math.pow(1 + (getValue('yield')/100), 1/12);
        let yearlyPaymentIncrease = 1 + getValue('yearlyPaymentIncrease')/100;
        let monthlySaving = getValue('monthlySaving');
        let inflationMonthlyFactor = Math.pow(1.07, 1/12);
        for(let i = 1; i <= months; i++) {
             let yield = prevSavings * (monthlyYieldFactor - 1);
             let totalSaving = prevSavings + yield;
             let savingIncrease = monthlySaving * Math.pow(yearlyPaymentIncrease, year) - monthlySaving;
             let saving =  savingIncrease + monthlySaving;
             let totalSavings = totalSaving + saving;
             data.push(
                {
                    year: year,
                    month: (i%12) == 0 ? 12 : (i%12),
                    prevSavings: formatFloat(prevSavings),
                    yield: formatFloat(yield),
                    totalSaving:  formatFloat(totalSaving),
                    savingIncrease:  formatFloat(savingIncrease),
                    saving:  formatFloat(saving),
                    totalSavings:  formatFloat(totalSavings),
                    relativeAmount:  formatFloat(totalSavings/Math.pow(inflationMonthlyFactor, i))
                }
            );
            prevSavings = totalSavings;

            if ((i%12) == 0){
               year++;
            }
        }

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.year}</td>
                <td>${row.month}</td>
                <td>${row.prevSavings}</td>
                <td>${row.yield}</td>
                <td>${row.totalSaving}</td>
                <td>${row.savingIncrease}</td>
                <td>${row.saving}</td>
                <td>${row.totalSavings}</td>
                <td>${row.relativeAmount}</td>
            `;
            tableBody.appendChild(tr);
        });
    }


}
