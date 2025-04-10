import net from 'net';
import { createWriteStream } from 'fs';

const client = net.connect({port: 3500}, () => {
  if (process.argv.length !== 4) {
    console.log("Proporciona el nombre del fichero");
  } else {
    const fileName = process.argv[2];
    const fileName2 = process.argv[3];
    client.write(fileName);

    client.on("data", (data) => {
      if (data.toString().includes(`ERROR: No existe el archivo ${fileName}.`)) {
        console.log(data.toString());
        client.end();
      } else {
        const inputStream = createWriteStream(fileName2);
        inputStream.write(data.toString());
      }
    });

    client.on('end', () => {
      console.log("Fin");
    })
  }
});