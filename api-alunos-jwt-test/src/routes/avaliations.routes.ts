import {Router} from "express";
import AvaliationController from "../controllers/avaliation.controller";
import studentTypesMiddleware from "../middlewares/studentTypes.middlewares";
import authMiddleware from "../middlewares/auth.middlewares";
import updateOrDeleteMiddleware from "../middlewares/updateOrDelete.middleware";
import listMiddleware from "../middlewares/list.middleware";

const routes = () => {
  const router = Router();
  const controller = new AvaliationController();

  router.get("/", authMiddleware, controller.list);
  router.get("/:id", listMiddleware, controller.show);
  router.put("/:id", updateOrDeleteMiddleware, controller.update);
  router.post("/", studentTypesMiddleware, controller.create);
  router.delete("/:id", updateOrDeleteMiddleware, controller.delete);

  return router;
};

export default routes;
