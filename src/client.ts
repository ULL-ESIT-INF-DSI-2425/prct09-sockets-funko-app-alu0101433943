import net from "net";
import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FunkoType, FunkoGenre } from "./models/funko.js";
import { RequestType } from "./types.js";

/**
 * Función para enviar la solicitud al servidor y manejar la respuesta.
 * @param request - Objeto que representa la solicitud.
 */
function sendRequest(request: RequestType) {
  const client = net.connect({ port: 3000 }, () => {
    client.write(JSON.stringify(request));
  });

  client.on("data", (data) => {
    const response = JSON.parse(data.toString());
    if (response.success) {
      console.log(chalk.green("Operación exitosa:"));
      if (response.message) {
        console.log(response.message);
      }
    } else {
      console.log(chalk.red("Error en la operación:"), response.message);
    }
    client.end();
  });

  client.on("error", (err) => {
    console.error(chalk.red("Error de conexión:"), err.message);
  });
}

// Procesamiento de comandos con Yargs
export const argv = yargs(hideBin(process.argv))
  .command(
    "add",
    "Añadir un Funko",
    (yargs) =>
      yargs
        .option("id", { type: "number", demandOption: true })
        .option("user", { type: "string", demandOption: true })
        .option("name", { type: "string", demandOption: true })
        .option("description", { type: "string", demandOption: true })
        .option("type", {
          type: "string",
          choices: Object.values(FunkoType),
          demandOption: true,
        })
        .option("genre", {
          type: "string",
          choices: Object.values(FunkoGenre),
          demandOption: true,
        })
        .option("franchise", { type: "string", demandOption: true })
        .option("number", { type: "number", demandOption: true })
        .option("exclusive", { type: "boolean", demandOption: true })
        .option("specialFeatures", { type: "string", default: "" })
        .option("marketValue", { type: "number", demandOption: true }),
    (argv) => {
      sendRequest({
        type: "add",
        user: argv.user,
        funkoPop: [
          {
            id: argv.id,
            name: argv.name,
            description: argv.description,
            type: argv.type as FunkoType,
            genre: argv.genre as FunkoGenre,
            franchise: argv.franchise,
            number: argv.number,
            exclusive: argv.exclusive,
            specialFeatures: argv.specialFeatures,
            marketValue: argv.marketValue,
          },
        ],
      } as RequestType);
    },
  )

  .command(
    "list",
    "Listar los Funkos de un usuario",
    (yargs) => yargs.option("user", { type: "string", demandOption: true }),
    (argv) => {
      sendRequest({ type: "list", user: argv.user } as RequestType);
    },
  )

  .command(
    "read",
    "Leer un Funko",
    (yargs) =>
      yargs
        .option("id", { type: "number", demandOption: true })
        .option("user", { type: "string", demandOption: true }),
    (argv) => {
      sendRequest({
        type: "read",
        user: argv.user,
        funkoPop: [{ id: argv.id }],
      } as RequestType);
    },
  )
  .command(
    "remove",
    "Eliminar un Funko",
    (yargs) =>
      yargs
        .option("id", { type: "number", demandOption: true })
        .option("user", { type: "string", demandOption: true }),
    (argv) => {
      sendRequest({
        type: "remove",
        user: argv.user,
        funkoPop: [{ id: argv.id }],
      } as RequestType);
    },
  )
  .command(
    "update",
    "Actualizar un Funko",
    (yargs) =>
      yargs
        .option("id", { type: "number", demandOption: true })
        .option("user", { type: "string", demandOption: true })
        .option("name", {
          alias: "n",
          type: "string",
          description: "Nombre del Funko",
        })
        .option("description", { type: "string", demandOption: true })
        .option("type", {
          type: "string",
          choices: Object.values(FunkoType),
          demandOption: true,
        })
        .option("genre", {
          type: "string",
          choices: Object.values(FunkoGenre),
          demandOption: true,
        })
        .option("franchise", { type: "string", demandOption: true })
        .option("number", {
          alias: "num", // Cambié el alias de "n" a "num"
          type: "number",
          description: "Número del Funko",
        })
        .option("exclusive", { type: "boolean", demandOption: true })
        .option("specialFeatures", { type: "string", default: "" })
        .option("marketValue", { type: "number", demandOption: true }),
    (argv) => {
      sendRequest({
        type: "update",
        user: argv.user,
        funkoPop: [
          {
            id: argv.id,
            name: argv.name,
            description: argv.description,
            type: argv.type as FunkoType,
            genre: argv.genre as FunkoGenre,
            franchise: argv.franchise,
            number: argv.number,
            exclusive: argv.exclusive,
            specialFeatures: argv.specialFeatures,
            marketValue: argv.marketValue,
          },
        ],
      } as RequestType);
    },
  )

  .help()
  .strict()
  .demandCommand(1, "Debes especificar un comando válido")
  .parse();
