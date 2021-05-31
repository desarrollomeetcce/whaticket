import Tag from "../../models/Tag";

const ListTagsService = async (): Promise<Tag[]> => {
  const queues = await Tag.findAll({ order: [["name", "ASC"]] });

  return queues;
};

export default ListTagsService;
