import { Router } from "express";
import isAuth from "../middleware/isAuth";

import * as TagController from "../controllers/TagController";

const tagRoutes = Router();

tagRoutes.get("/tag", isAuth, TagController.index);

tagRoutes.post("/tag", isAuth, TagController.store);

tagRoutes.get("/tag/:queueId", isAuth, TagController.show);

tagRoutes.put("/tag/:queueId", isAuth, TagController.update);

tagRoutes.delete("/tag/:queueId", isAuth, TagController.remove);

export default tagRoutes;
