import request from 'supertest';
import express from 'express';
import router from '../routes/user';
import { registerUser } from '../service/userService';

jest.mock('../service/userService', () => ({
  registerUser: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(router);

describe('POST /registerUser', () => {
  const mockRequestData = {
    firstname: 'John',
    lastname: 'Doe',
    phone: '123456789',
    email: 'john.doe@example.com',
    passwordhash: 'securepassword',
  };

  it('should register a user and return 201 with success message', async () => {
    (registerUser as jest.Mock).mockResolvedValue({
      message: 'Usuario creado con exito bajo el id: 1',
    });

    const response = await request(app)
      .post('/registerUser')
      .send({ data: mockRequestData });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Usuario creado con exito',
      data: { message: 'Usuario creado con exito bajo el id: 1' },
    });
    expect(registerUser).toHaveBeenCalledWith({
      ...mockRequestData,
      role: 'user',
    });
  });

  it('should return 400 if user registration fails due to validation error', async () => {
    (registerUser as jest.Mock).mockResolvedValue({
      error: ['Validation error 1', 'Validation error 2'],
    });

    const response = await request(app)
      .post('/registerUser')
      .send({ data: mockRequestData });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      userCreate: { error: ['Validation error 1', 'Validation error 2'] },
    });
  });

  it('should return 500 if there is an internal server error', async () => {
    (registerUser as jest.Mock).mockRejectedValue(new Error('Internal server error'));

    const response = await request(app)
      .post('/registerUser')
      .send({ data: mockRequestData });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });
});
