import { Injectable } from '@angular/core';
@Injectable()
export class DogCardService {
  public open: boolean;
  public width: number;
  // filled in dog-figure component;
  public patterns: string[];
  constructor() {}
}