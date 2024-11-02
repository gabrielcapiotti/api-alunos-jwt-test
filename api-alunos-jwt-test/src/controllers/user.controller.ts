import {Request, Response} from "express";
import db from "../database/prisma.connection";
import generateHash from "../utils/generateHash";

class UserController {
  public async list(req: Request, res: Response) {
    try {
      const users = await db.users.findMany();

      return res.status(200).json({success: true, msg: "List users.", data: users});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async create(req: Request, res: Response) {
    const {email, password} = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({success: false, msg: "Required fields."});
      }

      const studentFind = await db.students.findUnique({
        where: {email},
      });

      if (!studentFind) {
        return res.status(400).json({success: false, msg: "Student not found."});
      }

      const hash = generateHash(password);

      const newUser = await db.users.create({
        data: {password: hash, studentId: studentFind.id},
      });

      return res.status(200).json({
        success: true,
        msg: "Created new user.",
        data: {id: newUser.id, student: newUser.studentId, enable: newUser.enable},
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }
}

export default UserController;
