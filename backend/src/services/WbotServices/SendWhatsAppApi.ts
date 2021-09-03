import fs from "fs";
import { MessageMedia, Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import WhaticketApiToken from "../../models/WhaticketApiToken";
import SendWhatsAppMassive from "./SendWhatsAppMassive";
import SendWhatsAppMediaProgram from "./SendWhatsAppMediaProgram";
import WhaticketApiMessage from "../../models/WhaticketApiMessage";


interface Request {
  token: string;
  phone: string;
}

interface Response {
  msg: string;
}
const SendWhatsAppApi = async ({
  token,phone
}: Request): Promise<WhaticketApiMessage> => {
  try {
    const messageApi = await WhaticketApiToken.findOne({ 
      where: {
        token: token,
      }
    });

    if(messageApi){

      const wpId = messageApi.wpid;
      const msg = messageApi.message;
      const num = phone;
      const imagePath = messageApi.imagePath;

      SendWhatsAppMassive({wpId,num,msg});
      
      const media = MessageMedia.fromFilePath(imagePath);
      await SendWhatsAppMediaProgram({ media,wpId , num });

      try{

        let messageData = {"wpid":wpId,"phone":num,"message":msg};
        const messageToProgram = await WhaticketApiMessage.create(messageData);
        return messageToProgram;

      }catch (err) {
        throw new AppError("Error al guardar mensaje en historico");
      }
     
    }else{
      throw new AppError("Error al enviar mensaje, no existe token");
    }

    
  } catch (err) {
    throw new AppError(err);
  }
};

export default SendWhatsAppApi;
