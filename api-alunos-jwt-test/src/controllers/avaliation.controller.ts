import { Request, Response } from "express";
import db from "../database/prisma.connection";

class AvaliationController {
  public async list(req: Request, res: Response) {
    try {
      const avaliations = await db.avaliations.findMany({
        include: {
          student: true,
        },
      });
      console.log(avaliations);

      return res.status(200).json({ success: true, msg: "List of avaliations.", data: avaliations });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const avaliation = await db.avaliations.findUnique({
        where: {
          id,
        },
      });

      if (avaliation) {
        return res.status(200).json({ success: true, msg: "Avaliation showed.", data: avaliation });
      }

      return res.status(404).json({ success: false, msg: "Avaliation not found." });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async create(req: Request, res: Response) {
    const { module, grade, email } = req.body;

    console.log(module, grade, email);

    try {
      if (!module || !grade || !email) {
        return res.status(400).json({ success: true, msg: "Required fields." });
      }

      const studentFind = await db.students.findUnique({
        where: { email },
      });

      if (!studentFind) {
        return res.status(400).json({ success: true, msg: "Student not found." });
      }

      const avaliation = await db.avaliations.create({
        data: { module, grade, studentId: studentFind.id },
      });

      return res.status(200).json({ success: true, msg: "Student graded.", data: avaliation });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { grade, module } = req.body;

    try {
      const avaliationId = await db.avaliations.findUnique({
        where: {
          id,
        },
      });

      if (!avaliationId) {
        return res.status(404).json({ success: false, msg: "Avaliation not found." });
      }

      if (grade && module) {
        await db.avaliations.update({
          where: {
            id,
          },
          data: {
            grade,
            module,
          },
        });

        return res.status(200).json({ success: true, msg: "Avaliation updated." });
      }

      return res.status(400).json({ success: true, msg: "Avaliation not updated." });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const avaliation = await db.avaliations.findUnique({
        where: {
          id,
        },
      });

      if (avaliation) {
        await db.avaliations.delete({
          where: {
            id,
          },
        });

        return res.status(200).json({ success: true, msg: "Avaliation deleted." });
      }
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default AvaliationController;
