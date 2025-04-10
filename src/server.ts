import net from "net";
import chalk from "chalk";
import { RequestType, ResponseType } from "./types.js";
import { addFunko, AddFunkoArgs } from "./commands/add.js";
import { listFunkos, ListFunkoArgs } from "./commands/list.js";
import { readFunko, ReadFunkoArgs } from "./commands/read.js";
import { updateFunko, UpdateFunkoArgs } from "./commands/update.js";
import { deleteFunko, RemoveFunkoArgs } from "./commands/remove.js";

const server = net.createServer((connection) => {
  console.log(chalk.green("Cliente conectado."));

  connection.on("data", (data) => {
    const request: RequestType = JSON.parse(data.toString());
    console.log(chalk.blue(`Solicitud recibida: ${JSON.stringify(request)}`));

    let response: ResponseType = { type: request.type, success: false };

    try {
      switch (request.type) {
        case "add": {
          const funkoData = request.funkoPop![0];
          const args: AddFunkoArgs = {
            id: funkoData.id,
            user: request.user,
            name: funkoData.name,
            description: funkoData.description,
            type: funkoData.type,
            genre: funkoData.genre,
            franchise: funkoData.franchise,
            number: funkoData.number,
            exclusive: funkoData.exclusive,
            specialFeatures: funkoData.specialFeatures,
            marketValue: funkoData.marketValue,
          };
          const success = addFunko(args);
          response = {
            type: "add",
            success,
            message: success
              ? chalk.green(`Funko con ID ${args.id} añadido correctamente.`)
              : chalk.red(`Funko con ID ${args.id} ya existe.`),
          };
          break;
        }

        case "list": {
          const listArgs: ListFunkoArgs = { user: request.user } as ListFunkoArgs;
          const result = listFunkos(listArgs);
          response = {
            type: "list",
            success: !result.includes("No se encontró"),
            message: result,
          };
          break;
        }

        case "read": {
          const funkoData = request.funkoPop![0];
          const readArgs: ReadFunkoArgs = { user: request.user, id: funkoData.id };
          const funko = readFunko(readArgs);
          response = {
            type: "read",
            success: !!funko,
            funkoPops: funko ? [funko] : [],
            message: funko
              ? chalk.green(`Funko encontrado: ${funko.name}`)
              : chalk.red("Funko no encontrado."),
          };
          break;
        }

        case "remove": {
          const funkoData = request.funkoPop![0];
          const removeArgs: RemoveFunkoArgs = { user: request.user, id: funkoData.id };
          const success = deleteFunko(removeArgs);
          response = {
            type: "remove",
            success,
            message: success
              ? chalk.green(`Funko con ID ${funkoData.id} eliminado correctamente.`)
              : chalk.red(`Funko con ID ${funkoData.id} no encontrado.`),
          };
          break;
        }

        case "update": {
          const funkoData = request.funkoPop![0];
          const updateArgs: UpdateFunkoArgs = {
            id: funkoData.id,
            user: request.user,
            name: funkoData.name,
            description: funkoData.description,
            type: funkoData.type,
            genre: funkoData.genre,
            franchise: funkoData.franchise,
            number: funkoData.number,
            exclusive: funkoData.exclusive,
            specialFeatures: funkoData.specialFeatures,
            marketValue: funkoData.marketValue,
          };
          const success = updateFunko(updateArgs);
          response = {
            type: "update",
            success,
            message: success
              ? chalk.green(`Funko con ID ${funkoData.id} actualizado correctamente.`)
              : chalk.red(`No se pudo actualizar el Funko con ID ${funkoData.id}.`),
          };
          break;
        }

        default:
          response = {
            type: request.type,
            success: false,
            message: chalk.red("Tipo de solicitud no válido."),
          };
          break;
      }
    } catch (err: any) {
      response = {
        type: request.type,
        success: false,
        message: chalk.red(`Error: ${err.message}`),
      };
    }

    // Enviar la respuesta al cliente y cerrar la conexión
    connection.write(JSON.stringify(response));
    connection.end();
    console.log(chalk.green("Respuesta enviada al cliente."));
  });

  connection.on("end", () => {
    console.log(chalk.yellow("Cliente desconectado."));
  });

  connection.on("error", (err) => {
    console.error(chalk.red("Error en la conexión:"), err.message);
  });
});

server.listen(3000, () => {
  console.log(chalk.blue("Servidor escuchando en el puerto 3000."));
});
