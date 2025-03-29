import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { FunkoGenre, FunkoType } from "../models/funko.js";
import { readFunko } from "./read.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Obtiene la ruta del directorio de un usuario.
 *
 * @param user - Nombre del usuario.
 * @returns Ruta del directorio del usuario.
 */
export const getUserFolder = (user: string) =>
  path.join(__dirname, "../../data", user);

/**
 * Interfaz que representa los argumentos pasados desde la CLI para agregar un Funko.
 */
export interface UpdateFunkoArgs {
  id: number;
  user: string;
  name: string;
  description: string;
  type: string;
  genre: string;
  franchise: string;
  number: number;
  exclusive: boolean;
  specialFeatures: string;
  marketValue: number;
}

/**
 * Modifica un Funko de la colección de un usuario.
 *
 * @param argv - Objeto que contiene los argumentos de la interfaz de línea de comandos.
 * @returns No devuelve ningún valor, pero imprime mensajes en la consola.
 */
export const updateFunko = (argv: UpdateFunkoArgs): boolean => {
  const userFolder = getUserFolder(argv.user);
  const filePath = path.join(userFolder, `${argv.id}.json`);

  // Primero verifica si el Funko existe
  const existingFunko = readFunko({ id: argv.id, user: argv.user });

  if (!existingFunko) {
    // Si no existe, muestra el mensaje de error
    console.log(
      chalk.red(
        `Error: No se encontró un Funko con ID ${argv.id} en la lista de ${argv.user}.`,
      ),
    );
    return false; // Detiene la ejecución
  }

  if (!Object.values(FunkoType).includes(argv.type as FunkoType)) {
    console.log(chalk.red(`Tipo de Funko inválido: ${argv.type}`));
    return false;
  }

  if (!Object.values(FunkoGenre).includes(argv.genre as FunkoGenre)) {
    console.log(chalk.red(`Género de Funko inválido: ${argv.genre}`));
    return false;
  }

  try {
    const updatedFunko = {
      ...existingFunko,
      ...Object.fromEntries(
        Object.entries(argv).filter(
          ([key, value]) =>
            value !== undefined && !["_", "$0", "user", "id"].includes(key),
        ),
      ),
    };

    fs.writeFileSync(filePath, JSON.stringify(updatedFunko, null, 2));
    console.log(
      chalk.green(`Funko con ID ${argv.id} modificado correctamente.`),
    );
  } catch (error) {
    console.log(chalk.red(`Error al modificar el Funko: ${error.message}`));
  }

  return true;
};
