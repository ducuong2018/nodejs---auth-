import {validatePhoneNumber} from "./functionBase";
const db = require('../models');
const User = db.sequelize.models.Users;
const companyInfoAdvan = db.sequelize.models.Company_info_advanceds;

interface IProfile{
    role:"NORMAL"| "SELLER" | "BUYER",
    name_enterprise:string,
    address_enterprise:{
        city:number,
        district:number,
        ward:number,
        detail_address:string
    },
    phone_number:number
}
export const addProfile = async (req,res)=>{
    try {
        const email = req.jwtDecoded.email
        const data:IProfile = req.body
        if(data.role !== "NORMAL" && data.role!== "SELLER" && data.role!= 'BUYER'){
            return  res.status(400).send({
                message:"NORMAL or BUYER or SELLER!"
            })
        }
        if(!validatePhoneNumber(data.phone_number)){
            return  res.status(400).send({
                message:"Phone number is not in the correct format!"
            })
        }
        if(!data.name_enterprise){
            return  res.status(400).send({
                message:"Name enterprise!"
            })
        }
        if(!data.address_enterprise.city){
            return  res.status(400).send({
                message:"City!"
            })
        }
        if(!data.address_enterprise.district){
            return  res.status(400).send({
                message:"District!"
            })
        }
        if(!data.address_enterprise.ward){
            return  res.status(400).send({
                message:"ward!"
            })
        }
        if(!data.address_enterprise.detail_address){
            return  res.status(400).send({
                message:"detail_address!"
            })
        }

        const result = await User.findOne({
            where:{
                email:email
            }
        })


        if(result){
            result.role = data.role;
            result.phone_number = data.phone_number;
            result.profile = {
                "name":result.profile.name,
                "name_enterprise":data.name_enterprise,
                "address_enterprise":data.address_enterprise
            }
            // result.profile.name_enterprise=data.name_enterprise
            // result.profile.address_enterprise = data.address_enterprise
            result.save();
            return res.send(result)

        }
        else return res.status(400).send({
            message:"Email not find!"
        })
    }
    catch (err){
        return res.status(400).send({
            message:err.message
        })
    }

}

export const infoAccount = async (req,res)=>{
    try {
        const id = req.jwtDecoded.id;
        console.log("ko vao day")
        const results = await User.findAll({
            where:{
                id:id
            },
            attributes: ["email", "phone_number", "profile"],
            include: [
                {
                    model: db.Company_infos,
                    attributes: ["name"],
                },
                {
                    model: companyInfoAdvan
                }
            ],
        });
        return res.send(results);
    }
    catch (e) {
        return res.status(400).send({
            message:e.message
        })
    }
}
interface IUpdateProfileUser {
    image:{url:string},
    name:string,
    name_enterprise:string,
    address_enterprise: {
        city: number,
        ward: number,
        district: number,
        detail_address: string
    }
}
export const updateProfileBasicUser =async (req,res) => {
    try {
        const id = req.jwtDecoded.id;
        const data:IUpdateProfileUser = req.body
        if(!data.image.url){
            return res.status(400).send({
                message:"Image!"
            })
        }
        if(!data.name_enterprise){
            return res.status(400).send({
                message:"name_enterprise!"
            })
        }
        if(!data.address_enterprise.city){
            return res.status(400).send({
                message:"city!"
            })

        }
        if(!data.address_enterprise.ward){
            return res.status(400).send({
                message:"ward!"
            })
        }
        if(!data.address_enterprise.district){
            return res.status(400).send({
                message:"district!"
            })
        }
        if(!data.address_enterprise.detail_address){
            return res.status(400).send({
                message:"detail_address!"
            })
        }
        const result = await User.findOne({
            attributes:["profile"],
            where:{
                id:id
            }
        });
        if(result){
            result.profile = {
                image : data.image,
                name :data.name,
                name_enterprise :data.name_enterprise,
                address_enterprise : data.address_enterprise,
            }
            result.save();
            return res.send(result
            );
        }
        else return res.status(400).send({
            message: "Error"
        })
    } catch (e) {
        return res.status(400).send({
            message: "!@312"
        })
    }
}
interface IUpdateProfileContact{
    title:string,
    sex:"MALE"|"FEMALE"|"OTHER",
    phone_number?:number,
    phone_desk?:number,
    fax?:string
}
export const updateProfileContact = async (req,res) =>{
    try {
        const id = req.jwtDecoded.id;
        const data:IUpdateProfileContact = req.body;
        if(!data.title){
            return res.send({
                message:"title!"
            })
        }
        if(!data.sex){
            return res.send({
                message:"sex!"
            })
        }
        if(data.phone_number){
            if(!validatePhoneNumber(data.phone_number)){
                return res.send({
                    message:"Incorrect phone number format!"
                })
            }
        }
        const result = await User.findOne({
            where:{
                id:id
            }
        });
        if(result){
            result.profile.title = data.title;
            result.profile.sex = data.sex;
            result.phone_number = data.phone_number;
            result.profile.phone_desk = data.phone_desk;
            result.profile_fax = data.fax;
            result.save();
            return res.send({
                phone_number:result.phone_number,
                profile:result.profile
            })
        }
    }
    catch (e) {
        return res.status(400).send({
            message: e.message
        })
    }
}

