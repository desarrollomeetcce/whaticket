import fs from "fs";
import { MessageMedia, Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetTicketWbotByID from "../../helpers/GetTicketWbotByID";
import Ticket from "../../models/Ticket";

interface Request {
  wpId: number;
  number: string;
  msg: string;
}

const SendWhatsAppMassive = async ({
  wpId,
  number,
  msg
}: Request): Promise<WbotMessage> => {
  try {
    const wbot = await GetTicketWbotByID(wpId);

    /*const newMedia = MessageMedia.fromFilePath(media.path);

    const sentMessage = await wbot.sendMessage(
      `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
      newMedia,
      { sendAudioAsVoice: true }
    );

    await ticket.update({ lastMessage: media.filename });

    fs.unlinkSync(media.path);*/

    const body = `\u200e${msg}`;
    const sentMessage = await wbot.sendMessage(`${number}@c.us`, body);

    return sentMessage;
  } catch (err) {
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMassive;
