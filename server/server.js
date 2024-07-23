const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory store for OTPs and emails (for simplicity)
const otps = {};

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'r190146@rguktrkv.ac.in', // Replace with your email
        pass: 'bbhz aorr bsim aehr'   // Replace with your email password
    }
});

// Generate a random OTP
const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Endpoint to send OTP to email
app.post('/send-otp', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const otp = generateOtp();
    otps[email] = otp;

    const mailOptions = {
        from: 'r190146@rguktrkv.ac.in', // Replace with your email
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to send email' });
        }
        res.status(200).json({ message: 'OTP sent to email' });
    });
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    if (otps[email] === otp) {
        delete otps[email];
        return res.status(200).json({ message: 'OTP verified successfully' });
    }

    res.status(400).json({ error: 'Invalid OTP' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
