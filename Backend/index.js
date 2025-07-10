const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Replace with your actual FastForex API key
const API_KEY = process.env.YOUR_API_KEY;

app.use(cors());
app.use(express.json());

/**
 * Convert currency using FastForex.io
 * Example: /api/convert?from=USD&to=EUR&amount=100
 */
app.get("/api/convert", async (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        return res.status(400).json({ error: "Missing 'from', 'to', or 'amount'" });
    }

    try {
        const url = `https://api.fastforex.io/convert?from=${from}&to=${to}&amount=${amount}&api_key=${API_KEY}`;
        const response = await axios.get(url);

        const rate = response.data?.result?.rate;
        console.log(rate)
        if (!rate) {
            return res.status(500).json({
                error: "Failed to retrieve rate from FastForex",
                details: response.data
            });
        }

        const converted = parseFloat(amount) * rate;

        res.json({
            success: true,
            from,
            to,
            amount: parseFloat(amount),
            rate,
            result: converted
        });

    } catch (error) {
        res.status(500).json({
            error: "Currency conversion failed",
            details: error.response?.data || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Currency Converter API running at http://localhost:${PORT}`);
});
