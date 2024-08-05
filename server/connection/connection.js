function connection(){
    var mongoose=require('mongoose')
    require('dotenv').config()
mongoose.connect(process.env.DB_URL).then((res)=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err+"error")
})
}
module.exports=connection
