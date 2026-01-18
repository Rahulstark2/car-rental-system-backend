import type { Response } from 'express'
export const err = (res: Response, status: number, msg: string) =>
  res.status(status).json({ success: false, error: msg })
