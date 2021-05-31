import ShowTagService from "./ShowTagService";

const DeleteTagService = async (queueId: number | string): Promise<void> => {
  const tag = await ShowTagService(queueId);

  await tag.destroy();
};

export default DeleteTagService;
