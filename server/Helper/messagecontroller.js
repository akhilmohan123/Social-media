const  Messagemodel = require("../model/Messagemodel");


module.exports={
    addMessage:async (req,res)=>{
        const{chatId,senderId,text}=req.body;
        const Message=new Messagemodel({
            chatId,
            senderId,
            text
        })
        try {
            const result=Message.save().then(result=>{
                res.status(200).json(result)
             
            })     
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getMessages:async(req,res)=>{
        
        const{chatId}=req.params;
        console.log("clicked")
        try {
            const result=await Messagemodel.find({chatId})
            res.status(200).json(result)
        } catch (error) {
            res.status(400).json(error)
        }
        
    }
}