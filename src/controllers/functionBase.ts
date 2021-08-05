const bcrypt = require('bcryptjs');
export const passwordEncryption  = (password) =>{
    return new Promise((resolve, reject) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            resolve(hash);
        }
        catch (e){
            reject(e);
        }
    })


}
export const  passwordCheck = (passwordInput,password_DB) =>{
    try {
        return  bcrypt.compareSync(passwordInput,password_DB,)
    }
    catch (e){
        console.log(e)
    }
}
export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
export function validatePhoneNumber(phone:number){
    const re =  /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return re.test(String(phone).toLowerCase());
}
import client from "../helpers/redisHelper"
export const setRedis = async(key,data) =>{
    await client.set(key,JSON.stringify(data));
    await client.expire(key, 60* 60*10);
}
 export  const getRedis =  async (key)=>{
    return new Promise((resolve, reject) => {
        client.get(key, (e, data) => {
            if(e){
                reject(e);
            }
            resolve(data);
        });
    });


}
export const clearRedis = async (key) =>{
    await client.del(key);
}



