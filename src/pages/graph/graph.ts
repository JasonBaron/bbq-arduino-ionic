import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Store } from '@ngrx/store';
import * as Highcharts from 'highcharts';
import { MqttService, MqttMessage } from 'angular2-mqtt';
import AppState from '../../interfaces';
import { Observable } from 'rxjs/Observable';

//TODO: change to receive topic
const IN_TOPIC: string = 'sensor';

@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html'
})
export class GraphPage {

  public chart: any;
  public options: Object;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _mqtt: MqttService,
    private _store: Store<AppState>
  ) {
    this._store.select('state').subscribe(
      (state$: Observable<AppState>) => {
        state$['status'] === false && this.chart.series[0].setData([]);
      }
    );
    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });
    this.options = {
      title: { text: 'BBQ Temperatures' },
      series: [{
        name: 'Grill Sensor',
        data: []
      }],
      xAxis: {
        title: {
          text: 'Time'
        },
        type: 'datetime',
        labels: {
          format: "{value:%I:%M:%S %P}",
          rotation: 45
        }
      },
      yAxis: {
        title: {
          text: 'Temperature'
        },
        labels: {
          format: "{value}\u00B0F"
        },
        //TODO: change these before deploy
        minTickInterval: 10,
        maxTickInterval: 50,
        min: 80,
        max: 300
      },
      tooltip: {
        pointFormat: "{point.y}\u00B0F",
        xDateFormat: "%A, %b %e, %I:%M:%S %P"
      }
    };
  }

  /**
   * Highcharts needs this to load the chart
   * @param chart
   */
  saveChart(chart) {
    this.chart = chart;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraphPage');
    this._mqtt.observe(IN_TOPIC).subscribe(
      (msg: MqttMessage) => {
        try {
          let jsonMsg: Object = JSON.parse(msg.payload.toString());
          if (jsonMsg.hasOwnProperty('grillTempRecorded') && jsonMsg.hasOwnProperty('timeRecorded')) {
            if ((jsonMsg['timeRecorded'] * 1000) > (Date.now() - 86400000)) {
              if (this.chart.series[0].data.length === 30) {
                this.chart.series[0].addPoint([
                  jsonMsg['timeRecorded'] * 1000,
                  jsonMsg['grillTempRecorded']
                ], true, true);
              } else {
                this.chart.series[0].addPoint([
                  jsonMsg['timeRecorded'] * 1000,
                  jsonMsg['grillTempRecorded']
                ]);
              }
            }
          }
        } catch (e) {
          console.warn(e);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ionViewDidEnter(): void {
    console.log('ionViewDidEnter GraphPage');
  }
}
