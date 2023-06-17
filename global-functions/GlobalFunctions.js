const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  secure: true,
  auth: {
    user: 'sys.notification77@gmail.com',
    pass: process.env.EmailKey,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log('Email sent: ' + info.response);

      return true;
    }
  });
}

function writeFile(filePath, csvData) {
  fs.writeFile(filePath, csvData, (err) => {
    if (err) {
      console.error(err);
      return '404';
    } else {
      console.log('CSV data written to file');
      return 200;
    }
  });
}

const getCurrentDate = () => {
  const date = new Date();

  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Europe/Berlin',
  };

  const formattedDate = date.toLocaleString('en-US', options);
  return formattedDate
  // return formattedDate;
};
// const changeFormat=(date)=>{
//   let a=date.slice(0,12);
  
//   let b=a.split(" ");
//   let c=""
//   for (let i=0;i<b.length;i++){
//    if(i==2){
//         c +=b[i]
//    }else{
//         c +=b[i]+"-"
//    }
//    let time=date.slice(13)
//    c=c.replace(",","");
//    c=c+time
//  return c
// }

// }
module.exports = {
  sendEmail,
  writeFile,
  getCurrentDate,
};
