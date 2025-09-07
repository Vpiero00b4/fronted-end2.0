import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CrudService } from '../../shared/services/crud.service';
import { Kardex, Libro, LibroInventarioDto, LibroRequest, Precio } from '../../../models/libro-request.models';
import { LibroResponse } from '../../../models/libro-response.models';
import { UrlConstants } from '../../../constans/url.constans';
import { KardexResponse } from '../../../models/kardex-response.models';
import { PrecioResponse } from '../../../models/precio-response.models';
import { SucursalResponse } from '../../../models/sucursal-response.models';
import { ProveedorResponse } from '../../../models/proveedor-response.models';
import { PaginatedResponse } from '../../../models/PaginatedResponse';
import { kardex } from '../../../models/kardex.models';


@Injectable({
  providedIn: 'root'
})
export class LibroService extends CrudService<LibroRequest, LibroResponse> {
  constructor(protected http: HttpClient) {
    super(http, UrlConstants.libro);
  }

  getAllLibros(): Observable<LibroResponse[]> {
    return this.http.get<LibroResponse[]>(`${this.url_service}`);
  }

  getLibroById(id: number): Observable<LibroResponse> {
    return this.http.get<LibroResponse>(`${this.url_service}/${id}`);
  }

  getKardexByLibroId(libroId: number): Observable<KardexResponse> {
    return this.http.get<KardexResponse>(`${UrlConstants.kardex}/${libroId}`);
  }

  // buscarAutorPorNombre(nombre: string): Observable<AutorRequest> {
  //   return this.http.get<AutorRequest>(`https://localhost:7143/Autor/GetByName?nombre=${nombre}`);
  // }

  createLibro(formData: FormData, precioVenta: number, stock: number): Observable<any> {
    const url = `${this.url_service}/createDetalleLibro?precioVenta=${precioVenta}&stock=${stock}`;
    return this.http.post(url, formData);
  }



  updateLibro(formData: FormData, precioVenta: number, stock: number): Observable<any> {
    // Realizar la petición PUT al backend, pasando los parámetros precioVenta y stock en la URL
    return this.http.put(`${this.url_service}/detalles?precioVenta=${precioVenta}&stock=${stock}`, formData);
  }

  getPaginatedLibros(page: number, pageSize: number): Observable<Libro[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(this.url_service + "/Paginator", { params }).pipe(
      map(response => response.libros)
    );
  }
  getByProveedor(idProveedor: number, pageIndex: number, pageSize: number): Observable<PaginatedResponse<LibroResponse>> {
    const url = `${UrlConstants.libro}/proveedor/${idProveedor}?pagina=${pageIndex}&cantidad=${pageSize}`;
    return this.http.get<PaginatedResponse<LibroResponse>>(url);
  }

  filtrarLibros(
    estado?: boolean,
    titulo?: string,
    idCategoria?: number,
    idSubcategoria?: number,
    page: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    let params: any = { page, pageSize };

    if (estado !== undefined) {
      params.estado = estado;
    }
    if (titulo) {
      params.titulo = titulo;
    }
    if (idCategoria) {
      params.idCategoria = idCategoria;
    }
    if (idSubcategoria) {
      params.idSubcategoria = idSubcategoria;
    }

    return this.http.get<any>(`${this.url_service}/filtrar`, { params });
  }

  filtrarLibrosProveedor(idProveedor?: number, titulo?: string, page: number = 1, pageSize: number = 10): Observable<{ libros: LibroInventarioDto[], totalItems: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (idProveedor) params = params.set('idProveedor', idProveedor.toString());
    if (titulo) params = params.set('titulo', titulo);

    return this.http.get<{ libros: LibroInventarioDto[], totalItems: number }>(`${UrlConstants.libro}/Filtro/Proveedor`, { params });
  }

  updateestado(id: number) {
    return this.http.put(`${this.url_service}/cambiar-estado/${id}`, id)
  }

  getPrecioById(id: number): Observable<Precio> {
    return this.http.get<Precio>(`${this.url_service}/${id}`);
  }
  getStockById(id: number): Observable<Kardex> {
    return this.http.get<Kardex>(`${this.url_service}/kardex/${id}`);
  }
  cargarExcelLibros(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivoExcel', file, file.name);
    return this.http.post(`${this.url_service}/cargar-excel-libros`, formData);
  }
  getUltimoPrecioByLibroId(idLibro: number): Observable<Precio | null> {
    return this.http.get<Precio[]>(`https://libsaber-h6befwejedhaakb9.canadacentral-01.azurewebsites.net/Libro/precios/${idLibro}`).pipe(
      map(precios => precios.length > 0 ? precios[0] : null)
    );
  }

  getSucursalByLibroId(libroId: number): Observable<SucursalResponse[]> {
    return this.http.get<SucursalResponse[]>(`${UrlConstants.sucursal}/libro/${libroId}`);
  }

  getProveedorByLibroId(libroId: number): Observable<ProveedorResponse[]> {
    return this.http.get<ProveedorResponse[]>(`${UrlConstants.proveedor}/libro/${libroId}`);
  }

  getStockByLibroId(libroId: number): Observable<number> {
    return this.http.get<number>(`${UrlConstants.stock}/${libroId}`);
  }

  getLibrosPaginated(page: number, pageSize: number): Observable<PaginatedResponse<LibroResponse>> {
    const url = `${UrlConstants.api}/Libro/Paginator?page=${page}&pageSize=${pageSize}`;
    return this.http.get<PaginatedResponse<LibroResponse>>(url);
  }
  getAllPaginated(pageIndex: number, pageSize: number): Observable<PaginatedResponse<LibroResponse>> {
    // Usar `UrlConstants.libro` que ya tiene la base correcta y no `UrlConstants.api`
    const url = `${UrlConstants.libro}/Paginator?page=${pageIndex}&pageSize=${pageSize}`;
    return this.http.get<PaginatedResponse<LibroResponse>>(url);
  }

  createFormData(libroData: FormData): Observable<LibroResponse> {
    return this.http.post<LibroResponse>(this.url_service, libroData);
  }
  crearLibro(formData: FormData): Observable<LibroResponse> {
    return this.http.post<LibroResponse>(this.url_service, formData);
  }
  buscarLibros(titulo: string): Observable<Libro[]> {
    const url = `${this.url_service}/filtroComplete?titulo=${encodeURIComponent(titulo)}`;
    return this.http.get<Libro[]>(url);
  }

}
