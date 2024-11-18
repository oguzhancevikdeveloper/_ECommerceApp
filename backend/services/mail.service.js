const nodemailer =  require("nodemailer");

const transporter = nodemailer.createTransport({

    host:"",
    port :"",
    secure :"",
    html : true,
    auth :{
        user :"",
        pass : ""
    },
    tls : {
        ciphers :"",
        rejectUnauthorized: false
    }
});

const sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions,function(error,info){
        if(error) console.log(error);      
        else console.log("Mail başari ile gönderildi")       
    });
}

module.exports = sendMail;