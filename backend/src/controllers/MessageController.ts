import { Request, Response } from "express";

import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import { getIO } from "../libs/socket";
import Message from "../models/Message";

import ListMessagesService from "../services/MessageServices/ListMessagesService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import DeleteWhatsAppMessage from "../services/WbotServices/DeleteWhatsAppMessage";

import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";
import SendWhatsAppApi from "../services/WbotServices/SendWhatsAppApi";
import SendWhatsAppMassive from "../services/WbotServices/SendWhatsAppMassive";
import SendWhatsAppMediaMassive from "../services/WbotServices/SendWhatsAppMediaMassive";
type IndexQuery = {
  pageNumber: string;
};

type MessageData = {
  body: string;
  fromMe: boolean;
  read: boolean;
  quotedMsg?: Message;
};

type MessageMassive = {
  wpId: number;
  num: string;
  msg: string;
};

type MessageToken = {
  phone: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { pageNumber } = req.query as IndexQuery;

  const { count, messages, ticket, hasMore } = await ListMessagesService({
    pageNumber,
    ticketId
  });

  SetTicketMessagesAsRead(ticket);

  return res.json({ count, messages, ticket, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { body, quotedMsg }: MessageData = req.body;
  const medias = req.files as Express.Multer.File[];

  const ticket = await ShowTicketService(ticketId);

  SetTicketMessagesAsRead(ticket);

  if (medias) {
    await Promise.all(
      medias.map(async (media: Express.Multer.File) => {
        await SendWhatsAppMedia({ media, ticket });
      })
    );
  } else {
    await SendWhatsAppMessage({ body, ticket, quotedMsg });
  }

  return res.send();
};

export const sendMsg = async (req: Request, res: Response): Promise<Response> => {

 
  const medias = req.files as Express.Multer.File[];

  
  
  if (medias) {
    
    const {wpId,num,msg}=  req.body;
    await Promise.all(
      medias.map(async (media: Express.Multer.File) => {
        await SendWhatsAppMediaMassive({ media,wpId , num,msg });
      })
    );
  }else{
    const {wpId,num,msg}: MessageMassive= req.body;
    await SendWhatsAppMassive({ wpId, num,msg});
  }
 

 

  return res.send();
};

export const sendMsgToken = async (req: Request, res: Response): Promise<Response> => {

  const { token } = req.params;
  const {phone}: MessageToken= req.body;

  await SendWhatsAppApi({token, phone});
  return res.send();
};


export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { messageId } = req.params;

  const message = await DeleteWhatsAppMessage(messageId);

  const io = getIO();
  io.to(message.ticketId.toString()).emit("appMessage", {
    action: "update",
    message
  });

  return res.send();
};


