import {Request, Response} from "express";
import db from "../database/prisma.connection";
import ClassroomService from "../services/classroom.service";

class RegistrationController {
  public async list(req: Request, res: Response) {
    try {
      const registrations = await db.registrations.findMany();
      return res.status(200).json({
        success: true,
        msg: "List registrations.",
        data: registrations,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const {student, classroom} = req.body;

      if (!student || !classroom) {
        return res.status(400).json({success: true, msg: "Required fields."});
      }

      const studentFind = await db.students.findUnique({
        where: {id: student},
      });

      if (!studentFind) {
        return res.status(404).json({success: true, msg: "Student not found."});
      }

      const classroomFind = await db.classrooms.findUnique({
        where: {id: classroom},
      });

      if (!classroomFind) {
        return res.status(404).json({success: true, msg: "Classroom not found."});
      }

      if (classroomFind.vacations === 0) {
        return res.status(400).json({success: true, msg: "Classroom does not have vacations."});
      }

      const newRegistration = await db.registrations.create({
        data: {
          studentId: student,
          classroomId: classroom,
        },
      });

      const serviceClassroom = new ClassroomService();
      await serviceClassroom.useVacation(classroom);

      return res.status(200).json({
        success: true,
        msg: "Create new registration.",
        data: newRegistration,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, msg: "ERROR Database."});
    }
  }
}

export default RegistrationController;
