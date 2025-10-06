const jwt = require('jsonwebtoken');

const generateJWT = (uid, role = 'user') => {
    return new Promise((resolve, reject)=>{
        const payload = {uid, role};

        jwt.sign(payload,process.env.JWT_KEY,{
            expiresIn:'24h'
        },(err,token)=>{
            if (err) {
                //No se pudo crear el token
                reject('JWT cannot be created');
            } else {
                //TOKEN
                resolve(token);
            }
        })
    });
}

module.exports ={
    generateJWT
}