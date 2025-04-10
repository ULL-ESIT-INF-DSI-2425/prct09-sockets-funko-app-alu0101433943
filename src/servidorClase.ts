import net from "net";
import { createReadStream } from 'fs';
import { access, constants } from 'node:fs';
//resolve
//stream de lectura con el fiichero (si existe, comprueba access) en servidor (eventemitter)
// a meddida que hay datos en el stream de lectura, lo escribo en el socket
//s escr en cliente

const server = net.createServer((connection) => {
  console.log("Cliente conectado");

  connection.on('data', (fileName) => {
    console.log(`Recibido ${fileName}`);
    access(fileName, constants.F_OK, (err) => {
      if (err) {
        connection.write(`ERROR: No existe el archivo ${fileName}.`);
      } else {
        console.log(`${fileName} existe`);
        const inputStream = createReadStream(fileName);
        inputStream.on('data', (piece) => {
          connection.write(piece);
        });
      
        inputStream.on('close', () => {
            connection.end();
        });

        inputStream.on('error', (err) => {
          connection.write(err.message);
        });
      }
    })
  });

  connection.on("end", () => {
    console.log("Cliente desconectado.");
  });

  connection.on("error", () => {
    console.error("Error en la conexión:");
  });
});

server.listen(3500, () => {
  console.log("Servidor escuchando en el puerto 3500.");
});