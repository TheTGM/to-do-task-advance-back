import request from 'supertest';
import express from 'express';
import router from '../routes/task';
import { deleteTask } from '../service/taskService';

jest.mock('../service/taskService', () => ({
  deleteTask: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(router);

describe('DELETE /deleteTask/:id', () => {
  it('should delete the task and return 200 with success message', async () => {
    (deleteTask as jest.Mock).mockResolvedValue({
      success: true,
      idtask: 1,
    });

    const response = await request(app)
      .delete('/deleteTask/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      idtask: 1,
    });
    expect(deleteTask).toHaveBeenCalledWith(1);
  });

  it('should return 400 if task deletion fails due to an error', async () => {
    (deleteTask as jest.Mock).mockResolvedValue({
      error: 'Task not found or could not be deleted',
    });

    const response = await request(app)
      .delete('/deleteTask/1');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Task not found or could not be deleted',
    });
  });

  it('should return 500 if there is an internal server error', async () => {
    (deleteTask as jest.Mock).mockRejectedValue(new Error('Internal server error'));

    const response = await request(app)
      .delete('/deleteTask/1');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });
});
