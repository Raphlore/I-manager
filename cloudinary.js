const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dwuwdkbwe",
  api_key: "463655155976955",
  api_secret: "BE4sMFhYn8-NpUU4bpEWvv6iKBY"
});

module.exports = cloudinary;