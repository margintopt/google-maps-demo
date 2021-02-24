import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { AppService } from '../../app.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import MarkerClusterer from '@googlemaps/markerclustererplus';
import { Marker } from '../../app.type';
import { Control } from './control';

const Default = { lat: 30.608, lng: 104.085 }; // 成都
const ZOOM = 11;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styles: [`
    #map {
      height: 100%;
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnDestroy, AfterViewInit {
  private map: google.maps.Map | undefined;
  private markerData: Marker[] | undefined;
  private markerCluster: MarkerClusterer | undefined;
  private polygon: google.maps.Polygon | undefined;
  private control: Control | undefined;
  private onDestroy$ = new Subject<void>();

  constructor(private srv: AppService) {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngAfterViewInit(): void {
    new Loader({
      apiKey: '',
      version: 'weekly',
    }).load().then(() => {
      this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: Default,
        zoom: ZOOM,
      });

      this.subscribeEvent();
    });
  }

  subscribeEvent(): void {
    this.srv.createMarkers$
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(res => {
        this.drawMarkers(res);
      });

    this.srv.itemTrigger$
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(res => {
        this.moveCenter(res);
      });

    // 鼠标右键
    const observable$ = new Observable((observer) => {
      this.map?.addListener('contextmenu', (event) => {
        observer.next();
      });
    });
    observable$
      .pipe(
        debounceTime(500),
        takeUntil(this.onDestroy$)
      )
      .subscribe((event) => {
        this.drawPolygon();
      });
  }

  // 生成Markers集群
  drawMarkers(data: Marker[]): void {
    if (!this.map) {
      return;
    }

    if (this.polygon) {
      this.polygon.setMap(null);
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
    }

    this.markerData = data;
    const markers = this.markerData.map((location, i) => {
      return new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        label: location.name,
      });
    });

    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
      this.markerCluster.addMarkers(markers, false);
      return;
    }

    this.markerCluster = new MarkerClusterer(this.map, markers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });
  }

  // 改变中心点
  moveCenter(data: Marker): void {
    if (!this.map) {
      return;
    }
    this.map.setZoom(ZOOM);
    this.map.setCenter({lat: data.lat, lng: data.lng});
  }

  // 绘制多边形
  drawPolygon(): void {
    if (!this.map || !this.markerData?.length || !this.markerCluster) {
      return;
    }

    if (this.polygon) {
      this.polygon.setMap(null);
    }

    const triangleCoords = this.sortCoordinates();
    this.polygon = new google.maps.Polygon({
      paths: triangleCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    });
    this.polygon.setMap(this.map);
    this.markerData = [];
    this.markerCluster.clearMarkers();
    this.srv.clearList$.next();

    // 生成自定义Fill控件
    const centerControlDiv = document.createElement('div');
    this.control = new Control(centerControlDiv, this.polygon);
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
  }

  // 找到中心点通过角度对坐标排序，防止相交
  sortCoordinates(): Array<{lat: number, lng: number}> {
    if (!this.markerData) {
      return [];
    }

    let lng = 0;
    let lat = 0;
    const len = this.markerData.length;

    this.markerData.forEach(marker => {
      lng += marker.lng;
      lat += marker.lat;
    });

    const center = {lat: lat / len, lng: lng / len};

    const angleArr = this.markerData.map(marker => {
      return {
        ...marker,
        angle: Math.atan2(marker.lat - center.lat, marker.lng - center.lng)
      };
    }).sort((a, b) => {
      if (a.angle > b.angle) {
        return 1;
      } else if (a.angle < b.angle) {
        return -1;
      } else {
        return 0;
      }
    });

    return this.addCoordinate(angleArr);
  }

  // 比较相邻两点间经度之和，若超过180插入一个中点，防止绘出地图
  addCoordinate(data: Array<{lat: number, lng: number, angle: number}>): Array<{lat: number, lng: number}> {
    const latLng: { lat: number; lng: number; }[] = [];
    let pre: {lat: number, lng: number};
    data.forEach(item => {
      if (pre && Math.abs(pre.lng) + Math.abs(item.lng) > 180) {
        latLng.push({lat: (item.lat + pre.lat) / 2, lng: (item.lng + pre.lng) / 2});
      }
      latLng.push({lat: item.lat, lng: item.lng});
      pre = item;
    });

    return latLng;
  }
}
