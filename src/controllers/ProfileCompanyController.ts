const db = require('../models');
const companyInfo = db.sequelize.models.Company_infos;
const companyInfoAdvan = db.sequelize.models.Company_info_advanceds;
interface IProfileCompany{
    name:string,
    registered_business_address:{
        city:number,
        district:number,
        ward:number,
        detail_address:string
    },
    working_address:{
        city:number,
        district:number,
        ward:number,
        detail_address:string
    },
    state:string,
    business_code:string,
    image_items:{url:string},
    main_items:[],
    founded_year:string,
    company_size:string,
    name_representative:string,
}
export const addCompanyInfo = async (req,res)=>{
    try {
        const id = req.jwtDecoded.id
        const data:IProfileCompany = req.body
        if(!data.name){
            return res.status(400).send({
                message:"Name!"
            })
        }
        if(!data.registered_business_address.city){
            return res.status(400).send({
                message:"City!"
            })
        }
        if(!data.registered_business_address.district){
            return res.status(400).send({
                message:"district!"
            })
        }
        if(!data.registered_business_address.ward){
            return res.status(400).send({
                message:"ward!"
            })
        }
        if(!data.registered_business_address.detail_address){
            return res.status(400).send({
                message:"detail_address!"
            })
        }
        if(!data.working_address.city){
            return res.status(400).send({
                message:"City!"
            })
        }
        if(!data.working_address.district){
            return res.status(400).send({
                message:"district!"
            })
        }
        if(!data.working_address.ward){
            return res.status(400).send({
                message:"ward!"
            })
        }
        if(!data.working_address.detail_address){
            return res.status(400).send({
                message:"detail_address!"
            })
        }

        if(!data.business_code){
            return res.status(400).send({
                message:"business_code!"
            })
        }
        if(!data.image_items.url){
            return res.status(400).send({
                message:"image_items!"
            })
        }
        if(!data.main_items){
            return res.status(400).send({
                message:"main_items!"
            })
        }
        if(!data.founded_year){
            return res.status(400).send({
                message:"founded_year!"
            })
        }
        if(!data.company_size){
            return res.status(400).send({
                message:"company_size!"
            })
        }
        if(!data.name_representative){
            return res.status(400).send({
                message:"company_size!"
            })
        }

        const result = await  companyInfo.create({
            id:id,
            name:data.name,
            registered_business_address:data.registered_business_address,
            working_address:data.working_address,
            state:data.state,
            business_code:data.business_code,
            image_items:data.image_items,
            main_items:data.main_items,
            founded_year:data.founded_year,
            company_size:data.company_size,
            name_representative:data.name_representative
        })
        return res.send(result)

    }
    catch (err){
        return res.status(400).send({
            message:err.message
        })
    }
}
interface ICompanyIntroduction{
    company_logo:{url:string},
    detail_company:string,
    image_company:{url:string}
}
export const companyIntroduction = async (req,res) =>{
    try {
        const id = req.jwtDecoded.id
        const data:ICompanyIntroduction = req.body;
        if(!data.company_logo.url){
            return res.status(400).send({
                message:"Logo company!"
            })
        }
        if(!data.detail_company){
            return res.status(400).send({
                message:"Image company!"
            })
        }
        if(!data.image_company.url){
            return res.status(400).send({
                message:"Image company!"
            })
        }
        const result = await  companyInfoAdvan.create({
            id:id,
            company_introduction:{
                company_logo : data.company_logo,
                detail_company:data.detail_company,
                image_company:data.image_company,
                state:"NON_VERIFIED"
            }
        });
        return res.send(result);


    }
    catch (e) {
      return res.status(400).send({
          message:e.message,
      })
    }

}
interface IProductionCapacity{
    production_process:{
        process_name:string,
        image:{url:string},
        description:string
    }[],
    devices:{
        device_name:string,
        device_number:string,
        device_amount:number
    }[],
    production_line:{
        name_line:string,
        monitoring_number:number,
        operate_number:number,
        QA_QC_number:string
    }[],
    factory_address:string,
    factory_scale:string,
}
export const  productionCapacity = async (req,res) =>{
    try {
        const id = req.jwtDecoded.id
        const data:IProductionCapacity = req.body;
        if(!data.factory_address){
            return res.status.send({
                message:"factory address!"
            })
        }
        if(!data.factory_scale){
            return res.status.send({
                message:"factory scale!"
            })
        }
        const result = await companyInfoAdvan.findOne({
            where:{
                id:id
            }
        })

        if(result){
            result.production_capacity = {
                production_process :data.production_process,
                devices: data.devices,
                production_line:data.production_line,
                factory_address:data.factory_address,
                factory_scale:data.factory_scale,
                state:"NON_VERIFIED"
            }
            result.save();
            return res.send(result);
        }
    }
    catch (e) {
        return res.status(400).send({
            message:e.message,
        })
    }

}
interface IQualityControl{
    inspection_process:{
        process_name:string,
        image:{url:string},
        description:string,
    }[],
    devices:{
        device_name:string,
        device_number:string,
        device_amount:number
    }[],
}
export const qualityControl = async (req,res) =>{
    try{
        const id = req.jwtDecoded.id;
        const data:IQualityControl = req.body;
        const result = await companyInfoAdvan.findOne({
            where:{
                id:id
            }
        })

        if(result){
            result.quality_control = {
                inspection_process:data.inspection_process,
                devices:data.devices,
                state:"NON_VERIFIED"
            }
            result.save();
            return res.send(result);
        }
    }
    catch (e) {
        return res.status(400).send({
            message:e.message,
        })
    }
}
interface ICertification{
    enterprise_certification:{
        certification_name:string,
        image:{url:string},
        description:string
    }
}
export const certification = async (req,res) =>{
    try{
        const id = req.jwtDecoded.id;
        const data:ICertification = req.body;
        const result = await companyInfoAdvan.findOne({
            where:{
                id:id
            }
        })

        if(result){
            result.quality_control = {
                enterprise_certification : data.enterprise_certification,
                state:"NON_VERIFIED"
            }
            result.save();
            return res.send(result);
        }
    }
    catch (e) {
        return res.status(400).send({
            message:e.message,
        })
    }
}
interface IUpdateCompany_info{
    name:string,
    business_code:number,
    web_site:string,
    registered_business_address:{
        city:number,
        district:number,
        ward:number,
        detail_address:string
    },
    working_address:{
        city:number,
        district:number,
        ward:number,
        detail_address:string
    },
    founded_year:number,
    main_items:string,
    description:string

}
export const updateCompanyInfo = async (req,res) =>{
    try {
        const id = req.jwtDecoded.id;
        const data :IUpdateCompany_info = req.body;
        const result = await companyInfo.findOne({
            where:{
                id:id
            }
        });
        if(result){
            result.name = data.name;
            result.web_site = data.web_site;
            result.business_code = data.business_code;
            result.registered_business_address = data.registered_business_address;
            result.working_address = data.working_address;
            result.founded_year = data.founded_year;
            result.main_items.push(data.main_items);
            result. description = data. description;
            return res.send(result)
        }
    }
    catch (e) {
        return res.status(400).send({
            message:e.message,
        })
    }
}

