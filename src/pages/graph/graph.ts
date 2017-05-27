import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as Highcharts from 'highcharts';
import { MqttService, MqttMessage } from 'angular2-mqtt';
import { Storage } from '@ionic/storage';

const TOPIC: string = 'test';

interface Config {
  desiredTemperature: number;
  currentTemperature: number;
  hideProgressbar: boolean;
}

interface State {
  timeToCheck: number;
  grill: Config;
  meat: Config;
  status: boolean;
}

@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html'
})
export class GraphPage {
  public chart: any;
  private options: Object;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mqtt: MqttService,
    public storage: Storage) {
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
        minTickInterval: 1,
        maxTickInterval: 5,
        min: 80,
        max: 90
      },
      tooltip: {
        pointFormat: "{point.y}\u00B0F",
        xDateFormat: "%A, %b %e, %I:%M:%S %P"
      }
    };
  }

  getState(): void {
    this.storage.get('app_state').then(
      (state: State) => {
        if (state.status === false) {
          this.chart.series[0].setData([]);
        }
      }
    );
  }

  public saveChart(chart) {
    this.chart = chart;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraphPage');
    this.mqtt.observe(TOPIC).subscribe(
      (msg: MqttMessage) => {
        try {
          if (msg.topic === TOPIC) {
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
    this.getState();
  }
}
