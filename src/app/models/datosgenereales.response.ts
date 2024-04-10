export class DatosGenerales {
    idDatosGenerales: number = 0;
    ruc: string = "";
    telefonoContacto: string = "";
    razonSocial: string = "";
    direccion: string = ""; // Dirección física de la empresa
    emailContacto: string = ""; // Correo electrónico de contacto
    paginaWeb: string = ""; // Sitio web de la empresa
    logoUrl: string = ""; // URL al logo de la empresa para incluir en comprobantes
  
    // Constructor opcional para inicializar los datos fácilmente
    constructor(
      idDatosGenerales?: number,
      ruc?: string,
      telefonoContacto?: string,
      razonSocial?: string,
      direccion?: string,
      emailContacto?: string,
      paginaWeb?: string,
      logoUrl?: string
    ) {
      if (idDatosGenerales) this.idDatosGenerales = idDatosGenerales;
      if (ruc) this.ruc = ruc;
      if (telefonoContacto) this.telefonoContacto = telefonoContacto;
      if (razonSocial) this.razonSocial = razonSocial;
      if (direccion) this.direccion = direccion;
      if (emailContacto) this.emailContacto = emailContacto;
      if (paginaWeb) this.paginaWeb = paginaWeb;
      if (logoUrl) this.logoUrl = logoUrl;
    }
  }
  