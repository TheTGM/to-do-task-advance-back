import request from "supertest";
import express from "express";
import router from "../routes/task";
import { updateTask } from "../service/taskService";

jest.mock("../service/taskService", () => ({
  updateTask: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(router);

describe("PUT /putTask/:id", () => {
  const mockRequestData = {
    name: "Updated Task",
    description: "This is an updated task",
    status: "completed",
  };

  it("should update the task and return 200 with success message", async () => {
    (updateTask as jest.Mock).mockResolvedValue({
      success: true,
      message: "Task updated successfully",
    });

    const response = await request(app)
      .put("/putTask/1")
      .send({ data: mockRequestData });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      task: {
        success: true,
        message: "Task updated successfully",
      },
    });
    expect(updateTask).toHaveBeenCalledWith(1, mockRequestData);
  });

  it("should return 400 if task update fails due to validation error", async () => {
    (updateTask as jest.Mock).mockResolvedValue({
      error: ["Validation error 1", "Validation error 2"],
    });

    const response = await request(app)
      .put("/putTask/1")
      .send({ data: mockRequestData });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      task: { error: ["Validation error 1", "Validation error 2"] },
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    (updateTask as jest.Mock).mockRejectedValue(
      new Error("Internal server error")
    );

    const response = await request(app)
      .put("/putTask/1")
      .send({ data: mockRequestData });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server errorx" });
  });
});
