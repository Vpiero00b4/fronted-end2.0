export class CajaResponse {
  idCaja: number = 0;
  saldoInicial: number = 0;
  saldoFinal: number = 0;
  fecha: Date | null = null;
  ingresosACaja: number = 0;
  fechaCierre: Date | null = null;
  saldoDigital: number = 0;
}

export interface Caja{
  idCaja:number;
  saldoInicial:number;
  saldoFinal:number;
  fecha:Date;
  ingresosACaja:number;
  fechaCierre:Date;
  saldoDigital:number;
}

export interface RetiroDeCaja{
  id: number;
  descripcion: string;
  fecha: string; 
  cajaId: number;
  montoEfectivo: number;
  montoDigital: number;
}
