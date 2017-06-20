import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { compose } from '@ngrx/core/compose';
import { StoreModule, combineReducers } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StorageSyncEffects, storageSync } from 'ngrx-store-ionic-storage';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { stateReducer, initialState } from '../reducers';

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

export const reducers = {
  state: stateReducer
}

export const storageSyncReducer = storageSync({
  keys: ['state'],
  ignoreActions: [
    'SET_GRILL_MEAT_CURRENT_TEMPERATURE',
    'SET_GRILL_CONFIG',
    'SET_MEAT_CONFIG',
    'SET_TIME_TO_CHECK'
  ],
  hydratedStateKey: 'hydrated',
  onSyncError: err => console.error(err)
});

export const appReducer = compose(storageSyncReducer, combineReducers)(reducers);

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
    StoreModule.provideStore(appReducer, initialState),
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 5
    }),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'websql', 'localstorage']
    }),
    EffectsModule.run(StorageSyncEffects),
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
