import nodemailer from "nodemailer"
  
export const mailSender = (to,body,) => {

    const transporter = nodemailer.createTransport({
        service:"gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });
      
      const mailOtions = {
          from: {
              name:"udhari.com",
              address:process.env.USER
          },
          to: [`${to}`],
          subject: "Hello ✔",
          text: "Hello world?",
          html: `${body}`,
      }
    const sendMail = async (transporter,mailOtions) => {
        try {
            await transporter.sendMail(mailOtions);
            console.log("mail has been sent successfully");
        } catch (error) {
            console.log(error)
        }
    }
    
    sendMail(transporter,mailOtions)
}
