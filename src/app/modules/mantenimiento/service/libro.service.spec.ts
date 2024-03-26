import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KardexService } from './kardex.service';

describe('KardexService', () => {
  let service: KardexService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KardexService]
    });
    service = TestBed.inject(KardexService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform an example switchMap operation', () => {
    // Ejemplo de prueba para la función de switchMap
    service.ejemploSwitchMap().subscribe(result => {
      expect(result).toBeTruthy(); // Verificar que el resultado sea verdadero
    });
  });

  // Aquí puedes agregar más pruebas unitarias según las funcionalidades de tu servicio
});
