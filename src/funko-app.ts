export * from "./commands/add.js";
export * from "./commands/list.js";
export * from "./models/funko.js";
export * from "./utils/fileManager.js";

export type { AddFunkoArgs } from "./commands/add.js";
export type { ListFunkoArgs } from "./commands/list.js";
export type { ReadFunkoArgs } from "./commands/read.js";
export type { RemoveFunkoArgs } from "./commands/remove.js";
export type { UpdateFunkoArgs } from "./commands/update.js";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { addFunko } from "./commands/add.js";
import { listFunkos } from "./commands/list.js";
import { readFunko } from "./commands/read.js";
import { updateFunko } from "./commands/update.js";
import { deleteFunko } from "./commands/remove.js";

/**
 * Función principal que define los comandos de la interfaz de línea de comandos.
 */
export function main() {
  yargs(hideBin(process.argv))
    .command(
      "add",
      "Añadir un Funko",
      /**
       * Función que define los argumentos de la interfaz de línea de comandos para el comando "add".
       * @param yargs - Instancia de Yargs que permite definir los argumentos.
       * @returns Instancia de Yargs con los argumentos definidos.
       */
      (yargs) => {
        return yargs
          .option("user", { type: "string", demandOption: true })
          .option("id", { type: "number", demandOption: true })
          .option("name", { type: "string", demandOption: true })
          .option("description", { type: "string", demandOption: true })
          .option("type", { type: "string", demandOption: true })
          .option("genre", { type: "string", demandOption: true })
          .option("franchise", { type: "string", demandOption: true })
          .option("number", { type: "number", demandOption: true })
          .option("exclusive", { type: "boolean", demandOption: true })
          .option("specialFeatures", { type: "string", demandOption: false })
          .option("marketValue", { type: "number", demandOption: true });
      },
      /**
       * Función que se ejecuta al invocar el comando "add".
       * @param argv - Objeto que contiene los argumentos de la interfaz de línea de comandos.
       */
      (argv) => addFunko(argv),
    )

    .command(
      "modify",
      "Modificar un Funko",
      /**
       * Función que define los argumentos de la interfaz de línea de comandos para el comando "modify".
       * @param yargs - Instancia de Yargs que permite definir los argumentos.
       * @returns Instancia de Yargs con los argumentos definidos.
       */
      (yargs) => {
        return yargs
          .option("user", { type: "string", demandOption: true })
          .option("id", { type: "number", demandOption: true })
          .option("name", { type: "string", demandOption: false })
          .option("description", { type: "string", demandOption: false })
          .option("type", { type: "string", demandOption: false })
          .option("genre", { type: "string", demandOption: false })
          .option("franchise", { type: "string", demandOption: false })
          .option("number", { type: "number", demandOption: false })
          .option("exclusive", { type: "boolean", demandOption: false })
          .option("specialFeatures", { type: "string", demandOption: false })
          .option("marketValue", { type: "number", demandOption: false });
      },
      /**
       * Función que se ejecuta al invocar el comando "modify".
       * @param argv - Objeto que contiene los argumentos de la interfaz de línea de comandos.
       */
      (argv) => updateFunko(argv),
    )

    .command(
      "list",
      "Listar todos los Funkos de un usuario",
      /**
       * Función que define los argumentos de la interfaz de línea de comandos para el comando "list".
       * @param yargs - Instancia de Yargs que permite definir los argumentos.
       * @returns Instancia de Yargs con los argumentos definidos.
       */
      (yargs) => {
        return yargs.option("user", { type: "string", demandOption: true });
      },
      /**
       * Función que se ejecuta al invocar el comando "list".
       * @param argv - Objeto que contiene los argumentos de la interfaz de línea de comandos.
       */
      (argv) => listFunkos(argv),
    )

    .command(
      "read",
      "Mostrar información de un Funko",
      /**
       * Función que define los argumentos de la interfaz de línea de comandos para el comando "read".
       * @param yargs - Instancia de Yargs que permite definir los argumentos.
       * @returns Instancia de Yargs con los argumentos definidos.
       */
      (yargs) => {
        return yargs
          .option("user", { type: "string", demandOption: true })
          .option("id", { type: "number", demandOption: true });
      },
      /**
       * Función que se ejecuta al invocar el comando "read".
       * @param argv - Objeto que contiene los argumentos de la interfaz de línea de comandos.
       */
      (argv) => readFunko(argv),
    )
    .command(
      "remove",
      "Eliminar un Funko",
      /**
       * Función que define los argumentos de la interfaz de línea de comandos para el comando "remove".
       * @param yargs - Instancia de Yargs que permite definir los argumentos.
       * @returns Instancia de Yargs con los argumentos definidos.
       */
      (yargs) => {
        return yargs
          .option("user", { type: "string", demandOption: true })
          .option("id", { type: "number", demandOption: true });
      },
      /**
       * Función que se ejecuta al invocar el comando "remove".
       * @param argv - Objeto que contiene los argumentos de la interfaz de línea de comandos.
       */
      (argv) => deleteFunko(argv),
    )
    .help()
    .parse();
}

main();
