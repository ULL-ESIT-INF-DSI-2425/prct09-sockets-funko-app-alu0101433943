import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";
import { addFunko, listFunkos, getUserFolder } from "../src/funko-app";
import { FunkoType, FunkoGenre } from "../src/models/funko";
import { readFunko } from "../src/commands/read";
import { updateFunko } from "../src/commands/update";
import { deleteFunko } from "../src/commands/remove";
import fs from "fs";
import chalk from "chalk";

describe("addFunko", () => {
  let funko2;
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log");

    funko2 = {
      id: 1,
      user: "testUser",
      name: "Spiderman",
      type: FunkoType.POP,
      genre: FunkoGenre.HEROES,
      description: "A Spiderman Funko Pop",
      franchise: "Marvel",
      number: 1,
      exclusive: false,
      specialFeatures: "None",
      marketValue: 10,
    };
  });

  afterEach(() => {
    consoleSpy.mockRestore();

    const userFolder = getUserFolder("testUser");
    if (fs.existsSync(userFolder)) {
      fs.rmSync(userFolder, { recursive: true });
    }
  });

  test("Debe añadir funko a la carpeta data", () => {
    addFunko(funko2);
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.green(`Nuevo Funko agregado a la colección de ${funko2.user}!`),
    );
  });

  test("Debe mostrar error porque ya existe ese ID", () => {
    addFunko(funko2);
    addFunko(funko2);

    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red(
        `Funko con ID ${funko2.id} ya existe en la colección de ${funko2.user}!`,
      ),
    );
  });

  test("Debe mostrar error porque el valor de mercado es negativo", () => {
    funko2.marketValue = -10;
    addFunko(funko2);

    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red("El valor de mercado debe ser un número positivo."),
    );
  });

  test("Debe mostrar error porque el tipo de funko no es correcto", () => {
    funko2.type = "TIPO_INVALIDO";
    addFunko(funko2);

    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red(`Tipo de Funko inválido: ${funko2.type}`),
    );
  });

  test("Debe mostrar error porque el genero de funko no es correcto", () => {
    funko2.genre = "GENERO_INVALIDO";
    addFunko(funko2);

    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red(`Género de Funko inválido: ${funko2.genre}`),
    );
  });

  test("Debe listar los funkos de un usuario", () => {
    addFunko(funko2);
    listFunkos({ user: "testUser" });

    const allConsoleOutput = consoleSpy.mock.calls.flat().join(" ");
    expect(allConsoleOutput).toContain(funko2.name);
  });

  test("Debe mostrar mensaje de error si no se encuentra el usuario al intentar listar funkos", () => {
    listFunkos({ user: "testUser" });
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red("Error: No se encontró la colección de testUser."),
    );
  });

  test("Debe mostrar mensaje de error si no se encuentra el ID de un funko en la colección de un usuario existente", () => {
    addFunko(funko2);
    readFunko({ id: 2, user: "testUser" });
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red(
        "Error: No se encontró un Funko con ID 2 en la colección de testUser.",
      ),
    );
  });

  test("Debe mostrar el Funko indicado por su ID", () => {
    addFunko(funko2);
    readFunko({ id: 1, user: "testUser" });
    const allConsoleOutput = consoleSpy.mock.calls.flat().join(" ");
    expect(allConsoleOutput).toContain(funko2.name);
  });

  test("Debe modificar el valor del funko previamente añadido", () => {
    addFunko(funko2);
    updateFunko({
      id: 1,
      user: "testUser",
      name: "Nuevo nombre",
      description: funko2.description,
      type: funko2.type,
      genre: funko2.genre,
      franchise: "SA",
      number: 2000,
      exclusive: funko2.exclusive,
      specialFeatures: funko2.specialFeatures,
      marketValue: 1000000,
    });
    readFunko({ id: 1, user: "testUser" });
    const allConsoleOutput = consoleSpy.mock.calls.flat().join(" ");
    expect(allConsoleOutput).toContain("Nuevo nombre");
  });

  test("Debe mostrar error al intentar modificar un funko introduciendo un ID que no se corresponde a un funko de la colección", () => {
    updateFunko({
      id: 1,
      user: "testUser",
      name: "Nuevo nombre",
      description: funko2.description,
      type: funko2.type,
      genre: funko2.genre,
      franchise: funko2.franchise,
      number: funko2.number,
      exclusive: funko2.exclusive,
      specialFeatures: funko2.specialFeatures,
      marketValue: funko2.marketValue,
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red(
        "Error: No se encontró un Funko con ID 1 en la lista de testUser.",
      ),
    );
  });

  test("Debe mostrar error al intentar modificar un funko con un género inválido", () => {
    addFunko(funko2);
    updateFunko({
      id: 1,
      user: "testUser",
      name: "Nuevo nombre",
      description: funko2.description,
      type: funko2.type,
      genre: "Género inválido",
      franchise: funko2.franchise,
      number: funko2.number,
      exclusive: funko2.exclusive,
      specialFeatures: funko2.specialFeatures,
      marketValue: funko2.marketValue,
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red(`Género de Funko inválido: Género inválido`),
    );
  });

  test("Debe mostrar error al intentar modificar un funko con un tipo inválido", () => {
    addFunko(funko2);
    updateFunko({
      id: 1,
      user: "testUser",
      name: "Nuevo nombre",
      description: funko2.description,
      type: "Tipo inválido",
      genre: funko2.genre,
      franchise: funko2.franchise,
      number: funko2.number,
      exclusive: funko2.exclusive,
      specialFeatures: funko2.specialFeatures,
      marketValue: funko2.marketValue,
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red(`Tipo de Funko inválido: Tipo inválido`),
    );
  });

  test("Debe borrar el funko previamente añadido", () => {
    addFunko(funko2);
    updateFunko({
      id: 1,
      user: "testUser",
      name: "Nuevo nombre",
      description: funko2.description,
      type: funko2.type,
      genre: funko2.genre,
      franchise: "SA",
      number: 2000,
      exclusive: funko2.exclusive,
      specialFeatures: funko2.specialFeatures,
      marketValue: 1000000,
    });
    readFunko({ id: 1, user: "testUser" });
    const allConsoleOutput = consoleSpy.mock.calls.flat().join(" ");
    expect(allConsoleOutput).toContain("Nuevo nombre");
    deleteFunko({ user: "testUser", id: 1 });
    consoleSpy.mockRestore();
    readFunko({ id: 1, user: "testUser" });
    const allConsoleOutput2 = consoleSpy.mock.calls.flat().join(" ");
    expect(allConsoleOutput2).not.toContain("1");
  });

  test("Debe mostrar error al intentar eliminar un funko en una colección vacía", () => {
    deleteFunko({ user: "testUser", id: 1 });
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red('Error: El usuario "testUser" no tiene Funkos almacenados.'),
    );
  });

  test("Debe mostrar error al intentar eliminar un funko con un ID negativo", () => {
    deleteFunko({ user: "testUser", id: -1 });
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red("Error: El ID del Funko debe ser un número positivo."),
    );
  });

  test("Debe mostrar error al intentar eliminar un funko con un ID que no existe en una colección que no está vacía", () => {
    addFunko(funko2);
    deleteFunko({ user: "testUser", id: 2 });
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red(
        "Error: No se encontró un Funko con ID 2 en la colección de testUser.",
      ),
    );
  });
});
