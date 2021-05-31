import { Router } from "express";
import isAuth from "../middleware/isAuth";

import * as TagController from "../controllers/TagController";

const tagRoutes = Router();

tagRoutes.get("/queue", isAuth, TagController.index);

tagRoutes.post("/queue", isAuth, TagController.store);

tagRoutes.get("/queue/:queueId", isAuth, TagController.show);

tagRoutes.put("/queue/:queueId", isAuth, TagController.update);

tagRoutes.delete("/queue/:queueId", isAuth, TagController.remove);

export default tagRoutes;
