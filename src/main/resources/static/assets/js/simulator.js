const authToken = getCookie('authToken');
const apiBaseUrl = '/api/v1';
const userDetails = JSON.parse(localStorage.getItem("userDetails"));

function initializeInvestmentSimulator() {

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

        // Update the descriptions
        updateDescriptions(_initial_deposit, _contribution_frequency, _contribution_amount,
            _estimated_return * 100, _estimatedTax * 100, _estimatedInflation * 100, _investment_duration, balance.toFixed(2));
        console.log('updateDescriptions called with', _initial_deposit, _contribution_frequency, _contribution_amount, _estimated_return, _estimatedTax, _estimatedInflation, _investment_duration, balance);

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

    // Update descriptions
    function updateDescriptions(principalAmount, contributionFrequency, contributionAmount,
                                annualInterestRate, taxRate, inflationRate, investmentDuration, futureBalance) {

        if (contributionFrequency === 1) {
            contributionFrequency = simulator.annual;
        } else if (contributionFrequency === 12) {
            contributionFrequency = simulator.monthly;
        }

        // Update the description
        let principalAmountText = principalAmountExplanation.replace("{0}", principalAmount + "€").replace("{1}", contributionFrequency).replace("{2}", contributionAmount + "€");
        let interestEarnedText = interestExplanation.replace("{0}", annualInterestRate).replace("{1}", taxRate + "%");
        let taxExplanationText = taxExplanation.replace("{0}", taxRate + "%");
        let inflationEffectText = inflationExplanation.replace("{0}", inflationRate + "%");
        let futureBalanceText = futureBalanceExplanation.replace("{0}", investmentDuration).replace("{1}", futureBalance + "€");

        document.getElementById('simulator-results-explanation').innerHTML = `
            <div id="principal-amount">` + principalAmountText + `</div>
            <div id="interest-earned">` + interestEarnedText + `</div>
            <div id="tax-deduction">` + taxExplanationText + `</div>
            <div id="inflation-effect">` + inflationEffectText + `</div>
            <div id="future-balance">` + futureBalanceText + `</div>

        `;

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



    ////////////////////////////////////////////// HISTORY ///////////////////////////////////////////////////

    // Save calculation to history
    document.getElementById('button-save').addEventListener('click', function() {

        // Retrieve the data-value attribute values
        var contributionFrequency = document.querySelector('[name="contribution_period"]:checked').getAttribute('data-value');
        var capitalizationFrequency = document.querySelector('[name="compound_period"]:checked').getAttribute('data-value');
        console.log("Selected Value Contribution Frequency: " + contributionFrequency);
        console.log("Selected Value Capitalization Frequency: " + capitalizationFrequency);


        //ask for calculation name
        const calculationData = {
            name: prompt(simulator.enterCalculationName),
            //description: prompt(simulator.enterCalculationName),
            initialDeposit: document.getElementById('initial_deposit').dataset.value,
            contributionAmount: document.getElementById('contribution_amount').dataset.value,
            contributionFrequency: contributionFrequency,
            durationYears: parseInt(document.getElementById('investment_timespan').value),
            interestRate: document.getElementById('estimated_return').dataset.value,
            capitalizationFrequency: capitalizationFrequency,
            incomeTaxRate: document.getElementById('estimated_tax').dataset.value,
            inflationRate: document.getElementById('estimated_inflation').dataset.value,
            finalAmount: parseFloat(document.getElementById('future_balance').innerHTML.replace(/€/, '').replace(/,/, '.')),
            createdAt: Date.now(),
            createdBy: {id: userDetails.userId, email: userDetails.userEmail}
        };

        console.log(userDetails);

        // Check if the user entered a name
        if (!calculationData.name) {
            alert("Calculation name is required");
            return;
        }

        // Fetch function to post data to your API
        $.ajax({
            url: apiBaseUrl + '/calculation/',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'Authorization': "Bearer " + authToken
            },
            data: JSON.stringify(calculationData),
            success: function (data) {
                console.log('Success calculation POST:', data);
                getCalculations();
                updateHistory();
            },
            error: function(error) {
                console.error('Error calculation POST:', error);
            }
        });
    });

    // Retrieve calculations from api
    function getCalculations() {
        // Fetch function to get data from your API
        $.ajax({
            url: apiBaseUrl + '/calculation/user/' + JSON.parse(localStorage.getItem("userDetails")).userId,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'Authorization': "Bearer " + authToken
            },
            success: function (data) {
                console.log('Success:', data);
                replaceCalculationsLocally(data);
            },
            error: function(error) {
                console.error('Error:', error);
            }
        })
    }

    // Function to delete locally saved calculations and replace with new data
    function replaceCalculationsLocally(data) {
        localStorage.setItem('calculationHistory', JSON.stringify(data));
        updateHistory();
    }

    // Function to update history section
    function updateHistory() {
        // Get the calculation history from local storage
        const history = JSON.parse(localStorage.getItem('calculationHistory'));

        // Get the history section
        const tableContent = document.getElementById('history-content-table-body');

        // Clear the history section
        tableContent.innerHTML = '';

        // If there are no calculations, hide the history section
        if (history === null || history.length === 0) {
            document.getElementById('container-history').setAttribute("style", "display: none;")
            return;
        } else {
            document.getElementById('container-history').setAttribute("style", "display: block;")
        }

        // Show the history section
        //historySection.style.display = 'block';
        var calculationNumber = 0;

        // Loop through the calculations
        history.forEach(function(calculation) {

            // Increment the calculation number
            calculationNumber++;

            var date = new Date(calculation.createdAt).toLocaleDateString('en-GB');

            // Create a row for each calculation
            var row = document.createElement('tr');
            row.style.cursor = 'pointer';
            //set class
            row.setAttribute("class", "calculation-row");
            row.setAttribute("class", "align-middle");
            row.setAttribute("data-calculation-id", calculation.id);
            row.innerHTML = '<tr>' +
                '<th scope="row">' + calculationNumber + '</th>' +
                '<td>' + calculation.name + '</td>' +
                '<td class="history-additional-info-tablet">' + date + '</td>' +
                '<td class="history-additional-info-smartphone">' + calculation.initialDeposit + '€</td>' +
                '<td>' + calculation.finalAmount + '€</td>' +
                '<td><button class="btn btn-danger align-content-md-center" data-calculation-id="' + calculation.id + '"><i class="material-icons align-middle" style="pointer-events: none">delete</i><span class="button-history-delete align-middle" style="pointer-events: none">' + simulator.delete + '</span></button></td>' +
                '</tr>';

            // Add a click event listener to the historySection
            // row.addEventListener('click', function(event) {
            //     var calculationId = event.target.getAttribute('data-calculation-id');
            //
            //     // Add a click event listener to the delete button
            //     row.querySelector('.btn-danger').addEventListener('click', function() {
            //         var calculationId = event.target.getAttribute('data-calculation-id');
            //         deleteCalculation(calculationId);
            //     });
            //
            //     var calculation = history.find(c => c.id === calculationId);
            //     if (calculation) {
            //         restoreCalculationValues(calculation);
            //         console.log('Calculation restored')
            //     } else {
            //         console.log('Calculation not found on restore')
            //     }
            // });


            // Add the calculation to the history section
            tableContent.appendChild(row);

            console.log('History updated');
        });

        // Delegate the click event to the table
        tableContent.addEventListener('click', function(event) {
            const calculationId = event.target.closest('tr').getAttribute('data-calculation-id');

            // Check if the clicked element is a delete button
            if (event.target.classList.contains('btn-danger')) {
                deleteCalculation(calculationId);
            } else {
                // Handle row click for restore calculation
                var calculation = history.find(c => c.id == calculationId);
                if (calculation) {
                    restoreCalculationValues(calculation);
                    console.log('Calculation restored');
                } else {
                    console.log('Calculation not found on restore');
                }
            }
        });
    }

    function restoreCalculationValues(calculation) {
        // Update the input fields
        document.getElementById('initial_deposit').value = calculation.initialDeposit + '€';
        document.getElementById('initial_deposit').dataset.value = calculation.initialDeposit;
        document.getElementById('contribution_amount').value = calculation.contributionAmount + '€';
        document.getElementById('contribution_amount').dataset.value = calculation.contributionAmount;
        if (calculation.contributionFrequency === 'ANNUAL') {
            document.getElementById('contribution_period_annually').checked = true;
        } else if (calculation.contributionFrequency === 'MONTHLY') {
            document.getElementById('contribution_period_monthly').checked = true;
        }
        document.getElementById('investment_timespan').value = calculation.durationYears;
        document.getElementById('investment_timespan_text').innerHTML = calculation.durationYears;
        document.getElementById('estimated_return').value = calculation.interestRate + '%';
        document.getElementById('estimated_return').dataset.value = calculation.interestRate;
        document.getElementById('estimated_inflation').value = calculation.inflationRate + '%';
        document.getElementById('estimated_inflation').dataset.value = '3.00';
        document.getElementById('estimated_tax').value = calculation.incomeTaxRate + '%';
        document.getElementById('estimated_tax').dataset.value = calculation.incomeTaxRate;
        if (calculation.capitalizationFrequency === 'ANNUAL') {
            document.getElementById('compound_period_annually').checked = true;
        } else if (calculation.capitalizationFrequency === 'MONTHLY') {
            document.getElementById('compound_period_monthly').checked = true;
        }

        // Update the chart and other UI elements
        updateChart();
        // Any other updates required...
    }


    // Function to delete a calculation
    function deleteCalculation(id) {
        console.log('Delete calculation');
        // Fetch function to delete data from your API
        fetch(apiBaseUrl + '/calculation/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({id: id})
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                getCalculations();
                //updateHistory();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        // getCalculations();
        // updateHistory();
    }

    //
    getCalculations();
    updateHistory();
}

// Initialize the simulator when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeInvestmentSimulator();
});