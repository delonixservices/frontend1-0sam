import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  private responseDataSubject = new BehaviorSubject<any>(null);
  responseData$ = this.responseDataSubject.asObservable();

  setResponseData(data: any) {
    this.responseDataSubject.next(data);
  }
}
