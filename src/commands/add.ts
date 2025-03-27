import chalk from "chalk";
import { Funko, FunkoGenre, FunkoType } from "../models/funko.js";
import { FileManager } from "../utils/fileManager.js";

/**
 * Interfaz que representa los argumentos pasados desde la CLI para agregar un Funko.
 */
export interface AddFunkoArgs {
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
 * Agrega un nuevo Funko a la colección de un usuario.
 *
 * @param argv - Objeto que contiene los argumentos de la interfaz de línea de comandos.
 * @returns No devuelve ningún valor, pero imprime mensajes en la consola.
 */
export const addFunko = (argv: AddFunkoArgs) => {
  if (argv.marketValue <= 0) {
    console.log(chalk.red("El valor de mercado debe ser un número positivo."));
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

  const existingFunko = FileManager.loadFunko(argv.user, argv.id);
  if (existingFunko) {
    console.log(
      chalk.red(
        `Funko con ID ${argv.id} ya existe en la colección de ${argv.user}!`,
      ),
    );
    return;
  }

  const newFunko: Funko = {
    id: argv.id,
    name: argv.name,
    description: argv.description,
    type: argv.type as Funko["type"],
    genre: argv.genre as Funko["genre"],
    franchise: argv.franchise,
    number: argv.number,
    exclusive: argv.exclusive,
    specialFeatures: argv.specialFeatures || "",
    marketValue: argv.marketValue,
  };

  FileManager.saveFunko(argv.user, newFunko);
  console.log(
    chalk.green(`Nuevo Funko agregado a la colección de ${argv.user}!`),
  );
};
