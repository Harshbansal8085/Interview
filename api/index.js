// const express = require('express')
import express from "express"
import mongoose from "mongoose"
import userRouter from "./routes/user.router.js"
import authRouter from "./routes/auth.router.js"
import listingRouter from "./routes/listing.route.js"
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import cookieParser from "cookie-parser"
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
app.use(cookieParser())
// console.log(process.env.MONGO)
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to mongo')
  })
  .catch((err) => {
    console.log(err);
  })
const __dirname = path.resolve()


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/listing", listingRouter)
app.use(express.static(path.join(__dirname, '/client/dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message
  })
})