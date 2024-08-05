const express=require("express")
const { createChat, userChats, findChat } = require("../Helper/Chatcontroller")

const router=express.Router()

router.post("/",createChat)
router.get("/:friendid",userChats)
router.get("/find/:firstId/:secondId",findChat)
module.exports=router