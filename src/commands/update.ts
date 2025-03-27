import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { FunkoGenre, FunkoType } from "../models/funko.js";

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
export const updateFunko = (argv: UpdateFunkoArgs) => {
  const userFolder = getUserFolder(argv.user);
  const filePath = path.join(userFolder, `${argv.id}.json`);

  if (!fs.existsSync(filePath)) {
    console.log(
      chalk.red(
        `Error: No se encontró un Funko con ID ${argv.id} en la lista de ${argv.user}.`,
      ),
    );
    return;
  }

  if (!Object.values(FunkoType).includes(argv.type as FunkoType)) {
    console.log(chalk.red(`Tipo de Funko inválido: ${argv.type}`));
    return;
  }

  if (!Object.values(FunkoGenre).includes(argv.genre as FunkoGenre)) {
    console.log(chalk.red(`Género de Funko inválido: ${argv.genre}`));
    return;
  }

  try {
    const funkoData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const updatedFunko = {
      ...funkoData,
      ...Object.fromEntries(
        Object.entries(argv).filter(
          /**
           * Filtra los valores indefinidos y las claves no deseadas.
           * @param param0 - Par clave-valor.
           * @returns Verdadero si el valor no es indefinido y la clave no es "_", "$0", "user" o "id".
           */
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
};
