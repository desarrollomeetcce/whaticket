import fs from "fs";
import { MessageMedia, Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetTicketWbotByID from "../../helpers/GetTicketWbotByID";
import Ticket from "../../models/Ticket";
import {Contact as WbotContact} from "whatsapp-web.js";

import Contact from "../../models/Contact";
import CreateOrUpdateContactService from "../ContactServices/CreateOrUpdateContactService";
import FindOrCreateTicketService from "../TicketServices/FindOrCreateTicketService";
import {verifyQueue,handleMessage} from "../WbotServices/wbotMessageListener";
import CreateMessageService from "../MessageServices/CreateMessageService";
interface Request {
  media: Express.Multer.File;
  wpId: string;
  num: string;
  msg: string;
}

const verifyContact = async (msgContact: WbotContact): Promise<Contact> => {
  const profilePicUrl = await msgContact.getProfilePicUrl();

  const contactData = {
    name: msgContact.name || msgContact.pushname || msgContact.id.user,
    number: msgContact.id.user,
    profilePicUrl,
    isGroup: msgContact.isGroup
  };

  const contact = CreateOrUpdateContactService(contactData);

  return contact;
};


const SendWhatsAppMediaMassive = async ({
  media,
  wpId,
  num,
  msg
}: Request): Promise<WbotMessage> => {
  try {
    //console.log("Pruebas");
    //console.log(media);
    //console.log(wpId);
    //console.log(num);
    //console.log(msg);
    let wpid = Number(wpId);
    const wbot = await GetTicketWbotByID(wpid);
   
    const msgContact = await wbot.getContactById(num+"@c.us");
    const contact = await verifyContact(msgContact);
    
    const ticket = await FindOrCreateTicketService(
      contact,
      wpid,
      1,
    );
    const newMedia = MessageMedia.fromFilePath(media.path);
    let sentMessage;
    const body = `\u200e${msg}`;

    
      //console.log("Enviando multimedia");
       sentMessage = await wbot.sendMessage(
        `${num}@c.us`,
        newMedia,
        { sendAudioAsVoice: true }
      );
      await ticket.update({ lastMessage: media.filename });
    
    const messageData = {
      id: sentMessage.id.id,
      ticketId: ticket.id,
      contactId: sentMessage.fromMe ? undefined : contact.id,
      body: sentMessage.body,
      fromMe: sentMessage.fromMe,
      mediaType: sentMessage.type,
      read: sentMessage.fromMe,
    
    };

    await CreateMessageService({messageData});
    
    
    await verifyQueue(wbot, sentMessage, ticket, contact);
    handleMessage(sentMessage,wbot);
    
    return sentMessage;
  } catch (err) {
    throw new AppError(err);
  }
};

export default SendWhatsAppMediaMassive;
