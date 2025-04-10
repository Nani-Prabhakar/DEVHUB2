const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://NaniPrabhakar:Nani%40191079@cluster0.paeuv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
};
 
module.exports=connectDB;