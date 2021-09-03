import express from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";
import uploadConfig from "../config/upload";

import * as WhatsappTokenController from "../controllers/WhatsappTokenController";

const whatsappTokensRoutes = express.Router();

const upload = multer(uploadConfig);

whatsappTokensRoutes.get("/whatsappTokens/", isAuth, WhatsappTokenController.index);

whatsappTokensRoutes.patch("/whatsappTokens/", isAuth,upload.array("medias"), WhatsappTokenController.store);

whatsappTokensRoutes.get("/whatsappTokens/:tokenId", isAuth, WhatsappTokenController.show);

whatsappTokensRoutes.patch("/whatsappTokens/:tokenId", isAuth, upload.array("medias"),WhatsappTokenController.update);

whatsappTokensRoutes.delete(
  "/whatsappTokens/:tokenId",
  isAuth,
  WhatsappTokenController.remove
);

whatsappTokensRoutes.get("/whatsappTokensInfo/", isAuth, WhatsappTokenController.getWpAndTokens);

export default whatsappTokensRoutes;
