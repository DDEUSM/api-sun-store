import multer from 'multer';

const storage_config = multer.diskStorage({
    destination : (req, file, cb) => {
        if(file.fieldname === 'product-images'){
            cb(null, './public/images/product-test');
        }else if(file.fieldname === 'profile-image'){
            cb(null, './public/images/profile-test');
        }
    },
    filename : (req, file, cb) => {
        const mime_type = file.originalname.split('.')[1];
        const file_name = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.${mime_type}`
        cb(null, file_name);
    }
});

export const upload = multer({ storage : storage_config });

