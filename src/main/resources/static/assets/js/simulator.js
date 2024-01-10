class CalculationData {
    constructor(apiBaseUrl, authToken) {
        this.apiBaseUrl = apiBaseUrl;
        this.authToken = authToken;
    }

    _getHeaders() {
        return {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
        };
    }

    saveCalculation(calculationData) {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiBaseUrl}/calculation/`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify(calculationData)
            })
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }

    getCalculations(userId) {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiBaseUrl}/calculation/user/${userId}`, {
                method: 'GET',
                headers: this._getHeaders()
            })
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }

    deleteCalculation(id) {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiBaseUrl}/calculation/`, {
                method: 'DELETE',
                headers: this._getHeaders(),
                body: JSON.stringify({id: id})
            })
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }
}

function getUserInputValues() {
    return {
        initialDeposit: document.getElementById('initial_deposit').dataset.value,
        contributionAmount: document.getElementById('contribution_amount').dataset.value,
        contributionFrequency: document.querySelector('[name="contribution_period"]:checked').value,
        investmentDuration: document.getElementById('investment_timespan').value,
        estimatedReturn: document.getElementById('estimated_return').dataset.value,
        estimatedInflation: document.getElementById('estimated_inflation').dataset.value,
        estimatedTax: document.getElementById('estimated_tax').dataset.value,
        // Add more fields as necessary
    };
}


function initializeInvestmentSimulator() {

    // Function to update the value of an input field
    const initial_deposit = document.querySelector('#initial_deposit'),
        contribution_amount = document.querySelector('#contribution_amount'),
        investment_timespan = document.querySelector('#investment_timespan'),
        investment_timespan_text = document.querySelector('#investment_timespan_text'),
        estimated_return = document.querySelector('#estimated_return'),
        future_balance = document.querySelector('#future_balance'),
        estimated_inflation = document.querySelector('#estimated_inflation'),
        estimated_tax = document.querySelector('#estimated_tax')
    ;


    ////////////////////////////////////////////// GRAPHIC SECTION ///////////////////////////////////////////////////

    // getChartData() explanation
    /*
    Inputs: It takes user inputs like initial deposit, estimated return, regular contributions, and rates of tax and inflation.

    Data Preparation: It creates datasets for principal amount, cumulative interest, tax, and inflation effects, covering the investment duration.

    Calculations: The function computes the yearly balance, accounting for compounded interest, regular contributions, tax deductions, and inflation.

    Output: It returns an object with time labels (years) and datasets, used to plot a chart illustrating the investment's growth and impacts over time.
    */

    // Returns chart data
    function getChartData() {
        var _initial_deposit = parseFloat(initial_deposit.dataset.value),
            _contribution_amount = parseFloat(contribution_amount.dataset.value),
            _contribution_frequency = parseInt(document.querySelector('[name="contribution_period"]:checked').value),
            _capitalization_frequency = parseInt(document.querySelector('[name="compound_period"]:checked').value),
            _estimated_return = parseFloat(estimated_return.dataset.value / 100),
            _estimatedInflation = parseFloat(estimated_inflation.dataset.value / 100),
            _estimatedTax = parseFloat(estimated_tax.dataset.value / 100),
            _investment_duration = parseInt(investment_timespan.value),
            _current_year = (new Date()).getFullYear();


        var labels = [];
        for (var y = 0; y < _investment_duration; y++) {
            labels.push(_current_year + y);
        }

        var principal_dataset = {label: simulator.principalAmount, backgroundColor: 'rgb(0, 123, 255)', data: []};
        var interest_dataset = {label: simulator.interest, backgroundColor: 'rgb(23, 162, 184)', data: []};
        var tax_dataset = {label: simulator.tax, backgroundColor: 'rgb(220, 53, 69)', data: []};
        var inflation_dataset = {label: simulator.inflation, backgroundColor: 'rgb(255, 193, 7)', data: []};

        var balance = _initial_deposit;
        var cumulativeInterest = 0, cumulativeTax = 0, cumulativeInflation = 0;

        // Annual statistics
        for (var year = 0; year < _investment_duration; year++) {
            var yearlyInterest = 0;
            for (var period = 0; period < _capitalization_frequency; period++) {
                // Add contributions at the specified frequency
                if (year > 0 && period % Math.round(_capitalization_frequency / _contribution_frequency) === 0) {
                    balance += _contribution_amount;
                }
                // Calculate interest per period
                var periodInterest = balance * _estimated_return / _capitalization_frequency;
                yearlyInterest += periodInterest;
                balance += periodInterest; // Compound the interest
            }

            var yearlyTax = yearlyInterest * _estimatedTax;
            var yearlyInflation = balance * _estimatedInflation;

            cumulativeInterest += yearlyInterest;
            cumulativeTax += yearlyTax;
            cumulativeInflation += yearlyInflation;

            balance -= yearlyTax; // Deduct yearly tax
            balance -= yearlyInflation; // Deduct yearly inflation effect

            // Update the datasets
            principal_dataset.data.push(balance.toFixed(2));
            interest_dataset.data.push(cumulativeInterest.toFixed(2));
            tax_dataset.data.push(-cumulativeTax.toFixed(2));
            inflation_dataset.data.push(-cumulativeInflation.toFixed(2));
        }

        future_balance.innerHTML = balance.toFixed(2) + '€';

        return {
            labels: labels,
            datasets: [principal_dataset, interest_dataset, tax_dataset, inflation_dataset]
        };
    }


    // Update chart data
    function updateChart() {
        var data = getChartData();
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.datasets[0].data;
        chart.data.datasets[1].data = data.datasets[1].data;
        chart.data.datasets[2].data = data.datasets[2].data;
        chart.data.datasets[3].data = data.datasets[3].data;
        chart.update();

        console.log('Chart updated')
    }

    // Graph configuration
    var ctx = document.getElementById('myChart').getContext('2d'),
        chart = new Chart(ctx, {
            type: 'bar',
            data: getChartData(),
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel + '€';
                        }
                    }
                },
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: simulator.years
                        }
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            callback: function (value) {
                                return value + '€';
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: simulator.principalAmount
                        }
                    }
                }
            }
        });

    ////////////////////////////////////////////// FORM BUTTONS SECTION ///////////////////////////////////////////////////

    // Refresh the chart when the inflation or tax rate changes
    function updateValue(element, action) {
        var min = parseFloat(element.getAttribute('min')),
            max = parseFloat(element.getAttribute('max')),
            step = parseFloat(element.getAttribute('step')) || 1,
            oldValue = element.dataset.value || element.defaultValue || 0,
            newValue = parseFloat(element.value.replace(/€/, ''));

        // Verifies if the newValue is a number, if not, reverts to oldValue
        if (isNaN(parseFloat(newValue))) {
            newValue = oldValue;
        } else {
            // Check if the newValue is a number, if not, revert to oldValue
            if (isNaN(newValue)) {
                newValue = oldValue;
            } else {
                if (action === 'add') {
                    newValue += step; // Increment and cap at max
                } else if (action === 'sub') {
                    newValue -= step; // Decrement and cap at min
                }

                if (newValue >= max) {
                    alert(simulator.maxValueReached);
                    newValue = Math.max(Math.min(newValue, max), min);
                }
            }

            //newValue = newValue < min ? min : newValue > max ? max : newValue;
        }

        // Prevent newValue from going below the minimum value
        newValue = Math.max(newValue, min);

        // Update element value
        element.dataset.value = newValue;
        element.value = (element.dataset.prepend || '') + newValue + (element.dataset.append || '€');

        updateChart();
    }

    // Initial deposit
    initial_deposit.addEventListener('change', function () {
        updateValue(this);
    });
    initial_deposit.addEventListener('input', function () {
        updateValue(this);
    });

    // Contribution amount
    contribution_amount.addEventListener('change', function () {
        updateValue(this);
    });
    contribution_amount.addEventListener('input', function () {
        updateValue(this);
    });

    // Investment timespan
    investment_timespan.addEventListener('change', function () {
        investment_timespan_text.innerHTML = this.value;
        updateChart();
    });
    investment_timespan.addEventListener('input', function () {
        investment_timespan_text.innerHTML = this.value;
        updateChart();
    });

    // Estimated return
    estimated_return.addEventListener('change', function () {
        updateValue(this);
    });
    estimated_return.addEventListener('input', function () {
        updateValue(this);
    });

    // Estimated tax
    estimated_tax.addEventListener('change', function () {
        updateValue(this);
    });
    estimated_tax.addEventListener('input', function () {
        updateValue(this);
    });

    // Estimated inflation
    estimated_inflation.addEventListener('change', function () {
        updateValue(this);
    });
    estimated_inflation.addEventListener('input', function () {
        updateValue(this);
    });


    var radios = document.querySelectorAll('[name="contribution_period"], [name="compound_period"]');
    radios.forEach(function(radio) {
        radio.addEventListener('change', function() {
            console.log('Radio button value changed: ' + this.value);
            updateChart(); // Update the chart when radio button value changes
        });
    });

    var buttons = document.querySelectorAll('[data-counter]');

    // Add event listeners to increment and decrement buttons
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];

        button.addEventListener('click', function () {
            var field = document.querySelector('[name="' + this.dataset.field + '"]'),
                action = this.dataset.counter;

            if (field) {
                updateValue(field, action);
            }
        });
    }


    // Reset button
    function resetValues() {
        // Reset the values
        document.getElementById('initial_deposit').value = '5000€';
        document.getElementById('initial_deposit').dataset.value = '5000';
        document.getElementById('contribution_amount').value = '100€';
        document.getElementById('contribution_amount').dataset.value = '100';
        document.getElementById('contribution_period_annually').checked = true;
        document.getElementById('investment_timespan').value = '5';
        document.getElementById('investment_timespan_text').innerHTML = '5';
        document.getElementById('estimated_return').value = '8%';
        document.getElementById('estimated_return').dataset.value = '8.00';
        document.getElementById('estimated_inflation').value = '3%';
        document.getElementById('estimated_inflation').dataset.value = '3.00';
        document.getElementById('estimated_tax').value = '20%';
        document.getElementById('estimated_tax').dataset.value = '20.00';
        document.getElementById('compound_period_annually').checked = true;

        // Update the chart after resetting the values
        updateChart();
    }

    // Add event listener to reset button
    document.getElementById('button-reset').addEventListener('click', resetValues);



    /// Increment and decrement buttons
    // Variable to store the timer and timeout
    var repeatTimer, startTimer;

    function startIncrementing(field, action) {
        // Function to update the value
        function increment() {
            updateValue(field, action);
        }

        // Define the speed based on the field
        var time;
        if (field.name === "estimated_return") {
            time = 300;
        } else if (field.name === "initial_deposit") {
            time = 100;
        } else {
            time = 200;
        }

        // Clear any existing timer to prevent multiple intervals
        clearInterval(repeatTimer);

        // Start incrementing after a specified delay (500ms)
        startTimer = setTimeout(function() {
            repeatTimer = setInterval(increment, time);
        }, 500); // Delay of 500 milliseconds
    }

    function stopIncrementing() {
        // Clear both the interval and the delayed start timer
        clearInterval(repeatTimer);
        clearTimeout(startTimer);
        repeatTimer = null;
        startTimer = null;
    }

    // Add event listeners to increment and decrement buttons
    buttons.forEach(function(button) {
        button.addEventListener('mousedown', function() {
            const field = document.querySelector('[name="' + this.dataset.field + '"]');
            const action = this.dataset.counter;
            startIncrementing(field, action);
        });

        // Stop incrementing when mouse leaves the button while pressed
        button.addEventListener('mouseleave', stopIncrementing);
    });

    // Listen for mouseup on the entire document
    document.addEventListener('mouseup', stopIncrementing);



    ////////////////////////////////////////////// EXPORT SECTION ///////////////////////////////////////////////////
    // Function to export the data to CSV
    function exportToCSV() {
        // Gather input data
        const inputData = getInputData();

        // Gather chart data using your getChartData function
        const chartData = getChartData();
        let csvContent = "data:text/csv;charset=utf-8," + inputData;
        csvContent += "Year,Principal,Interest\r\n";

        chartData.labels.forEach(function(label, index){
            const principal = chartData.datasets[0].data[index]; // Assuming 0 is principal
            const interest = chartData.datasets[1].data[index];  // Assuming 1 is interest
            csvContent += label + "," + principal + "," + interest + "\r\n";
        });

        // Trigger CSV download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "compound_interest_data.csv");
        document.body.appendChild(link); // Required for FF

        link.click();
        document.body.removeChild(link);
    }

    // Get input field data
    function getInputData() {
        const initialDeposit = document.getElementById('initial_deposit').value;
        const contribution = document.getElementById('contribution_amount').value;
        const contributionFrequency = document.querySelector('[name="contribution_period"]:checked').value;
        const duration = document.getElementById('investment_timespan').value;
        const returnRate = document.getElementById('estimated_return').value;
        const capitalizationFrequency = document.querySelector('[name="compound_period"]:checked').value;
        const estimatedTax = document.getElementById('estimated_tax').value;
        const estimatedInflation = document.getElementById('estimated_inflation').value;

        var inputData = "Initial Deposit,Contribution,Contribution Frequency,Duration,Return Rate,Capitalization Frequency,Estimated Tax,Estimated Inflation\r\n";
        inputData += initialDeposit + "," + contribution + "," + contributionFrequency + "," + duration + "," + returnRate + "," + capitalizationFrequency + "," + estimatedTax + "," + estimatedInflation + "\r\n";
        return inputData;
    }

    // Add this function to a button's click event
    document.getElementById('btn-export-csv').addEventListener('click', exportToCSV);
}

function initializeHistorySection() {

    // Save calculation to history
    document.getElementById('button-save').addEventListener('click', function() {

        const userData = JSON.parse(localStorage.getItem("userDetails"));
        //ask for calculation name
        const calculationData = {
            name: prompt(simulator.enterCalculationName),
            //description: prompt(simulator.enterCalculationName),
            initialDeposit: document.getElementById('initial_deposit').value,
            contributionAmount: document.getElementById('contribution_amount').value,
            contributionFrequency: document.querySelector('[name="contribution_period"]:checked').value,
            durationYears: document.getElementById('investment_timespan').value,
            interestRate: document.getElementById('estimated_return').value,
            capitalizationFrequency: document.querySelector('[name="compound_period"]:checked').value,
            incomeTaxRate: document.getElementById('estimated_tax').value,
            inflationRate: document.getElementById('estimated_inflation').value,
            finalAmount: parseFloat(document.getElementById('future_balance').innerHTML.replace(/€/, '').replace(/,/, '.')),
            createdAt: Date.now(),
            createdBy: {id: userData.userId, email: userData.userEmail}
        };

        console.log(userData);

        // Check if the user entered a name
        if (!calculationData.name) {
            alert("Calculation name is required");
            return;
        }

        // Fetch function to post data to your API
        $.ajax({
            url: '/api/v1/calculation/',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'Authorization': "Bearer " + getCookie("authToken")
            },
            data: JSON.stringify(calculationData),
            success: function(data) {
                console.log('Success:', data);
                getCalculations();
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });

    // Retrieve calculations from api
    function getCalculations() {
        // Fetch function to get data from your API
        $.ajax({
            url:'/api/v1/calculation/user/' + JSON.parse(localStorage.getItem("userDetails")).userId,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'Authorization': "Bearer " + getCookie("authToken")
            },
            success: function(data) {
                console.log('Success:', data);
                replaceCalculationLocally(data);
            },
            error: function(error) {
                console.error('Error:', error);
            }
        })
    }

    // Function to save the calculation locally
    function saveCalculationLocally(data) {
        const history = JSON.parse(localStorage.getItem('calculationHistory')) || [];
        history.push(data);
        localStorage.setItem('calculationHistory', JSON.stringify(history));
        updateHistory();
    }

    // Function to delete locally saved calculation and replace with new data
    function replaceCalculationLocally(data) {
        const history = JSON.parse(localStorage.getItem('calculationHistory')) || [];
        const newHistory = history.filter(function(calculation) {
            return calculation.id !== data.id;
        });
        newHistory.push(data);
        localStorage.setItem('calculationHistory', JSON.stringify(newHistory));
        updateHistory();
    }

    // Function to update history section
    function updateHistory() {
        // Get the calculation history from local storage
        const history = JSON.parse(localStorage.getItem('calculationHistory')) || [];

        // Get the history section
        const historySection = document.getElementById('history-content-table-body');

        // Clear the history section
        historySection.innerHTML = '';

        // If there are no calculations, hide the history section
        if (history.length === 0) {
            historySection.style.display = 'none';
            return;
        }

        // Show the history section
        historySection.style.display = 'block';

        // Loop through the calculations
        history.forEach(function(calculation) {
            console.log(calculation);
            // Create a row for each calculation
            const row = document.createElement('tr');

            // Create a cell for the calculation name
            const nameCell = document.createElement('td');
            nameCell.innerHTML = calculation.name;
            row.appendChild(nameCell);

            // Create a cell for the calculation date
            const dateCell = document.createElement('td');
            dateCell.innerHTML = new Date(calculation.createdAt).toLocaleDateString();
            row.appendChild(dateCell);

            // Create a cell for the calculation final amount
            const amountCell = document.createElement('td');
            amountCell.innerHTML = calculation.finalAmount + '€';
            row.appendChild(amountCell);

            // Create a cell for the delete button
            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'Delete';
            deleteButton.className = 'btn btn-danger';
            deleteButton.addEventListener('click', function() {
                deleteCalculation(calculation.id);

            });
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            // Add the row to the history section
            historySection.appendChild(row);
        });
    }


    // Function to delete a calculation
    function deleteCalculation(id) {
        console.log('Delete calculation');
        // Fetch function to delete data from your API
        fetch('/api/v1/calculation/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id}) // Modify as needed
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Remove the row from the table
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    //
    getCalculations();
    updateHistory();

}

// Initialize the simulator when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const apiBaseUrl = 'http://localhost/api/v1/';
    const authToken = getCookie('authToken');
    const calculationData = new CalculationData(apiBaseUrl, authToken);
    const userId = JSON.parse(localStorage.getItem("userDetails")).userId;
    console.log("User id: " + userId);

    initializeInvestmentSimulator();
    initializeHistorySection();
});