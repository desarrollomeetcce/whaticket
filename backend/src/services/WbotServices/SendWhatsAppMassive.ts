import fs from "fs";
import { MessageMedia, Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetTicketWbotByID from "../../helpers/GetTicketWbotByID";
import Ticket from "../../models/Ticket";
import {Contact as WbotContact} from "whatsapp-web.js";

import Contact from "../../models/Contact";
import CreateOrUpdateContactService from "../ContactServices/CreateOrUpdateContactService";
import FindOrCreateTicketService from "../TicketServices/FindOrCreateTicketService";
import {verifyQueue,handleMessage} from "../WbotServices/wbotMessageListener"
interface Request {
  wpId: number;
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


const SendWhatsAppMassive = async ({
  wpId,
  num,
  msg
}: Request): Promise<WbotMessage> => {
  try {
    const wbot = await GetTicketWbotByID(wpId);

    const msgContact = await wbot.getContactById(num+"@c.us");
    const contact = await verifyContact(msgContact);
  

    const ticket = await FindOrCreateTicketService(
      contact,
      wpId,
      1,
    );
    /*const newMedia = MessageMedia.fromFilePath(media.path);

    const sentMessage = await wbot.sendMessage(
      `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
      newMedia,
      { sendAudioAsVoice: true }
    );

    await ticket.update({ lastMessage: media.filename });

    fs.unlinkSync(media.path);*/

    const body = `\u200e${msg}`;
    const sentMessage = await wbot.sendMessage(`${num}@c.us`, body);

    
    await ticket.update({ lastMessage: body });
    await verifyQueue(wbot, sentMessage, ticket, contact);
    handleMessage(sentMessage,wbot);
    
    return sentMessage;
  } catch (err) {
    throw new AppError(err);
  }
};

export default SendWhatsAppMassive;
