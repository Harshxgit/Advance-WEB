import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.listen(3000, () => {
  console.log("hey i m listening");
});
const SECRET_KEY = "0x4AAAAAAAwsPrnBYxP9tCSur4yS1X9NPJU";

const otpStore: Record<string, string> = {};

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 OTP requests per windowMs
  message: "Too many requests, please try again after 5 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 password reset requests per windowMs
  message:
    "Too many password reset attempts, please try again after 15 minutes",
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
app.post("/reset-password", passwordResetLimiter, async (req, res) => {
  const { email, otp, newPassword, token } = req.body;

  let formdata = new FormData();
  formdata.append("secret", SECRET_KEY);
  formdata.append("response", token);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: formdata,
    method: "POST",
  });
  const isSucessed = (await result.json()).success;
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
  } else {
    res.status(401).json({ message: "Invalide otp" });
  }
});
