const model = require('../models/')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
require('dotenv').config()

async function createUsername(req, res) {
  let {username, password, password2} = req.body

  username = username.trim()

  // Check that all fields details were provided
  if(!username || !password || !password2) {
    return res.status(400).json({message: 'All fields are required.'})
  }

  // Check if both passwords match
  if(password !== password2) {
    return res.status(400).json({message: 'Password do not match.'})
  }

  // Check if password or username are too short
  if (username.length < 3 || password.length < 6) {
    return res.status(400).json({ message: 'Username or password too short.' })
  }

  // Check if user already exists
  const userExists = await model.checkUsers(username)
  if(userExists) {
    return res.status(400).json({message: 'User Already Exists.'})
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await model.createUser(username, hashedPassword)
    
    if (result) {

      const userData = result

      //Create token
      delete userData.password

      const payload = {
        id: userData.id,
        username: userData.username,
      }

      const oneHour = 60 * 60 * 1000 

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: oneHour / 1000 
      })

      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: oneHour,
        sameSite: 'strict' 
      })

      res.status(201).json({message: 'The new user has been successfully created.'})
    } else {
      res.status(400).json({message: 'The user could not be created.'})
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An unexpected error occurred while creating the user.' })
  }
}


async function processLogin(req, res) {
  const {username, password} = req.body;

  //Check if users exists, if it doesn't, then return
  const userData = await model.checkUsers(username)
  if(!userData) {
    return res.status(404).json({message: 'User could not be found.'})
  } 

  try {
    //If user exists, compare passwords
    if(await bcrypt.compare(password, userData.password)) {

      //Create token
      delete userData.password

      const payload = {
        id: userData.id,
        username: userData.username,
      }

      const oneHour = 60 * 60 * 1000 

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: oneHour / 1000 
      })

      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: oneHour,
        sameSite: 'strict' 
      })
      
      return res.status(200).json({ message: 'Login successful.' })
    } else {
      return res.status(401).json({ message: 'Invalid password.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function processLogout(req, res) {
    res.clearCookie("jwt", { path: "/" });
    res.locals.loggedin = 0;
    res.redirect("/login.html");
}

module.exports = { createUsername, processLogin, processLogout };