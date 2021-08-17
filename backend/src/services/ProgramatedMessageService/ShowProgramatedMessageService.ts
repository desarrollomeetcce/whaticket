import AppError from "../../errors/AppError";
import ProgramatedMessage from "../../models/ProgramatedMessage";

const ShowProgramatedMessageService = async (messageId: number | string): Promise<ProgramatedMessage> => {
  const programatedMessage = await ProgramatedMessage.findByPk(messageId);

  if (!programatedMessage) {
    throw new AppError("ERR_QUEUE_NOT_FOUND");
  }

  return programatedMessage;
};

export default ShowProgramatedMessageService;
