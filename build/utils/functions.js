"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const parseUser_1 = require("../utils/parseUser");
const auth_1 = require("../utils/auth");
const login = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const match = yield bcrypt_1.default.compare(data.passwordhash, user.passwordhash);
    if (!match)
        return { error: "Contraseña Incorrecta" };
    const infoParsed = (0, parseUser_1.parseLoginUser)(user);
    const token = (0, auth_1.auth)(infoParsed);
    return Object.assign(Object.assign({}, infoParsed), { token });
});
exports.login = login;
