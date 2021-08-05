import redis from "redis";
const client = redis.createClient();

client.on("Connect",()=>{
    console.log("Connect redis...")
})
client.on("ready",()=>{
    console.log("Ready redis...")
})

client.on("error",(err)=>{
    console.log(err.message)
})

client.on("end",()=>{
    console.log("Disconnect redis...")
})
export default client;

