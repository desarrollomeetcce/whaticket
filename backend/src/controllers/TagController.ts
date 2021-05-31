import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import CreateTagService from "../services/TagService/CreateTagService";
import DeleteTagService from "../services/TagService/DeleteTagService";
import ListTagsService from "../services/TagService/ListTagsService";
import ShowTagService from "../services/TagService/ShowTagService";
import UpdateTagService from "../services/TagService/UpdateTagService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const queues = await ListTagsService();

  return res.status(200).json(queues);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, color } = req.body;

  const queue = await CreateTagService({ name, color });

  const io = getIO();
  io.emit("tag", {
    action: "update",
    queue
  });

  return res.status(200).json(queue);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { queueId } = req.params;

  const queue = await ShowTagService(queueId);

  return res.status(200).json(queue);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueId } = req.params;

  const queue = await UpdateTagService(queueId, req.body);

  const io = getIO();
  io.emit("tag", {
    action: "update",
    queue
  });

  return res.status(201).json(queue);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueId } = req.params;

  await DeleteTagService(queueId);

  const io = getIO();
  io.emit("tag", {
    action: "delete",
    queueId: +queueId
  });

  return res.status(200).send();
};
