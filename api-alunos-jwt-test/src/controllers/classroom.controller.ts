import { Request, Response } from "express";
import db from "../database/prisma.connection";

class ClassroomController {
  public async list(req: Request, res: Response) {
    const { vacations } = req.query;
    let classrooms;

    try {
      switch (vacations) {
        case "0":
          classrooms = await db.classrooms.findMany({
            where: {
              vacations: 0,
            },
          });
          break;

        case "1":
          classrooms = await db.classrooms.findMany({
            where: {
              vacations: { gt: 0 },
            },
          });
          break;

        default:
          classrooms = await db.classrooms.findMany();
          break;
      }

      return res
        .status(200)
        .json({ success: true, msg: "List classrooms.", data: classrooms });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async create(req: Request, res: Response) {
    const { subject, vacations } = req.body;

    if (!subject) {
      return res.status(400).json({ success: true, msg: "Required subject." });
    }

    try {
      const newClass = await db.classrooms.create({
        data: { subject, vacations },
      });

      return res
        .status(200)
        .json({ success: true, msg: "Create new class.", data: newClass });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default ClassroomController;
