import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import db from "../database/prisma.connection";

async function studentTypesMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  const email = req.body;

  console.log(token);

  if (token) {
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    } catch (error) {
      return res.status(401).json({ msg: "Token inválido" });
    }

    if (decoded.type === "M" || decoded.type === "T") {
      if (decoded.type === "M") {
        const studentFind = await db.students.findUnique({
          where: {
            email,
          },
        });

        if (decoded.id === studentFind?.id) {
          return next();
        } else {
          return res.status(401).json({ msg: "Usuário não autorizado.", success: false });
        }
      }

      return next();
    } else {
      return res.status(401).json({ msg: "Usuário não autorizado.", success: false });
    }
  }
}

export default studentTypesMiddleware;
