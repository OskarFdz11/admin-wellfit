var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import session from "express-session";
import * as AdminJSMongoose from "@adminjs/mongoose";
import connectDB from "./config/db.js";
import { Category, Post, Product, User } from "./models/index.js";
import argon2 from "argon2";
import UserResource from "./resources/user.resource.js";
const PORT = 3000;
const componentLoader = new ComponentLoader();
// Registrar el adaptador de Mongoose para AdminJS
AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express();
    // conectar a MongoDB
    yield connectDB();
    // Configurar express-session
    app.use(session({
        secret: "mysecret", // Cambia esto por un valor seguro en producción
        resave: false,
        saveUninitialized: true,
        cookie: { secure: process.env.NODE_ENV === "production" }, // Solo cookies seguras en producción
    }));
    // Opciones de AdminJS
    const adminOptions = {
        resources: [UserResource, Category, Post, Product],
    };
    const admin = new AdminJS(adminOptions);
    // Función de autenticación
    const authenticate = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User.findOne({ email });
        if (user && (yield argon2.verify(user.password, password))) {
            return user; // Retorna el usuario si la autenticación es exitosa
        }
        return null; // Retorna null si no es exitosa
    });
    // Proteger AdminJS con autenticación y roles
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield authenticate(email, password); // Verifica credenciales
            if (user) {
                return { email: user.email, role: user.role }; // Retorna el usuario con rol
            }
            return null; // Si no se autentica, retorna null
        }),
        cookieName: "adminjs",
        cookiePassword: "$Spd69541$", // Asegúrate de cambiar esto en producción
    }, null, {
        resave: false,
        saveUninitialized: true,
        secret: "sessionsecret", // Asegúrate de cambiar esto en producción
        cookie: { secure: process.env.NODE_ENV === "production" }, // Cookies seguras en producción
    });
    // Usar el router de AdminJS con autenticación
    app.use(admin.options.rootPath, adminRouter);
    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
    });
});
start();
