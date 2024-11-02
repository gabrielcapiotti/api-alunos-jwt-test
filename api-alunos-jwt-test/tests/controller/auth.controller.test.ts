import app from "../../src";
import request from "supertest";
import prismaConnection from "../../src/database/prisma.connection";

describe("Teste de Auth do controller auth.controller", () => {
  let token: string | undefined;

  const dataAuth = {
    email: "testes@email.com",
    password: "123456",
  };

  const dataStudent = {
    name: "Testes",
    email: "testes@email.com",
    type: "M",
  };

  beforeAll(async () => {
    const student = await request(app)
      .post("/students")
      .send(dataStudent)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    const response = await request(app)
      .post("/users")
      .send(dataAuth)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    token = response.body.token;
  });

  afterAll(async () => {
    const deleteStudent = await prismaConnection.students.findFirst({
      where: {email: dataAuth.email},
    });

    const deleteUser = await prismaConnection.users.delete({
      where: {studentId: deleteStudent?.id},
    });

    const deleteStudentUser = await prismaConnection.students.delete({
      where: {id: deleteStudent?.id},
    });
  });

  test("O usuário digitou o login ou senha incorretos", async () => {
    const response = await request(app)
      .post("/auth")
      .send({email: "test@email.com", password: dataAuth.password})
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.body.success).toEqual(false);
  });

  test("O usuário digitou tudo corretamente", async () => {
    const response = await request(app)
      .post("/auth")
      .send({email: dataAuth.email, password: dataAuth.password})
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.body.success).toEqual(true);
  });

  test("O usuário não digitou os campos obrigatórios", async () => {
    const response = await request(app)
      .post("/auth")
      .send()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.body.success).toEqual(false);
  });
});
