import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { err } from '../utils/error.js'
import type { UserPayload } from '../types.js'

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const h = req.headers.authorization
  if (!h) return err(res, 401, 'Authorization header missing')
  const t = h.split(' ')[1]
  if (!t) return err(res, 401, 'Token missing after Bearer')
  try {
    req.user = jwt.verify(t, process.env.JWT_SECRET!) as UserPayload
    next()
  } catch (e) { err(res, 401, 'Token invalid') }
}
