const currencyList = {
    USD: "🇺🇸 USD",
    EUR: "🇪🇺 EUR",
    NGN: "🇳🇬 NGN",
    GBP: "🇬🇧 GBP",
    JPY: "🇯🇵 JPY",
    ZAR: "🇿🇦 ZAR",
    KES: "🇰🇪 KES",
    CAD: "🇨🇦 CAD"
};

const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const resultInput = document.getElementById("result");
const rateLabel = document.getElementById("rateLabel");

// Populate dropdowns
function populateSelects() {
    for (let code in currencyList) {
        const optionFrom = new Option(currencyList[code], code);
        const optionTo = new Option(currencyList[code], code);
        fromSelect.appendChild(optionFrom);
        toSelect.appendChild(optionTo);
    }

    fromSelect.value = "USD";
    toSelect.value = "NGN";
}

populateSelects();

// Convert handler
document.getElementById("convertForm").addEventListener("input", async (e) => {
    e.preventDefault();

    const from = fromSelect.value;
    const to = toSelect.value;
    const amount = parseFloat(amountInput.value);

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    try {
        // Call your backend
        const response = await fetch(`http://localhost:5000/api/convert?from=${from}&to=${to}&amount=${amount}`);
        const data = await response.json();

        if (data.success) {
            resultInput.value = data.result.toFixed(2); // Show converted amount
            rateLabel.textContent = `1 ${from} = ${data.rate} ${to}`; // Show rate from API
        } else {
            resultInput.value = "";
            rateLabel.textContent = "Conversion failed.";
        }
    } catch (err) {
        console.error("Error fetching rate:", err);
        resultInput.value = "";
        rateLabel.textContent = "Error fetching rate.";
    }
});
