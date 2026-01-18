import express from 'express'
import authRoutes from './auth/routes.js'
import bookingRoutes from './bookings/routes.js'
const app=express()
app.use(express.json())
app.use('/auth',authRoutes)
app.use('/bookings',bookingRoutes)
export default app
