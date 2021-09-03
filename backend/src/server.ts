import gracefulShutdown from "http-graceful-shutdown";
import app from "./app";
import { initIO } from "./libs/socket";
import { logger } from "./utils/logger";
import { StartAllWhatsAppsSessions } from "./services/WbotServices/StartAllWhatsAppsSessions";

import ProgramatedMessage from "./models/ProgramatedMessage";
import UpdateProgramatedMessageService from "./services/ProgramatedMessageService/UpdateProgramatedMessageService"
import SendWhatsAppMassive from "./services/WbotServices/SendWhatsAppMassive";
import SendWhatsAppMediaProgram from "./services/WbotServices/SendWhatsAppMediaProgram";
import { MessageMedia} from "whatsapp-web.js";
const server = app.listen(process.env.PORT, () => {
  logger.info(`Server started on port: ${process.env.PORT}`);

 
});

const schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.second = 1;

const { Op } = require("sequelize");

var intMail = schedule.scheduleJob(rule, async () =>{
 // //console.log("Comienza envio de mensajes");
  const messages = await ProgramatedMessage.findAll({ 
    order: [["sendAt", "ASC"]],
    where: {
      status: "pending",
      sendAt: {
        [Op.lt]: new Date(),
      }
      
    }
  });
 
    for (const element of messages) {
      const {id,wpid,phoneNumber,message,imagePath} = element;
      let wpId = wpid,num = phoneNumber,msg =message;

      try{

        await SendWhatsAppMassive({ wpId, num,msg,imagePath});
        if(imagePath){
          console.log(imagePath);
          const media = MessageMedia.fromFilePath(imagePath);
         
          await SendWhatsAppMediaProgram({ media,wpId , num });
        }
      
        await UpdateProgramatedMessageService(id,{status: "sent"});

      }catch(err){

        await UpdateProgramatedMessageService(id,{status: "error"});
        logger.info(err);
      }
      
    }
});

initIO(server);
StartAllWhatsAppsSessions();
gracefulShutdown(server);
