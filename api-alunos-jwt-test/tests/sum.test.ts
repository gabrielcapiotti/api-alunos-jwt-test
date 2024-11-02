import sum from "../src/utils/sum";

describe("Teste da função sum", () => {
  test("Ele deve retornar 2 quando a sum(1,1)", () => {
    const result = sum("Minha primeira mensagem", 1, 1);

    expect(result).toEqual(2);
  });
});
