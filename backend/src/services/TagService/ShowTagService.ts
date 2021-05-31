import AppError from "../../errors/AppError";
import Tag from "../../models/Tag";

const ShowTagService = async (queueId: number | string): Promise<Tag> => {
  const queue = await Tag.findByPk(queueId);

  if (!queue) {
    throw new AppError("ERR_QUEUE_NOT_FOUND");
  }

  return queue;
};

export default ShowTagService;
