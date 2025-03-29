import { Funko } from "./models/funko.js";

export type RequestType = {
  type: "add" | "update" | "remove" | "read" | "list";
  user: string; // ✅ Agregado para evitar errores
  funkoPop?: Funko[];
};

export type ResponseType = {
  type: "add" | "update" | "remove" | "read" | "list";
  success: boolean;
  funkoPops?: Funko[];
  message?: string; // ✅ Ahora permite mensajes de error o éxito
};
