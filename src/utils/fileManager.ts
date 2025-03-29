import fs from "fs";
import path from "path";
import { Funko } from "../models/funko.js";
import { fileURLToPath } from "url";

/**
 * Clase que se encarga de la gestión de archivos.
 */
export class FileManager {
  /**
   * Obtiene la ruta de la carpeta de un usuario.
   *
   * @param user - Nombre del usuario.
   * @returns Ruta de la carpeta del usuario.
   */
  private static getUserFolder(user: string): string {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    return path.join(__dirname, "../../data", user);
  }

  /**
   * Guarda un Funko en un archivo JSON de forma asíncrona.
   *
   * @param user - Nombre del usuario.
   * @param funko - Objeto Funko a guardar.
   * @param callback - Función callback para manejar el resultado.
   */
  static saveFunko(user: string, funko: Funko, callback: (err: NodeJS.ErrnoException | null) => void): void {
    const userFolder = this.getUserFolder(user);
    fs.mkdir(userFolder, { recursive: true }, (err) => {
      if (err) return callback(err);

      const filePath = path.join(userFolder, `${funko.id}.json`);
      fs.writeFile(filePath, JSON.stringify(funko, null, 2), (err) => {
        callback(err);
      });
    });
  }

  /**
   * Carga un Funko desde un archivo JSON de forma asíncrona.
   *
   * @param user - Nombre del usuario.
   * @param id - ID del Funko a cargar.
   * @param callback - Función callback para manejar el resultado.
   */
  static loadFunko(user: string, id: number, callback: (err: NodeJS.ErrnoException | null, funko: Funko | null) => void): void {
    const filePath = path.join(this.getUserFolder(user), `${id}.json`);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") return callback(null, null); // Archivo no encontrado
        return callback(err, null);
      }

      try {
        const funko = JSON.parse(data) as Funko;
        callback(null, funko);
      } catch (parseErr) {
        callback(parseErr, null);
      }
    });
  }
}
