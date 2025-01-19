const request = require("supertest");
const app = require("../index");
const { expect } = require("chai");

describe("POST /login", () => {
  it("możliwość zalogowania przy użyciu prawidłowych danych", async () => {
    const response = await request(app)
      .post("/login")
      .send({ login: "klient", haslo: "klient" });

    expect(response.status).to.equal(200);
  });

  it("sprawdzenie logowania przy użyciu błędnych danych", async () => {
    const response = await request(app)
      .post("/login")
      .send({ login: "klient", haslo: "zlehasloklienta" });

    expect(response.status).to.equal(400);
  });
});
