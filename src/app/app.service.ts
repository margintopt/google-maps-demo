import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Marker} from './app.type';

@Injectable()
export class AppService {
  createMarkers$ = new Subject<Marker[]>();
  itemTrigger$ = new Subject<Marker>();
  clearList$ = new Subject();

  constructor(
  ) { }
}
