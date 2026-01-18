import type { Request, Response } from 'express'
import { prisma } from '../prisma.js'
import { err } from '../utils/error.js'

const valid = (c: string, d: number, r: number) => c && d && r && d < 365 && r <= 2000

export const createB = async (req: Request, res: Response) => {
  const { carName, days, rentPerDay } = req.body
  if (!valid(carName, days, rentPerDay)) return err(res, 400, 'invalid inputs')
  const b = await prisma.booking.create({
    data: { user_id: req.user!.userId, car_name: carName, days, rentPerDay, status: 'booked' }
  })
  res.status(201).json({ success: true, data: { message: 'Booking created successfully', bookingId: b.id, totalCost: b.days * b.rentPerDay } })
}

export const listB = async (req: Request, res: Response) => {
  const { bookingId, summary } = req.query
  if (bookingId) {
    const b = await prisma.booking.findFirst({ where: { id: Number(bookingId), user_id: req.user!.userId } })
    if (!b) return err(res, 404, 'bookingId not found')
    return res.json({ success: true, data: [{ ...b, totalCost: b.days * b.rentPerDay }] })
  }
  if (summary === 'true') {
    const bs = await prisma.booking.findMany({ where: { user_id: req.user!.userId, status: { in: ['booked', 'completed'] } } })
    const totalBookings = bs.length
    const totalAmountSpent = bs.reduce((a, b) => a + b.days * b.rentPerDay, 0)
    return res.json({ success: true, data: { userId: req.user!.userId, username: req.user!.username, totalBookings, totalAmountSpent } })
  }
  const bs = await prisma.booking.findMany({ where: { user_id: req.user!.userId } })
  const d = bs.map(b => ({ ...b, totalCost: b.days * b.rentPerDay }))
  res.json({ success: true, data: d })
}

export const updateB = async (req: Request, res: Response) => {
  const id = Number(req.params.bookingId)
  const b = await prisma.booking.findUnique({ where: { id } })
  if (!b) return err(res, 404, 'booking not found')
  if (b.user_id !== req.user!.userId) return err(res, 403, 'booking does not belong to user')
  const { carName, days, rentPerDay, status } = req.body
  if (status) {
    await prisma.booking.update({ where: { id }, data: { status } })
  } else {
    if (!valid(carName, days, rentPerDay)) return err(res, 400, 'invalid inputs')
    await prisma.booking.update({ where: { id }, data: { car_name: carName, days, rentPerDay } })
  }
  const r = await prisma.booking.findUnique({ where: { id } })
  res.json({ success: true, data: { message: 'Booking updated successfully', booking: { ...r, totalCost: r!.days * r!.rentPerDay } } })
}

export const deleteB = async (req: Request, res: Response) => {
  const id = Number(req.params.bookingId)
  const b = await prisma.booking.findUnique({ where: { id } })
  if (!b) return err(res, 404, 'booking not found')
  if (b.user_id !== req.user!.userId) return err(res, 403, 'booking does not belong to user')
  await prisma.booking.delete({ where: { id } })
  res.json({ success: true, data: { message: 'Booking deleted successfully' } })
}
