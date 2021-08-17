import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import CreateProgramatedMessageService from "../services/ProgramatedMessageService/CreateProgramatedMessageService";
import DeleteProgramatedMessageService from "../services/ProgramatedMessageService/DeleteProgramatedMessageService";
import ListProgramatedMessageService from "../services/ProgramatedMessageService/ListProgramatedMessageService";
import ShowProgramatedMessageService from "../services/ProgramatedMessageService/ShowProgramatedMessageService";
import UpdateProgramatedMessageService from "../services/ProgramatedMessageService/UpdateProgramatedMessageService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const messages = await ListProgramatedMessageService();

  return res.status(200).json(messages);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { phoneNumber, message,wpid,sendby,status,idchat,sendAt } = req.body;

  const messageRes = await CreateProgramatedMessageService({ phoneNumber, message,wpid,sendby,status,idchat,sendAt });

  const io = getIO();
  io.emit("MessageProgramated", {
    action: "update",
    messageRes
  });

  return res.status(200).json(messageRes);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { messageId } = req.params;

  const message = await ShowProgramatedMessageService(messageId);

  return res.status(200).json(message);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { messageId } = req.params;

  const message = await UpdateProgramatedMessageService(messageId, req.body);

  const io = getIO();
  io.emit("MessageProgramated", {
    action: "update",
    message
  });

  return res.status(201).json(message);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { messageId } = req.params;

  await DeleteProgramatedMessageService(messageId);

  const io = getIO();
  io.emit("MessageProgramated", {
    action: "delete",
    messageid: +messageId
  });

  return res.status(200).send();
};
