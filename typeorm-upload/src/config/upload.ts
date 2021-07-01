import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tpmFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tpmFolder,

  storage: multer.diskStorage({
    destination: tpmFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(5).toString('hex');
      const fileName = `${fileHash}-${file.originalname.replace(/\s/g, '')}`;

      return callback(null, fileName);
    },
  }),
};
