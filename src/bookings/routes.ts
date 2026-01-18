import {Router} from 'express'
import {auth} from '../middleware/auth.js'
import {createB,listB,updateB,deleteB} from './controller.js'
const r=Router()
r.post('/',auth,createB)
r.get('/',auth,listB)
r.put('/:bookingId',auth,updateB)
r.delete('/:bookingId',auth,deleteB)
export default r
