import * as Yup from "yup";
import AppError from "../../errors/AppError";
import ProgramatedMessage from "../../models/ProgramatedMessage";

interface ProgramatedMessageData {
  phoneNumber: string;
  message: string;
  wpid: number;
  sendby: string;
  status: string;
  idchat: number;
  sendAt: Date;
}

const CreateProgramatedMessageService = async (messageData: ProgramatedMessageData): Promise<ProgramatedMessage> => {
  const { phoneNumber, message,wpid,sendby,status,idchat,sendAt } = messageData;
 
  const programatedMessageSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .min(10, "ERR_QUEUE_INVALID_NAME")
      .required("ERR_QUEUE_INVALID_NUMBER")
      ,
    message: Yup.string()
      .required("ERR_QUEUE_INVALID_COLOR")
      ,
  });

  try {
    await programatedMessageSchema.validate({ phoneNumber, message });
  } catch (err) {
    throw new AppError(err.message);
  }

  const messageToProgram = await ProgramatedMessage.create(messageData);

  return messageToProgram;
};

export default CreateProgramatedMessageService;
