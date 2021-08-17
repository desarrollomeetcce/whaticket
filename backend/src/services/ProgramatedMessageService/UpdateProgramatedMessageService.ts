import { Op } from "sequelize";
import * as Yup from "yup";
import AppError from "../../errors/AppError";
import ProgramatedMessage from "../../models/ProgramatedMessage";
import ShowProgramatedMessageService from "./ShowProgramatedMessageService";

interface ProgramatedMessageData {
  phoneNumber?: string;
  message?: string;
  wpid?:number;
  sendby?: string;
  status?: string;
  idchat?: number;
  sendAt?: Date;
}


const UpdateTagService = async (
  messageId: number | string,
  messageData: ProgramatedMessageData
): Promise<ProgramatedMessage> => {
  const { phoneNumber, message} = messageData;

 
  const messageTemp = await ShowProgramatedMessageService(messageId);

  await messageTemp.update(messageData);

  return messageTemp;
};

export default UpdateTagService;
