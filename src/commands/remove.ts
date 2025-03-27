import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Obtiene la ruta de la carpeta de un usuario.
 *
 * @param user - Nombre del usuario.
 * @returns La ruta de la carpeta del usuario.
 */
export const getUserFolder = (user: string) =>
  path.join(__dirname, "../../data", user);

/**
 * Interfaz que representa los argumentos pasados desde la CLI para agregar un Funko.
 */
export interface RemoveFunkoArgs {
  id: number;
  user: string;
}

/**
 * Elimina un Funko de la colección de un usuario.
 *
 * @param argv - Objeto que contiene los argumentos de la interfaz de línea de comandos.
 * @returns No devuelve ningún valor, pero imprime mensajes en la consola.
 */
export const deleteFunko = (argv: RemoveFunkoArgs) => {
  if (isNaN(argv.id) || argv.id <= 0) {
    console.log(
      chalk.red("Error: El ID del Funko debe ser un número positivo."),
    );
    return;
  }

  const userFolder = getUserFolder(argv.user);

  if (!fs.existsSync(userFolder)) {
    console.log(
      chalk.red(
        `Error: El usuario "${argv.user}" no tiene Funkos almacenados.`,
      ),
    );
    return;
  }

  const filePath = path.join(userFolder, `${argv.id}.json`);

  if (!fs.existsSync(filePath)) {
    console.log(
      chalk.red(
        `Error: No se encontró un Funko con ID ${argv.id} en la colección de ${argv.user}.`,
      ),
    );
    return;
  }

  try {
    fs.unlinkSync(filePath);
    console.log(
      chalk.green(
        `Funko con ID ${argv.id} eliminado correctamente de la colección de ${argv.user}.`,
      ),
    );
  } catch (error) {
    console.log(chalk.red(`Error al eliminar el Funko: ${error.message}`));
  }
};
