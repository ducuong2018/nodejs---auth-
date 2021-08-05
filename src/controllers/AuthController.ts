
const jwtHelper = require("../helpers/jwtHelper");
const db = require('../models');
const User = db.sequelize.models.Users;
import {passwordEncryption,passwordCheck,validateEmail,setRedis,getRedis,clearRedis} from "./functionBase";
import nodemailer from  "nodemailer";
// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
const  tokenList = {};
// Thời gian sống của token
const accessTokenLife =  process.env.ACCESS_TOKEN_LIFE || "1h";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "cuongdc";
// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh-token-cuongdc";

export const login = async (req,res) => {
    try {
        // Mình sẽ comment mô tả lại một số bước khi làm thực tế cho các bạn như sau nhé:
        // - Đầu tiên Kiểm tra xem email người dùng đã tồn tại trong hệ thống hay chưa?
        // - Nếu chưa tồn tại thì reject: User not found.
        // - Nếu tồn tại user thì sẽ lấy password mà user truyền lên, băm ra và so sánh với mật khẩu của user lưu trong Database
        // - Nếu password sai thì reject: Password is incorrect.
        // - Nếu password đúng thì chúng ta bắt đầu thực hiện tạo mã JWT và gửi về cho người dùng.
        const user = await User.findAll({
            where: {
                email: req.body.email
            }
        })
        if (user) {
            if (passwordCheck(req.body.password, user[0].dataValues.password_crypt)) {
                const userData = {
                    id:user[0].dataValues.id,
                    email: req.body.email
                };
                // debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
                const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);

                // debug(`Thực hiện tạo mã Refresh Token, [thời gian sống 1 năm]`);
                const refreshToken = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);

                // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
                // lưu ý trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
                tokenList[refreshToken] = {accessToken, refreshToken};
                return res.status(200).json({accessToken, refreshToken});
            } else {
                return res.status(400).json({
                    message: "Password is incorrect"
                });
            }
        }
        else {
            return res.status(400).json({
                message: "User not found"
            });
        }

    }catch (err){
        return res.status(400).json({
            message: err.message
        });
    }
}
export const refreshToken = async (req, res) => {
    // User gửi mã refresh token kèm theo trong body
    const refreshTokenFromClient = req.body.refreshToken;
    // debug("tokenList: ", tokenList);

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
            const userData = decoded.data;
            const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);

            // gửi token mới về cho người dùng
            return res.status(200).json({accessToken});
        } catch (error) {
            res.status(403).json({
                message: 'Invalid refresh token.',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
};

const  sendOTP = (email) =>{
    return new Promise((resolve => {
        let otp = Math.floor(100000 + Math.random() * 900000);
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: 'Gmail',
            auth: {
                user: 'cuongdc@mcg-corp.vn',
                pass: 'Ducuong2020',
            }
        });
        const mailOptions = {
            to: email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
        resolve(otp);
    }));
}

const verifyOtp  = async(email,otp) =>{
    const data :any = await getRedis(email)
    const dataJson = JSON.parse(data);
    if(otp == dataJson.otp) return true;
    else return false
}



export const  register= async (req,res) =>{
    const {email,password,name} = req.body
    if(!validateEmail(email)){
        return  res.status(400).json({
            message:"Wrong email format !"
        })
    }
    if(!password){
        return  res.status(400).json({
            message:"Password!"
        })
    }
    if(!name){
        return  res.status(400).json({
            message:"Name!"
        })
    }
    const checkEmail = await User.findOne({
        where:{
            email
        },
    });
    if (checkEmail) {
        return res.status(400).send({
            message: 'An account with that username already exists!',
        });
    }

    try {
    const  otp = await sendOTP(email);
       await setRedis(email,{
            email:email,
            name:name,
            password:password,
            otp:otp
        });
       return res.send({
           message:"Send Otp!"
       })
    }
    catch (err){
        return res.status(500).send({
            message:err.message
        })
    }

}
export const verifyRegisterOtp = async (req,res) =>{
    try {
        const isOtp = await verifyOtp(req.body.email,req.body.otp)
        if(isOtp){
            const data:any = await getRedis(req.body.email)
            const dataJson = JSON.parse(data)
            if(dataJson.email !== req.body.email){
                return res.status(400).send({
                    message:"Email does not match!"
                });
            }
            if(dataJson.name !== req.body.name){
                return res.status(400).send({
                    message:"Name does not match!"
                });
            }
            if (dataJson.password !== req.body.password) {
                return res.status(400).send({
                    message:"Password does not match!"
                });
            }
            const passwordBcrypt = await passwordEncryption(dataJson.password);
            const result = await User.create({
                email:dataJson.email,
                profile:{"name":dataJson.name},
                password_crypt:passwordBcrypt,
                users_state:"ACTIVATED",
                confirmed_at:Date.now()
            });
           await clearRedis(dataJson.email);
            return res.send(result);
        }
        else {
            return  res.status(400).send({
                    message:"OTP false!"
                }
            )
        }
    }
    catch (err){
        return res.status(400).send({
            message:err.message
        })

    }

}
export const forgotPassword = async (req,res) =>{
    try {
        const result = await User.findOne({
            where:{
                email:req.body.email
            }
        });
        if(result){
           const otp = await sendOTP(req.body.email);
           await setRedis(req.body.email,{otp:otp});
            return res.send({
                message:"Send otp!"
            })
        }
        else {
            return res.status(400).send({
                message:"Email not find!"
            })
        }

    }
    catch (err){
        return res.status(400).send({
            message:err.message
        })
    }
}
export const verifyForgotPasswordOtp = async (req,res) =>{
    try {
        const isOtp = await verifyOtp(req.body.email,req.body.otp);
        if(isOtp){
            return res.send({
                message:"Verification code is correct!"
            })
        }
        else {
            return res.status(400).send({
                message:"Verification code does not exist!"
            })
        }
    }
    catch (err){
        return res.status(400).send({
            message:err.message
        })
    }

}
export const changePassWord = async (req,res)=>{
    try {
        if(!req.body.password){
            return res.status(400).send({
                message:"Password empty!"
            })
        }
        if(!req.body.email){
            return res.status(400).send({
                message:"Email empty!"
            })
        }
        if(!req.body.confirmPassword){
            return res.status(400).send({
                message:"ConfirmPassword empty!"
            })
        }
        if(req.body.password !== req.body.confirmPassword){
            return res.status(400).send({
                message:"Another password confirm password!"
            })
        }
        const isOtp = await verifyOtp(req.body.email,req.body.otp);
        if(!isOtp){
            return res.status(400).send({
                message:"Verification code does not exist!"
            })
        }
        const passwordBcrypt = await passwordEncryption(req.body.password);
        const result = User.findOne({
            where:{
                email:req.body.email
            }
        })
        if(result){
            result.password_crypt = passwordBcrypt,
                result.updatedAt = Date.now()
            result.save();
            return res.send(result);
        }
        else {
            return res.status(400).send({
                message:"Email not find!"
            })
        }

        return res.send({
            message:"Success!"
        });
    } catch (err){
        return res.status(400).send({
            message:err.message
        })
    }
}

