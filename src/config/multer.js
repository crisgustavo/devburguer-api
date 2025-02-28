import multer from 'multer'
import { v4 } from 'uuid'
import { extname, resolve } from 'node:path'        //importa o que vai indicar o caminho das imagens


export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, callback) => callback(null, v4() + extname(file.originalname))
  })
};