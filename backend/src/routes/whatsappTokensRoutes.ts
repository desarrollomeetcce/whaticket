import express from "express";
import isAuth from "../middleware/isAuth";

import * as WhatsappTokenController from "../controllers/WhatsappTokenController";

const whatsappTokensRoutes = express.Router();

whatsappTokensRoutes.get("/whatsappTokens/", isAuth, WhatsappTokenController.index);

whatsappTokensRoutes.post("/whatsappTokens/", isAuth, WhatsappTokenController.store);

whatsappTokensRoutes.get("/whatsappTokens/:tokenId", isAuth, WhatsappTokenController.show);

whatsappTokensRoutes.put("/whatsappTokens/:tokenId", isAuth, WhatsappTokenController.update);

whatsappTokensRoutes.delete(
  "/whatsappTokens/:tokenId",
  isAuth,
  WhatsappTokenController.remove
);

whatsappTokensRoutes.get("/whatsappTokensInfo/", isAuth, WhatsappTokenController.getWpAndTokens);

export default whatsappTokensRoutes;
