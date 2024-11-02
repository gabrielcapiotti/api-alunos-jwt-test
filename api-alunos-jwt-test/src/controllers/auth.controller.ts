import { Request, Response } from "express";
import db from "../database/prisma.connection";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

class AuthController {
  public async create(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ success: false, msg: "Required fields." });
      }

      const studentFind = await db.students.findUnique({
        where: { email },
        include: { user: true },
      });

      if (!studentFind || !bcrypt.compareSync(password, studentFind.user?.password || "")) {
        return res.status(401).json({ success: false, msg: "Email or password incorrect." });
      }

      const token = jwt.sign({ email, id: studentFind.id, type: studentFind.type }, process.env.JWT_SECRET || "", {
        expiresIn: "1d",
      });

      await db.users.update({
        where: { id: studentFind.user?.id },
        data: { token },
      });

      res.status(200).json({ success: true, msg: "Login successful", data: { token } });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default AuthController;
