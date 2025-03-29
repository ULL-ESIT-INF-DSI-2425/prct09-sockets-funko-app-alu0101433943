import net from "net";
import chalk from "chalk";
import { fork } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { RequestType, ResponseType } from "./types.js";

// Obtener la ruta actual en un entorno de módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = net.createServer((connection) => {
  console.log(chalk.green("Cliente conectado."));

  connection.on("data", (data) => {
    const request: RequestType = JSON.parse(data.toString());
    console.log(chalk.blue(`Solicitud recibida: ${JSON.stringify(request)}`));

    // Obtener la ruta absoluta del archivo `processRequest.js`
    const processPath = path.join(__dirname, "processRequest.js");

    // Crear un proceso hijo para manejar la solicitud
    const child = fork(processPath);

    // Enviar la solicitud al proceso hijo
    child.send(request);

    // Recibir la respuesta del proceso hijo
    child.on("message", (response: ResponseType) => {
      connection.write(JSON.stringify(response));
      connection.end();
      console.log(chalk.green("Respuesta enviada al cliente."));
    });

    // Manejo de errores en el proceso hijo
    child.on("error", (err) => {
      console.error(chalk.red("Error en el proceso hijo:"), err.message);
      const errorResponse: ResponseType = {
        type: request.type,
        success: false,
        message: `Error interno: ${err.message}`,
      };
      connection.write(JSON.stringify(errorResponse));
      connection.end();
    });

    // Manejo de cierre inesperado del proceso hijo
    child.on("exit", (code) => {
      if (code !== 0) {
        console.error(chalk.red(`Proceso hijo finalizado con código ${code}`));
        const exitResponse: ResponseType = {
          type: request.type,
          success: false,
          message: `El proceso hijo terminó inesperadamente con código ${code}.`,
        };
        connection.write(JSON.stringify(exitResponse));
        connection.end();
      }
    });

    connection.on("end", () => {
      console.log(chalk.yellow("Cliente desconectado."));
    });
  });
});

server.listen(3000, () => {
  console.log(chalk.blue("Servidor escuchando en el puerto 3000."));
});
