import express from 'express'
import authRoutes from './auth/routes.js'
import bookingRoutes from './bookings/routes.js'
import { rateLimit } from 'express-rate-limit'

const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/bookings', bookingRoutes)
export default app
