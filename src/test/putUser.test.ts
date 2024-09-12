import request from "supertest";
import express from "express";
import router from "../routes/user";
import { updateUser } from "../service/userService";

jest.mock("../service/userService", () => ({
  updateUser: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(router);

describe("PUT /putUser/:id", () => {
  const mockUpdateData = {
    firstname: "John",
    lastname: "Doe",
    phone: "123456789",
    role: "user",
  };

  it("should update the user and return 200 with success message", async () => {
    (updateUser as jest.Mock).mockResolvedValue({
      success: true,
      message: "User updated successfully",
    });

    const response = await request(app)
      .put("/putUser/1")
      .send({ data: mockUpdateData });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: { success: true, message: "User updated successfully" },
    });
    expect(updateUser).toHaveBeenCalledWith({ ...mockUpdateData, iduser: 1 });
  });

  it("should return 400 if user update fails due to validation error", async () => {
    (updateUser as jest.Mock).mockResolvedValue({
      error: ["Validation error 1", "Validation error 2"],
    });

    const response = await request(app)
      .put("/putUser/1")
      .send({ data: mockUpdateData });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      user: { error: ["Validation error 1", "Validation error 2"] },
    });
  });

  it("should return 400 if user not found or no changes made", async () => {
    (updateUser as jest.Mock).mockResolvedValue({
      error: "User not found or no changes made",
    });

    const response = await request(app)
      .put("/putUser/1")
      .send({ data: mockUpdateData });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      user: { error: "User not found or no changes made" },
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    (updateUser as jest.Mock).mockRejectedValue(
      new Error("Internal server error")
    );

    const response = await request(app)
      .put("/putUser/1")
      .send({ data: mockUpdateData });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Internal server error",
    });
  });
});
