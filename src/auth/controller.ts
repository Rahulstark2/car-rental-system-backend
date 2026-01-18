import type {Request,Response} from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {prisma} from '../prisma.js'
import {err} from '../utils/error.js'

export const signup=async(req:Request,res:Response)=>{
  const {username,password}=req.body
  if(!username||!password)return err(res,400,'invalid inputs')
  const u=await prisma.user.findUnique({where:{username}})
  if(u)return err(res,409,'username already exists')
  const hash=await bcrypt.hash(password,10)
  const r=await prisma.user.create({data:{username,password:hash}})
  res.status(201).json({success:true,data:{message:'User created successfully',userId:r.id}})
}

export const login=async(req:Request,res:Response)=>{
  const {username,password}=req.body
  if(!username||!password)return err(res,400,'invalid inputs')
  const u=await prisma.user.findUnique({where:{username}})
  if(!u)return err(res,401,'user does not exist')
  const ok=await bcrypt.compare(password,u.password)
  if(!ok)return err(res,401,'incorrect password')
  const token=jwt.sign({userId:u.id,username},process.env.JWT_SECRET!)
  res.json({success:true,data:{message:'Login successful',token}})
}
