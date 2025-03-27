import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { Funko } from "../models/funko.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Obtiene la ruta de la carpeta de un usuario.
 * @param user - Nombre del usuario.
 * @returns La ruta de la carpeta del usuario.
 */
export const getUserFolder = (user: string) =>
  path.join(__dirname, "../../data", user);

export interface ReadFunkoArgs {
  id: number;
  user: string;
}

/**
 * Lee un Funko de la colección de un usuario.
 *
 * @param argv - Objeto que contiene los argumentos de la interfaz de línea de comandos.
 * @returns No devuelve ningún valor, pero imprime mensajes en la consola.
 */
export const readFunko = (argv: ReadFunkoArgs) => {
  const userFolder = getUserFolder(argv.user);
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
    const funkoData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(chalk.blueBright(`Información del Funko con ID ${argv.id}`));
    console.log(formatFunkoData(funkoData));
  } catch (error) {
    console.log(chalk.red(`Error al leer el Funko: ${error.message}`));
  }
};

/**
 * Formatea los datos de un Funko para imprimir en la consola.
 * @param funko - Objeto Funko.
 * @returns Los datos del Funko formateados.
 */
export const formatFunkoData = (funko: Funko) => {
  return `
  ${chalk.green(`ID: ${funko.id}`)}
  ${chalk.green(`Nombre: ${funko.name}`)}
  ${chalk.green(`Descripción: ${funko.description}`)}
  ${chalk.green(`Tipo: ${funko.type}`)}
  ${chalk.green(`Género: ${funko.genre}`)}
  ${chalk.green(`Franquicia: ${funko.franchise}`)}
  ${chalk.green(`Número: ${funko.number}`)}
  ${chalk.green(`Exclusivo: ${funko.exclusive ? "Sí" : "No"}`)}
  ${chalk.green(`Características especiales: ${funko.specialFeatures || "Ninguna"}`)}
  ${chalk.green("Valor de mercado:")} ${getMarketValueColor(funko.marketValue)}
  `;
};

/**
 * Obtiene el color correspondiente al valor de mercado de un Funko.
 * @param value - Valor de mercado del Funko.
 * @returns El valor de mercado con el color correspondiente.
 */
export const getMarketValueColor = (value: number) => {
  if (value >= 100) return chalk.green(`$${value}`);
  if (value >= 50) return chalk.yellow(`$${value}`);
  if (value >= 20) return chalk.magenta(`$${value}`);
  return chalk.red(`$${value}`);
};
