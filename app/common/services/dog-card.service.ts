import { Injectable } from '@angular/core';
@Injectable()
export class DogCardService {
  public open: boolean;
  public timesOpened: number = 0;
  constructor() {}
}