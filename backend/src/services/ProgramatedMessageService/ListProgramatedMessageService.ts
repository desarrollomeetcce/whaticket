import ProgramatedMessage from "../../models/ProgramatedMessage";
import { Op, fn, where, col, Filterable, Includeable } from "sequelize";

const ListProgramatedMessagesService = async (searchParam = "",
pageNumber = "1",): Promise<ProgramatedMessage[]> => {

  const limit = 40;
  const offset = limit * (+pageNumber - 1);
  const sanitizedSearchParam = searchParam.toLocaleLowerCase().trim();

  const programatedMessages = await ProgramatedMessage.findAll({
    where:{
      message: where(
      fn("LOWER", col("message")),
      "LIKE",
      `%${sanitizedSearchParam}%`
    )},
    limit,
    offset,
    order: [["sendAt", "ASC"]]
  });
 
  return programatedMessages;
};

export default ListProgramatedMessagesService;
