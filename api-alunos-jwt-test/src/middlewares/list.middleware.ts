import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";

async function listMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  const id = req.params;

  console.log(token);

  if (token) {
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    } catch (error) {
      return res.status(401).json({msg: "Token inválido"});
    }

    if (decoded.type === "T" || decoded.type === "M" || decoded.type === "F") {
      if (decoded.type === "M" || decoded.type === "F") {
        if (decoded.id === id) {
          return next();
        } else {
          return res.status(401).json({msg: "Usuário não autorizado."});
        }
      }
      return next();
    } else {
      return res.status(401).json({msg: "Usuário não autorizado."});
    }
  }
}

export default listMiddleware;
