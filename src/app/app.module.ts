import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ProbesPage } from '../pages/probes/probes';
import { TabsPage } from '../pages/tabs/tabs';
import { ConfigPage } from '../pages/config/config';
import { ToolsPage } from '../pages/tools/tools';
import { GraphPage } from '../pages/tools/graph/graph';
import { TimerPage } from '../pages/tools/timer/timer';
import { ChartModule } from 'angular2-highcharts';

@NgModule({
  declarations: [
    MyApp,
    ProbesPage,
    TabsPage,
    ConfigPage,
    ToolsPage,
    GraphPage,
    TimerPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ChartModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProbesPage,
    TabsPage,
    ConfigPage,
    ToolsPage,
    GraphPage,
    TimerPage
  ],
  providers: [
      {
        provide: ErrorHandler, useClass: IonicErrorHandler
      }
    ]
  })
export class AppModule {}
