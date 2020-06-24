import { Palabra } from "./palabra";

export class Pin {
    _id: string;
    numero: Number;
    descripcion: string;
    palabraUno: Palabra;
    palabraDos: Palabra;
    palabraTres: Palabra;
    pin: any;
}