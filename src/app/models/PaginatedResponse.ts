export class PaginatedResponse<T> {
  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 0;
  libros: T[] = []; // Inicializado como un array vacío

  constructor(init?: Partial<PaginatedResponse<T>>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}