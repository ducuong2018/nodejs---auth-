
const jwtHelper = require("../helpers/jwtHelper");

// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = "cuongdc"

export const isAuth = async (req,res,next)=>{
    const tokenFromClient =  req.headers["x-access-token"];
    if(tokenFromClient){
        try {
            req.jwtDecoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            next()

        }catch(error){
            console.log(error);
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
    }
    else {
        return  res.status(403).send({
            message:"No token"
        });
    }
}

