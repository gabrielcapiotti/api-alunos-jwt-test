import db from "../database/prisma.connection";

class ClassroomService {
  public async useVacation(id: string) {
    const classroomFind = await db.classrooms.findUnique({
      where: { id },
    });

    if (!classroomFind) {
      throw new Error("Classroom not found, useVacation.");
    }

    if (classroomFind.vacations > 0) {
      throw new Error("Classroom not vacations, useVacation.");
    }

    await db.classrooms.update({
      where: { id },
      data: { vacations: classroomFind.vacations - 1 },
    });
  }
}

export default ClassroomService;
