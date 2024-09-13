import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IncomingHttpHeaders } from "http";

// Define una interfaz para el objeto session
interface Session {
  user: any | null;
}

// Extiende la interfaz Request para incluir session como opcional
interface CustomRequest extends Request {
  session?: Session;
  headers: IncomingHttpHeaders & {
    "access-token"?: string;
  };
}

// Middleware de autenticación que protege la ruta
const authSession = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers["access-token"];

  // Verifica si hay un token en la solicitud
  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    // Verifica el token JWT
    const data = jwt.verify(token, process.env.SECRET_KEY as string) as any;
    req.session = { user: data };  // Almacena los datos del token en la sesión
    next();
    return
  } catch (error) {
    // Retorna un error si la verificación falla
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export { authSession };
