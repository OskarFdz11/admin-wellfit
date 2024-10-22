import { Schema, model } from "mongoose";
import argon2 from "argon2";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer",
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

// Middleware para encriptar la contraseña antes de guardarla
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await argon2.hash(this.password); // Hashea la contraseña con argon2
  }
  next();
});

// Método para comparar la contraseña ingresada con la almacenada
UserSchema.methods.comparePassword = async function (password: string) {
  return argon2.verify(this.password, password); // Verifica la contraseña con argon2
};

export const User = model("User", UserSchema);
