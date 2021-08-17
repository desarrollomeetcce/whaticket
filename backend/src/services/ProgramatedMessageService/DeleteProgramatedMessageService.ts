import ShowProgramatedMessageService from "./ShowProgramatedMessageService";

const DeleteProgramatedMessageService = async (messageId: number | string): Promise<void> => {
  const message = await ShowProgramatedMessageService(messageId);

  await message.destroy();
};

export default DeleteProgramatedMessageService;
