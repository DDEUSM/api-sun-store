import multer from 'multer';
import fs from 'fs';

const temporaryPaths: {[fieldName: string]: string} = {
    'profile_image' : './temp/',
    'product_image' : './temp/'
}

function toTemporaryPath(fieldName: string, cb: Function)
{
    const path = temporaryPaths[fieldName]
    /*
    fs.access(path, (error) => 
    {
        if (error) 
        {
            fs.mkdirSync(path)
        }
    })
    */
    cb(null, path)
}

const storage = multer.diskStorage ({
    destination : (req, file, cb) => 
    {               
        toTemporaryPath(file.fieldname, cb)
    },
    filename : (req, file, cb) => 
    {
        const mime_type = file.originalname.split('.')[1];
        const file_name = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.${mime_type}`
        cb(null, file_name);
    }
});

const limits = {
    fileSize: 550000
}

export const upload = multer({ storage, limits });

