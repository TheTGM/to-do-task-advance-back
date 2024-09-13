"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSession = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware de autenticación que protege la ruta
const authSession = (req, res, next) => {
    const token = req.headers["access-token"];
    // Verifica si hay un token en la solicitud
    if (!token) {
        return res.status(401).json({ message: "Access token missing" });
    }
    try {
        // Verifica el token JWT
        const data = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.session = { user: data }; // Almacena los datos del token en la sesión
        next();
        return;
    }
    catch (error) {
        // Retorna un error si la verificación falla
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authSession = authSession;
