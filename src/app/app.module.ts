import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// components
import { ListComponent } from './component/list/list.component';
import { MapComponent } from './component/map/map.component';

// service
import { AppService } from './app.service';

// cdk
import { ScrollingModule } from '@angular/cdk/scrolling';

// ng-zorro module
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

registerLocaleData(zh);

const ZORRO_MODULES = [
  NzListModule,
  NzGridModule,
  NzButtonModule,
  NzUploadModule
];

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ScrollingModule,
    ...ZORRO_MODULES,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [AppService, { provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
