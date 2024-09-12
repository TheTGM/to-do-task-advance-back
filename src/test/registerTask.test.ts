import { registerTask } from '../service/taskService';
import request from 'supertest';
import express from 'express';
import router from '../routes/task'; 
jest.mock('../service/taskService', () => ({
  registerTask: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(router);

describe('POST /createTask', () => {
  const mockRequestData = {
    data: {
      iduser: 1,
      name: 'Test Task',
      description: 'This is a test task',
      status: 'pending',
    },
  };

  it('should create a task and return 201 with success message', async () => {
    (registerTask as jest.Mock).mockResolvedValue({
      message: 'Task created successfully with ID: 1',
    });

    const response = await request(app)
      .post('/createTask')
      .send(mockRequestData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Task created successfully',
      data: { message: 'Task created successfully with ID: 1' },
    });
    expect(registerTask).toHaveBeenCalledWith(mockRequestData.data);
  });

  it('should return 400 if task creation fails with validation error', async () => {
    (registerTask as jest.Mock).mockResolvedValue({
      error: ['Validation error 1', 'Validation error 2'],
    });

    const response = await request(app)
      .post('/createTask')
      .send(mockRequestData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      taskCreate: { error: ['Validation error 1', 'Validation error 2'] },
    });
  });

  it('should return 500 if there is an internal server error', async () => {
    (registerTask as jest.Mock).mockRejectedValue(new Error('Internal server error'));

    const response = await request(app)
      .post('/createTask')
      .send(mockRequestData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });
});
