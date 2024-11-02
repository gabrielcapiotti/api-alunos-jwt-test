import {Router} from "express";
import StudentController from "../controllers/student.controller";
import authMiddleware from "../middlewares/auth.middlewares";

const routes = () => {
  const router = Router();
  const controller = new StudentController();

  router.get("/", controller.list);
  router.get("/:id", authMiddleware, controller.show);
  router.put("/:id", authMiddleware, controller.update);
  router.post("/", controller.create);
  router.delete("/:id", authMiddleware, controller.delete);

  return router;
};

export default routes;
