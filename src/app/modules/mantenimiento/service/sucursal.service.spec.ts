import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SucursalService } from './sucursal.service';

describe('GeneroService', () => {
  let service: SucursalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SucursalService]
    });
    service = TestBed.inject(SucursalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Aquí puedes agregar más pruebas unitarias según las funcionalidades de tu servicio
});
