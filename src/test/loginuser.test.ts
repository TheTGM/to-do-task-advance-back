import request from "supertest";
import express from "express";
import router from "../routes/user";
import { loginUser } from "../service/userService";

jest.mock("../service/userService", () => ({
  loginUser: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(router);

describe("POST /loginUser", () => {
  const mockLoginData = {
    email: "john.doe@example.com",
    password: "securepassword",
  };

  it("should log in the user and return 200 with success message", async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
    });

    const response = await request(app)
      .post("/loginUser")
      .send({ data: mockLoginData });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User logged in successfully",
      data: {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
      },
    });
    expect(loginUser).toHaveBeenCalledWith(mockLoginData);
  });

  it("should return 400 if login validation fails", async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      error: ["Validation error 1", "Validation error 2"],
    });

    const response = await request(app)
      .post("/loginUser")
      .send({ data: mockLoginData });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      dataUser: { error: ["Validation error 1", "Validation error 2"] },
    });
  });

  it("should return 400 if user is not found", async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      error: "No se encuentra el usuario",
    });

    const response = await request(app)
      .post("/loginUser")
      .send({ data: mockLoginData });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      dataUser: { error: "No se encuentra el usuario" },
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    (loginUser as jest.Mock).mockRejectedValue(
      new Error("Internal server error")
    );

    const response = await request(app)
      .post("/loginUser")
      .send({ data: mockLoginData });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Internal server error",
    });
  });
});
