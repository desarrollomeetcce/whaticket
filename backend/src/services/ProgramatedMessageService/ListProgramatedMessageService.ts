import ProgramatedMessage from "../../models/ProgramatedMessage";

const ListProgramatedMessagesService = async (): Promise<ProgramatedMessage[]> => {
  const programatedMessages = await ProgramatedMessage.findAll({ order: [["sendAt", "ASC"]] });

  return programatedMessages;
};

export default ListProgramatedMessagesService;
