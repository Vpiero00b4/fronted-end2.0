import { Observable } from "rxjs";

export interface CrudInterface<T, Y>{

    getAll(): Observable<Y[]>;
    create(request: T):Observable<Y>;
    update(request: T):Observable<Y>;
    delete(id: number):Observable<number>;
}
