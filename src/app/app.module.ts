import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { ProbesPage } from '../pages/probes/probes';
import { TabsPage } from '../pages/tabs/tabs';
import { GrillConfigPage } from '../pages/probes/grill-config/grill-config';
import { ToolsPage } from '../pages/tools/tools';
import { GraphPage } from '../pages/tools/graph/graph';
import { ChartModule } from 'angular2-highcharts';
import { ProgressbarModule } from 'ng2-bootstrap';
import { MqttModule, MqttService } from 'angular2-mqtt';
import { MeatConfigPage } from '../pages/probes/meat-config/meat-config';

export function provideStorage() {
  return new Storage(['localstorage', 'indexeddb', 'websql'], { name: '__mydb' });
}

export function mqttServiceFactory() {
  return new MqttService({
    hostname: 'm13.cloudmqtt.com',
    port: 37347,
    protocol: 'wss',
    clientId: "client-" + Date.now(),
    username: 'app',
    password: 'jrSwHCU5b588'
  });
}

@NgModule({
  declarations: [
    MyApp,
    ProbesPage,
    TabsPage,
    GrillConfigPage,
    MeatConfigPage,
    ToolsPage,
    GraphPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ChartModule,
    ProgressbarModule.forRoot(),
    MqttModule.forRoot({
      provide: MqttService,
      useFactory: mqttServiceFactory
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProbesPage,
    TabsPage,
    GrillConfigPage,
    MeatConfigPage,
    ToolsPage,
    GraphPage
  ],
  providers: [
      {
        provide: ErrorHandler, useClass: IonicErrorHandler
      },
      {
        provide: Storage, useFactory: provideStorage
      }
    ]
  })
export class AppModule {}
