import argon2 from "argon2";
import passwordsFeature from "@adminjs/passwords";
import { User } from "../models/index.js";
import AdminJS, { ActionRequest, ComponentLoader } from "adminjs";

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
        before: async (request: any) => {
          if (request.payload.newPassword) {
            const hashedPassword = await argon2.hash(
              request.payload.newPassword
            );
            request.payload.password = hashedPassword; // Guarda la contraseña hasheada
            delete request.payload.newPassword; // Elimina el campo newPassword
          }
          return request;
        },
      },
      new: {
        before: async (request: any) => {
          if (request.payload.password) {
            const hashedPassword = await argon2.hash(request.payload.password);
            request.payload.password = hashedPassword;
          }
          return request;
        },
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
