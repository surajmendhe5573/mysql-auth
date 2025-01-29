const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const signUp= async(req, res)=>{
    try {
        const {name, email, password}= req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: 'Internal server error'});
        }

        const userExist= await User.findByEmail(email);
        if(userExist.length > 0){
            return res.status(409).json({message: 'User already exists.'});
        }

        const hashedPassword= await bcrypt.hash(password, 10);
        
        await User.create(name, email, hashedPassword);
        res.status(201).json({message: 'User sign up successfully'});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const login= async(req, res)=>{
    try {
        const {email, password}= req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Email and password are required'});
        }

        const userExist= await User.findByEmail(email);
        if(userExist.length == 0){
            return res.status(404).json({message: 'User not found'});
        }

        const user= userExist[0];

        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token= jwt.sign({userId: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({message: 'Login successful', token});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const getAllUsers= async(req, res)=>{
    try {
        const users= await User.findAll();
        res.status(200).json({message: 'Users fethced successfully', data:users});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params; 
        const { name, email, password } = req.body;

        
        const user = await User.findById(id);
        if (user.length==0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const userExist = await User.findByEmail(email);
        if (userExist.length > 0 && userExist[0].id != id) {
            return res.status(400).json({ message: 'This email is already taken by another user' });
        }

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await User.update(id, name, email, hashedPassword);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUser= async(req, res)=>{
    try {
        const {id}= req.params;

        const user= await User.findById(id);
        if(user.length==0){
            res.status(404).json({message: 'User not found'});
        }

        await User.delete(id);
        res.status(200).json({message: 'User deleted successfully'});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {signUp, login, getAllUsers, updateUser, deleteUser};
