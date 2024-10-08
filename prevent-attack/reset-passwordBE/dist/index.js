"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.listen(3000, () => {
    console.log("hey i m listening");
});
const SECRET_KEY = "0x4AAAAAAAwsPrnBYxP9tCSur4yS1X9NPJU";
const otpStore = {};
const otpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per windowMs
    message: "Too many requests, please try again after 5 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 password reset requests per windowMs
    message: "Too many password reset attempts, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
//@ts-ignore
app.post("/generate-otp", otpLimiter, (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    const otp = Math.floor(100000 + Math.random() * 90000).toString();
    otpStore[email] = otp;
    console.log(`OTP for ${email}:${otp}`); //Log the otp to the console
    res.status(200).json({ message: "OTP generated and logged" });
});
//endpoint to reset password
//@ts-ignore
app.post("/reset-password", passwordResetLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword, token } = req.body;
    let formdata = new FormData();
    formdata.append("secret", SECRET_KEY);
    formdata.append("response", token);
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = yield fetch(url, {
        body: formdata,
        method: "POST",
    });
    const isSucessed = (yield result.json()).success;
    if (!isSucessed) {
        return res.status(403).json({ message: "Invalid reCAPTCHA token" });
    }
    if (!email || !otp || !newPassword) {
        return res
            .status(400)
            .json({ message: "email , otp and newpassword are required" });
    }
    if (otpStore[email] === otp) {
        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        delete otpStore[email];
        res.status(200).json({ message: "Password has been successfully" });
    }
    else {
        res.status(401).json({ message: "Invalide otp" });
    }
}));
