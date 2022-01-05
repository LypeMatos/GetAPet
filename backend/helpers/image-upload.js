const multer = require('multer');
const path = require('path');

//caminha para armazenar as imagens
const imageStore = multer.diskStorage({
    destination: function(req, file, cb){
        let folder = "";
        if(req.baseUrl.includes('users')){
            folder = 'users'
        }else if(req.baseUrl.includes('pets')){
            folder = 'pets';
        }

        cb(null, `public/image/${folder}`);
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const imageUpload = multer({
    storage: imageStore,
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return cb(new Error('Envie apenas JPG ou PNG'));
        }
        cb(undefined, true);
    }    
})

module.exports = {imageUpload};