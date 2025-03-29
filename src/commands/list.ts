import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { Funko } from "../models/funko.js";

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

export interface ListFunkoArgs {
  user: string;
}

/**
 * Lista todos los Funkos de un usuario.
 *
 * @param argv - Objeto que contiene los argumentos de la interfaz de línea de comandos.
 * @returns No devuelve ningún valor, pero imprime mensajes en la consola.
 */
export const listFunkos = (argv: ListFunkoArgs): string => {
  // 🔹 Ahora devuelve un string
  const userFolder = getUserFolder(argv.user);
  if (!fs.existsSync(userFolder)) {
    return chalk.red(`No se encontró la colección de ${argv.user}.`);
  }

  const funkoFiles = fs.readdirSync(userFolder);
  if (funkoFiles.length === 0) {
    return chalk.yellow(`La colección de ${argv.user} está vacía.`);
  }

  let result = chalk.blueBright(`Colección de Funkos de ${argv.user}\n`);
  result += chalk.blue("--------------------------------\n");

  funkoFiles.forEach((file) => {
    const filePath = path.join(userFolder, file);
    const funkoData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    result += formatFunkoData(funkoData) + "\n";
    result += chalk.blue("--------------------------------\n");
  });

  return result; // 🔹 Devuelve el string con el listado
};

/**
 * Formatea la información de un Funko para imprimir en la consola.
 *
 * @param funko - Objeto Funko.
 * @returns El texto formateado del Funko.
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
 *
 * @param value - Valor de mercado del Funko.
 * @returns El color correspondiente al valor de mercado.
 */
export const getMarketValueColor = (value: number) => {
  if (value >= 100) return chalk.green(`$${value}`);
  if (value >= 50) return chalk.yellow(`$${value}`);
  if (value >= 20) return chalk.magenta(`$${value}`);
  return chalk.red(`$${value}`);
};
