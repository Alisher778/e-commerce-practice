const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const { name } = req.body;
    console.log(file)
    cb(null, `${`${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`}${path.extname(file.originalname)}`);
  },
  destination: function (req, file, cb) {
    const { categoryName = 'products' } = req.body;
    const dir = path.join(__dirname, '../public/uploads/' + categoryName);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  }
})


module.exports = multer({ storage });