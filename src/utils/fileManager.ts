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
   * Guarda un Funko en un archivo JSON.
   *
   * @param user - Nombre del usuario.
   * @param funko - Objeto Funko a guardar.
   */
  static saveFunko(user: string, funko: Funko): void {
    const userFolder = this.getUserFolder(user);
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    const filePath = path.join(userFolder, `${funko.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(funko, null, 2));
  }

  /**
   * Carga un Funko desde un archivo JSON.
   *
   * @param user - Nombre del usuario.
   * @param id - ID del Funko a cargar.
   * @returns Objeto Funko cargado desde el archivo o null si no
   * existe el archivo.
   */
  static loadFunko(user: string, id: number): Funko | null {
    const filePath = path.join(this.getUserFolder(user), `${id}.json`);
    if (!fs.existsSync(filePath)) return null;

    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
}
