import { Router } from "express";
import isAuth from "../middleware/isAuth";

import * as ProgramatedMessageController from "../controllers/ProgramatedMessageController";

const programatedMsgRoutes = Router();

programatedMsgRoutes.get("/programatedMsg", isAuth, ProgramatedMessageController.index);

programatedMsgRoutes.post("/programatedMsg", isAuth, ProgramatedMessageController.store);

programatedMsgRoutes.get("/programatedMsg/:messageId", isAuth, ProgramatedMessageController.show);

programatedMsgRoutes.put("/programatedMsg/:messageId", isAuth, ProgramatedMessageController.update);

programatedMsgRoutes.delete("/programatedMsg/:messageId", isAuth, ProgramatedMessageController.remove);

export default programatedMsgRoutes;
