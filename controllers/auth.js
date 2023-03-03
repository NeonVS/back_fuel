const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {validationResult} = require('express-validator');

const User = require('../models/user');

exports.signup = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error = new Error(errors.errors[0].msg);
        error.statusCode = 422;
        return next(error);
    }
    try{
        const email = req.body.email;
        const password = req.body.password;
        let hashPw;
        try{
            hashPw = await bcrypt.hash(password,12);
        }catch(error){
            throw error;
        }
        const user = new User({
            email: email,
            password: hashPw
        });
        const savedUser = await user.save();
        const userId = savedUser._id.toString();
        const token = jwt.sign({email: user.email,userId:userId},`${process.env.AUTH_SECRET}`);
        await User.findByIdAndUpdate({_id:user._id},{token:token});
        res.status(201).json({
            userId:userId,
            message: 'success',
            token: token
        })
    }catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        return next(error);
    }
}

exports.login = async(req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error = new Error(errors.errors[0].msg);
        error.statusCode = 422;
        return next(error);
    }
    try{
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({email:email});
        if(!user){
            const error = new Error('Email not registered');
            error.statusCode = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password,user.password);
        if(!isEqual){
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({email: email,userId:user._id},`${process.env.AUTH_SECRET}`);
        await User.findByIdAndUpdate({_id:user._id},{token:token});
        res.status(200).json({
            userId:user._id,
            message: 'success',
            token: token
        })
    }catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        return next(error);
    }
}