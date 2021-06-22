import { Client as Session } from "whatsapp-web.js";
import { getWbot } from "../libs/wbot";
import Ticket from "../models/Ticket";

const GetTicketWbotByID = async (whatsappId: Number): Promise<Session> => {
 

  const wbot = getWbot(whatsappId);

  return wbot;
};

export default GetTicketWbotByID;
