import argon2 from "argon2";

// Contraseña en texto plano que deseas encriptar
const plainPassword = "spd69541"; // Cambia "adminpassword" por la contraseña que prefieras

// Función para generar el hash
argon2
  .hash(plainPassword)
  .then((hash) => {
    console.log("Hashed password:", hash); // Mostrar el hash generado en la consola
  })
  .catch((err) => {
    console.error("Error al generar el hash:", err); // Manejar errores
  });
