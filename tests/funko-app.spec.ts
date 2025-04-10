// tests/funko-app.spec.ts
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { RequestType, ResponseType } from "../src/types.js";
import { addFunko } from "../src/commands/add.js";
import { listFunkos } from "../src/commands/list.js";
import { readFunko } from "../src/commands/read.js";
import { updateFunko } from "../src/commands/update.js";
import { deleteFunko } from "../src/commands/remove.js";
import { Funko, FunkoGenre, FunkoType } from "../src/models/funko.js"; // Ajusta la ruta si es necesario

// Configura un directorio de datos especial para test
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDataDir = path.join(__dirname, "../src/data/testUser");

// Función auxiliar para limpiar el directorio de test
function cleanTestDir() {
  if (fs.existsSync(testDataDir)) {
    const files = fs.readdirSync(testDataDir);
    for (const file of files) {
      fs.unlinkSync(path.join(testDataDir, file));
    }
  } else {
    fs.mkdirSync(testDataDir, { recursive: true });
  }
}

beforeEach(() => {
  cleanTestDir();
});

afterEach(() => {
  cleanTestDir();
});

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Función auxiliar que simula el procesamiento de una solicitud
 * y devuelve una Promesa con la respuesta resultante.
 */
function executeCommand(request: RequestType): Promise<ResponseType> {
  return new Promise(async (resolve) => {
    let response: ResponseType = { type: request.type, success: false };
    try {
      switch (request.type) {
        case "add": {
          const funkoData = request.funkoPop![0];
          const result = addFunko({ ...funkoData, user: request.user });
          response = {
            type: "add",
            success: result,
            message: result
              ? chalk.green(`Funko con ID ${funkoData.id} añadido correctamente.`)
              : chalk.red(`Funko con ID ${funkoData.id} ya existe o datos inválidos.`),
          };
          break;
        }
        case "list": {
          const result = listFunkos({ user: request.user });
          response = {
            type: "list",
            success: !result.includes("No se encontró"),
            message: result,
          };
          break;
        }
        case "read": {
          const funkoData = request.funkoPop![0];
          const funko = readFunko({ user: request.user, id: funkoData.id });
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
        case "update": {
          const funkoData = request.funkoPop![0];
          const result = updateFunko({ ...funkoData, user: request.user });
          response = {
            type: "update",
            success: result,
            message: result
              ? chalk.green(`Funko con ID ${funkoData.id} actualizado correctamente.`)
              : chalk.red(`No se pudo actualizar el Funko con ID ${funkoData.id}.`),
          };
          break;
        }
        case "remove": {
          const funkoData = request.funkoPop![0];
          const result = deleteFunko({ user: request.user, id: funkoData.id });
          response = {
            type: "remove",
            success: result,
            message: result
              ? chalk.green(`Funko con ID ${funkoData.id} eliminado correctamente.`)
              : chalk.red(`Funko con ID ${funkoData.id} no encontrado.`),
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
    await delay(100);
    resolve(response);
  });
}

// Datos de test: usa valores válidos según tus validaciones
const validFunkoData = {
  id: 101,
  name: "Funko Test",
  description: "Descripción de prueba",
  type: FunkoType.POP,              // Por ejemplo: "Pop! Anime" (ajusta a tu definición)
  genre: FunkoGenre.ANIMATION,      // Asegúrate de que sea un valor válido
  franchise: "TestFranchise",
  number: 1,
  exclusive: false,
  specialFeatures: "",
  marketValue: 100,
};

describe("Comprobación de los comandos (servidor y cliente)", () => {
  const testUser = "testUser";

  test("Add: debe añadir un Funko correctamente", async () => {
    const request: RequestType = {
      type: "add",
      user: testUser,
      funkoPop: [validFunkoData],
    };
    const response = await executeCommand(request);
    expect(response.success).toBe(true);
    expect(response.message).toContain("añadido correctamente");
  });

  test("List: debe listar los Funkos del usuario", async () => {
    const request: RequestType = {
      type: "list",
      user: testUser,
    };
    const response = await executeCommand(request);
    expect(response.success).toBe(true);
    // Si la salida es formateada, comprueba que incluya el nombre del Funko
    expect(response.message).toContain(validFunkoData.name);
  });

  test("Read: debe leer un Funko correctamente", async () => {
    const request: RequestType = {
      type: "read",
      user: testUser,
      funkoPop: [{ ...validFunkoData }],
    };
    const response = await executeCommand(request);
    expect(response.success).toBe(true);
    expect(response.funkoPops && response.funkoPops[0].name).toBe(validFunkoData.name);
  });

  test("Update: debe actualizar un Funko correctamente", async () => {
    const updatedData = { ...validFunkoData, name: "Funko Test Actualizado", marketValue: 150 };
    const request: RequestType = {
      type: "update",
      user: testUser,
      funkoPop: [updatedData],
    };
    const response = await executeCommand(request);
    expect(response.success).toBe(true);
    expect(response.message).toContain("actualizado correctamente");
  });

  test("Remove: debe eliminar un Funko correctamente", async () => {
    const request: RequestType = {
      type: "remove",
      user: testUser,
      funkoPop: [{ ...validFunkoData }],
    };
    const response = await executeCommand(request);
    expect(response.success).toBe(true);
    expect(response.message).toContain("eliminado correctamente");
  });
});
