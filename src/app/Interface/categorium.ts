import { Libro } from "./libro";

export interface Categorium {
    IdCategoria: number;
    NombreCategoria?: string | null;
    Libros?: Libro[] | null;
}
