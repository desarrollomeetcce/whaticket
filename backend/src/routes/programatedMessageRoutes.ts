import { Router } from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";
import uploadConfig from "../config/upload";

import * as ProgramatedMessageController from "../controllers/ProgramatedMessageController";

const programatedMsgRoutes = Router();
const upload = multer(uploadConfig);

programatedMsgRoutes.get("/programatedMsg", isAuth, ProgramatedMessageController.index);

programatedMsgRoutes.patch("/programatedMsg", isAuth, upload.array("medias"),ProgramatedMessageController.store);

programatedMsgRoutes.get("/programatedMsg/:messageId", isAuth, ProgramatedMessageController.show);

programatedMsgRoutes.put("/programatedMsg/:messageId", isAuth, ProgramatedMessageController.update);

programatedMsgRoutes.delete("/programatedMsg/:messageId", isAuth, ProgramatedMessageController.remove);

export default programatedMsgRoutes;
