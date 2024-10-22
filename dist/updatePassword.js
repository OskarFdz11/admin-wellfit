var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as bcrypt from "bcrypt";
import { User } from "./models/user.entity.js"; // Importa el modelo de usuario
const updatePassword = () => __awaiter(void 0, void 0, void 0, function* () {
    const email = "oskar.fdz111@gmail.com"; // El email del usuario existente
    const newPassword = "spd69541"; // La nueva contraseña que deseas establecer
    // Encriptar la nueva contraseña
    const hashedPassword = yield bcrypt.hash(newPassword, 10);
    // Buscar al usuario y actualizar su contraseña
    yield User.findOneAndUpdate({ email }, // Encontrar al usuario por su email
    { password: hashedPassword }, // Actualizar con la contraseña encriptada
    { new: true } // Devolver el nuevo documento actualizado
    );
    console.log("Contraseña actualizada para el usuario:", email);
});
// Llamar a la función para actualizar la contraseña
updatePassword()
    .then(() => {
    console.log("Contraseña actualizada exitosamente");
    process.exit();
})
    .catch((err) => {
    console.error("Error al actualizar la contraseña:", err);
    process.exit(1);
});
