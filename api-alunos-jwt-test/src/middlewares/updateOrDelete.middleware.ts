import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

async function updateOrDeleteMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  console.log(token);

  if (token) {
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    } catch (error) {
      return res.status(401).json({ msg: "Token inválido", success: false });
    }

    if (decoded.type === "T") {
      return next();
    } else {
      return res.status(401).json({ msg: "Usuário não autorizado.", success: false });
    }
  }
}

export default updateOrDeleteMiddleware;
