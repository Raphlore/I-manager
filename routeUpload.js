const express = require('express');
const router = express.Router();
const cloudinary = require('./cloudinary');
const upload = require('./multer');
const media = require('./model/media');
const user = require('./model/user');

router.post('/upload/:userId', upload.single('image'), function (req, res) {
  cloudinary.uploader.upload(req.file.path, async function (err, result){
    if(err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Error'
      })
    }

    const User = await user.findById(req.params.userId)
    if (!User) {
      return res.status(400).json({ success: false, message: 'Invalid user ID'})
    }
    await media.create({
      userId: req.params.userId,
      mediaUrl: result.secure_url
    })
    res.status(200).json({
      success: true,
      message: 'Uploaded!',
      data: result
    })
  })
});

module.exports = router;
