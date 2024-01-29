const express = require ('express')
const cors = require('cors');
const path = require ('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'ajshdjjdhfjjshdjjd@#$%&*! fjjshdjjhfjfhhdj'
//const { ConnectionClosedEvent } = require('mongodb')

mongoose.connect('mongodb://localhost:27017/login-app-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})



const app = express()
app.use(cors());
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/change-password', async (req, res) => {
  const { token, newPassword: plainTextPassword } = req.body

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({ status: 'error', error: 'Invalid password' })
  }
  
  if (plainTextPassword.length < 6) {
    return res.json({
      status: 'error',
      error: 'Password too small. Should be atleast 6 characters'
    })
  }
  try {
    const user = jwt.verify(token, JWT_SECRET)
    const _id = user.id

    const password = await bcrypt.hash(plainTextPassword, 10)
    await User.updateOne(
      { _id },
      {
        $set: { password }
      }
    )
    res.json({ status: 'ok' })
  } catch (error) {
    console.log(error)
    res.json({ status: 'error', error: ';))'})
  }
 })

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username}).lean();

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid username/password' });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );
    return res.json({ status: 'ok', data: token });
  }

  res.json({ status: 'error', error: 'Invalid username/password' });
});

app.post('/api/register', async (req, res) => {
  const { username, password: plainTextPassword } = req.body
  
if (!username || typeof username !== 'string') {
  return res.json({ status: 'error', error: 'Invalid username' })
}

if (!plainTextPassword || typeof plainTextPassword !== 'string') {
  return res.json({ status: 'error', error: 'Invalid password' })
}

if (plainTextPassword.length < 6) {
  return res.json({
    status: 'error',
    error: 'Password too small. Should be atleast 6 characters'
  })
}

  const password = await bcrypt.hash(plainTextPassword, 10)

  try {
    const response = await User.create({
      username,
      password
    })
    console.log('User create successfully: ', response)
  } catch (error) {
    if (error.code === 11000 ) {
      return res.json({ status: 'error', error: 'Username already in use' })
   }
   throw error
  }

  res.json({ status : 'OKAY' })
})

app.listen(9999, () => {
  console.log('server up at 9999');
})