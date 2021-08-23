import qrCode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import { getIO } from "./socket";
import Whatsapp from "../models/Whatsapp";
import AppError from "../errors/AppError";
import { logger } from "../utils/logger";
import { handleMessage } from "../services/WbotServices/wbotMessageListener";
import Ticket from "../models/Ticket";
import Setting from "../models/Setting";
import Contact from "../models/Contact";

import {
  Contact as WbotContact,
  Chat
} from "whatsapp-web.js";
interface Session extends Client {
  id?: number;
}

const sessions: Session[] = [];

const readMessages = async(wbot: Session,chat: Chat,limitChat:number) =>{
  const unreadMessages = await chat.fetchMessages({
    limit: limitChat
  });

  for (const msg of unreadMessages) {
    await handleMessage(msg, wbot);
  }

  await chat.sendSeen();
}
const existContact = async (wbot: Session,chat: Chat) : Promise<Ticket|null>=>{
  const testMessage = await chat.fetchMessages({
    limit: 1
  });
  let msgContact: WbotContact;
  if(testMessage.length == 0){
    return null;
  }
  if (testMessage[0].fromMe) {
    msgContact = await wbot.getContactById(testMessage[0].to);
  } else {
    msgContact = await testMessage[0].getContact();
  }
  if(msgContact){
    const contact = await Contact.findOne({ where: { number:msgContact.id.user } });
    let indexCont = -1;
    if(contact){
      indexCont = contact.id 
    }

    let ticket = await Ticket.findOne({
      where: {
  
        contactId: indexCont
      }
    });
    return ticket;
  }
  return null;
}
const syncUnreadMessages = async (wbot: Session) => {
  const chats = await wbot.getChats();
  let limitChat = 2;
  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */
  const settingConf = await Setting.findOne({
    where: {
      key: "onlyUnread"
    }
  });
  const limitCountSetting = await Setting.findOne({
    where: {
      key: "limitChat"
    }
  });

  let onlyUnread = false;
  
  if(settingConf){
    onlyUnread = settingConf.value === "enabled";
  }

  if(limitCountSetting){
    limitChat = Number(limitCountSetting.value);
  }

  for (const chat of chats) {
   
    
   
    if(onlyUnread){
     
      if (chat.unreadCount > 0) {

        limitChat = chat.unreadCount;
        await readMessages(wbot,chat,limitChat);
  
      }
    }else{
      let ticket = await existContact(wbot,chat);
      if(!ticket){
    
       
        await readMessages(wbot,chat,limitChat);
      
     
      }else{
        if (chat.unreadCount > 0) {

          limitChat = chat.unreadCount;
          await readMessages(wbot,chat,limitChat);
    
        }
      }
    }
    
  }
};

export const initWbot = async (whatsapp: Whatsapp): Promise<Session> => {
  return new Promise((resolve, reject) => {
    try {
      const io = getIO();
      const sessionName = whatsapp.name;
      let sessionCfg;

      if (whatsapp && whatsapp.session) {
        sessionCfg = JSON.parse(whatsapp.session);
      }
      const puppeteerOptions = {
        session: sessionCfg,
        puppeteer: {
          executablePath: process.env.CHROME_BIN || undefined,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
         
        }
      };
        
     
    
      const wbot: Session = new Client(puppeteerOptions);

      wbot.initialize();

      wbot.on("qr", async qr => {
        logger.info("Session:", sessionName);
        qrCode.generate(qr, { small: true });
        await whatsapp.update({ qrcode: qr, status: "qrcode", retries: 0 });

        const sessionIndex = sessions.findIndex(s => s.id === whatsapp.id);
        if (sessionIndex === -1) {
          wbot.id = whatsapp.id;
          sessions.push(wbot);
        }

        io.emit("whatsappSession", {
          action: "update",
          session: whatsapp
        });
      });

      wbot.on("authenticated", async session => {
        logger.info(`Session: ${sessionName} AUTHENTICATED`);
        await whatsapp.update({
          session: JSON.stringify(session)
        });
      });

      wbot.on("auth_failure", async msg => {
        console.error(
          `Session: ${sessionName} AUTHENTICATION FAILURE! Reason: ${msg}`
        );

        if (whatsapp.retries > 1) {
          await whatsapp.update({ session: "", retries: 0 });
        }

        const retry = whatsapp.retries;
        await whatsapp.update({
          status: "DISCONNECTED",
          retries: retry + 1
        });

        io.emit("whatsappSession", {
          action: "update",
          session: whatsapp
        });

        reject(new Error("Error starting whatsapp session."));
      });

      wbot.on("ready", async () => {
        logger.info(`Session: ${sessionName} READY`);

        await whatsapp.update({
          status: "CONNECTED",
          qrcode: "",
          retries: 0
        });

        io.emit("whatsappSession", {
          action: "update",
          session: whatsapp
        });

        const sessionIndex = sessions.findIndex(s => s.id === whatsapp.id);
        if (sessionIndex === -1) {
          wbot.id = whatsapp.id;
          sessions.push(wbot);
        }

        wbot.sendPresenceAvailable();
        await syncUnreadMessages(wbot);

        resolve(wbot);
      });
    } catch (err) {
      logger.error(err);
    }
  });
};

export const getWbot = (whatsappId: number): Session => {
  const sessionIndex = sessions.findIndex(s => s.id === whatsappId);
 // console.log(sessions);
  if (sessionIndex === -1) {
    throw new AppError("ERR_WAPP_NOT_INITIALIZED");
  }
  return sessions[sessionIndex];
};

export const removeWbot = (whatsappId: number): void => {
  try {
    const sessionIndex = sessions.findIndex(s => s.id === whatsappId);
    if (sessionIndex !== -1) {
      sessions[sessionIndex].destroy();
      sessions.splice(sessionIndex, 1);
    }
  } catch (err) {
    logger.error(err);
  }
};
