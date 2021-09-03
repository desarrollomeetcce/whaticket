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
 
  wpId: number;
  num: string;
  msg: string;
  imagePath?: string;
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


const SendWhatsAppMassive = async ({
  wpId,
  num,
  msg,
}: Request): Promise<WbotMessage> => {
  try {
    //console.log("Pruebas");
    //console.log(wpId);
    //console.log(num);
    //console.log(msg);
    const wbot = await GetTicketWbotByID(wpId);

    const msgContact = await wbot.getContactById(num+"@c.us");
    const contact = await verifyContact(msgContact);
  

    const ticket = await FindOrCreateTicketService(
      contact,
      wpId,
      1,
    );
   
    let sentMessage;
    const body = `\u200e${msg}`;

    //console.log("Enviando mensaje normal");
    
    sentMessage = await wbot.sendMessage(`${num}@c.us`, body);
    await ticket.update({ lastMessage: body });
   

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

export default SendWhatsAppMassive;
