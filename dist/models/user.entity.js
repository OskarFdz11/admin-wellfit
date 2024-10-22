var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Schema, model } from "mongoose";
import argon2 from "argon2";
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "editor", "viewer"],
        default: "viewer",
    },
}, {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
});
// Middleware para encriptar la contraseña antes de guardarla
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password") || this.isNew) {
            this.password = yield argon2.hash(this.password); // Hashea la contraseña con argon2
        }
        next();
    });
});
// Método para comparar la contraseña ingresada con la almacenada
UserSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return argon2.verify(this.password, password); // Verifica la contraseña con argon2
    });
};
export const User = model("User", UserSchema);
