import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {Marker} from '../../app.type';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  data: Marker[] = [];

  constructor(private srv: AppService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.srv.clearList$.subscribe(() => {
      this.data = [];
      this.cdr.detectChanges();
    });
  }

  getRandom(range: number): number {
    const random = Math.random();
    const k = random < 0.5 ? -1 : 1;
    return Number((Math.random() * range * k).toFixed(3));
  }

  getMarker(): void {
    // Change the length to see how draw polygon
    this.data = Array.from({length: 500}).map((_, i) => {
      return {
        id: i,
        name: `Item${i}`,
        lng: this.getRandom(180),
        lat: this.getRandom(85) // WGS84
      };
    });

    this.srv.createMarkers$.next(this.data);
  }

  trigger(item: Marker): void {
    this.srv.itemTrigger$.next(item);
  }
}
