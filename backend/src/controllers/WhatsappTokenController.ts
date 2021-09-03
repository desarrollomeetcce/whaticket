import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import CreateTokenService from "../services/WhatsappTokenService/CreateTokenService";
import DeleteTokenService from "../services/WhatsappTokenService/DeleteTokenService";
import ListTokenService from "../services/WhatsappTokenService/ListTokenService";
import ShowTokenService from "../services/WhatsappTokenService/ShowTokenService";
import UpdateTokenService from "../services/WhatsappTokenService/UpdateTokenService";
import ListWhatsAppsAndTokensService from "../services/WhatsappTokenService/ListWhatsAppsAndTokensService";
export const index = async (req: Request, res: Response): Promise<Response> => {
  const tokens = await ListTokenService();

  return res.status(200).json(tokens);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { wpid, message,token } = req.body;

  const medias = req.files as Express.Multer.File[];
  let tokenApi;

  if (medias) {
    let imagePath = medias[0].path;
     tokenApi = await CreateTokenService({ wpid, message,token,imagePath });
  }else{
     tokenApi = await CreateTokenService({ wpid, message,token });
  }
 

  return res.status(200).json(tokenApi);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { tokenId } = req.params;

  const tokenApi = await ShowTokenService(tokenId);

  return res.status(200).json(tokenApi);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tokenId } = req.params;
  const {  message } = req.body;

  const medias = req.files as Express.Multer.File[];
  let tokenApi;

  if (medias) {
    let imagePath = medias[0].path;
     tokenApi = await UpdateTokenService(tokenId,{ message,imagePath });
  }else{
     tokenApi = await UpdateTokenService(tokenId,{ message });
  }
 
  return res.status(201).json(tokenApi);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tokenId } = req.params;

  await DeleteTokenService(tokenId);



  return res.status(200).send();
};

export const getWpAndTokens = async (req: Request, res: Response): Promise<Response> => {
  const tokens = await ListWhatsAppsAndTokensService();

  return res.status(200).json(tokens);
};
