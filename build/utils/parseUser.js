"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLoginUser = void 0;
const parseLoginUser = (user) => {
    return {
        iduser: user.iduser,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
    };
};
exports.parseLoginUser = parseLoginUser;
