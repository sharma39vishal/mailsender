const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const nodemailer = require('nodemailer');
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:5500",
  ],
  credentials: true,
})
);

app.use(express.json());

app.get("/test",(req,res)=>{
    res.send("Testing")
  })


app.post('/mailsender',  (req, res) => {
    // console.log("DATA :", req.body)
    // res.send("Done")
      try {
          const {sendmail,subject,message}=req.body;
          const mail=process.env.MAIL_ID;
          const password= process.env.MAIL_PASSWORD;

          var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: mail,
                pass: password
              }
            });
            var mailOptions = {
              from: mail,
              to: sendmail,
              subject: subject,
              text: message
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                  res.status(500).send(error);
              } else {
                  res.status(200).send('Email sent: ' + info.response);
              }
            });
      } catch (error) {
          res.status(500).send({"error":error});
        }
  });
  

  app.use((req, res, next) => {
      const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      // console.log(req.headers['x-forwarded-for'], " : ",req.connection.remoteAddress," , ",`User IP: ${clientIp}`)
      // const clientIp = req.ip; // Get the user's IP address from the request
      console.log(`User IP: ${clientIp}`);
      next(); // Call the next middleware in the chain
    });
    
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});

// const path=require("path");

//   app.use(express.static('client/build'));
//    app.get('*', (req, res) => {
//           res.sendFile(path.resolve('client','build','index.html'));
//   });
  