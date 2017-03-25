import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { ProbesPage } from '../pages/probes/probes';
import { GrillConfigPage } from '../pages/probes/grill-config/grill-config';
import { MeatConfigPage } from '../pages/probes/meat-config/meat-config';
import { GraphPage } from '../pages/graph/graph';

import { ChartModule } from 'angular2-highcharts';
import { ProgressbarModule } from 'ng2-bootstrap';
import { MqttModule, MqttService } from 'angular2-mqtt';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
    GraphPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['localstorage', 'indexeddb', 'websql']
    }),
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
    GraphPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
      {
        provide: ErrorHandler, useClass: IonicErrorHandler
      }
    ]
  })
export class AppModule {}
