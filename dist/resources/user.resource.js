var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import argon2 from "argon2";
import passwordsFeature from "@adminjs/passwords";
import { User } from "../models/index.js";
import { ComponentLoader } from "adminjs";
const componentLoader = new ComponentLoader();
const UserResource = {
    resource: User,
    options: {
        properties: {
            password: { isVisible: false }, // Oculta el campo password original
            newPassword: {
                type: "string",
                isVisible: { list: false, filter: false, show: false, edit: true }, // Campo para la nueva contraseña
            },
        },
        actions: {
            edit: {
                before: (request) => __awaiter(void 0, void 0, void 0, function* () {
                    if (request.payload.newPassword) {
                        const hashedPassword = yield argon2.hash(request.payload.newPassword);
                        request.payload.password = hashedPassword; // Guarda la contraseña hasheada
                        delete request.payload.newPassword; // Elimina el campo newPassword
                    }
                    return request;
                }),
            },
            new: {
                before: (request) => __awaiter(void 0, void 0, void 0, function* () {
                    if (request.payload.password) {
                        const hashedPassword = yield argon2.hash(request.payload.password);
                        request.payload.password = hashedPassword;
                    }
                    return request;
                }),
            },
        },
    },
    features: [
        passwordsFeature({
            properties: {
                encryptedPassword: "password",
                password: "newPassword",
            },
            hash: argon2.hash,
            componentLoader,
        }),
    ],
};
export default UserResource;
