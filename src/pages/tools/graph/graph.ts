import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import * as Highcharts from 'highcharts';
import { MqttService, MqttMessage } from 'angular2-mqtt';

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
    public toastCtrl: ToastController,
    public mqtt: MqttService) {
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

  public saveChart(chart) {
    this.chart = chart;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraphPage');
    this.mqtt.observe('test').subscribe(
      (msg: MqttMessage) => {
        try {
          if (msg.topic === 'test') {
            let jsonMsg: Object = JSON.parse(msg.payload.toString());
            if (jsonMsg.hasOwnProperty('temp') && jsonMsg.hasOwnProperty('time')) {
              if (this.chart.series[0].data.length === 30) {
                this.chart.series[0].addPoint([
                  jsonMsg['time'],
                  jsonMsg['temp']
                ], true, true);
              } else {
                this.chart.series[0].addPoint([
                  jsonMsg['time'],
                  jsonMsg['temp']
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
}
