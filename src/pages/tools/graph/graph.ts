import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import * as Highcharts from 'highcharts';

declare var Paho: any;

@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html'
})
export class GraphPage {
  public chart: any;
  private options: Object;
  private client: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController) {
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
    this.mqtt();

    // this.stopPoll = setInterval(() => { //Disable for Ionic View
    //   let jsonMessage: Object = {
    //     time: Date.now(),
    //     temp: Math.floor(Math.random()*(90-70+1)+70)
    //   }
    //   let message = new Paho.MQTT.Message(JSON.stringify(jsonMessage));
    //   message.destinationName = "test";
    //   this.client.send(message);
    // }, 1000);

    // this.stopPoll = setInterval(() => { //Enable for Ionic View
    //   let jsonMessage: Object = {
    //     time: Date.now(),
    //     temp: Math.floor(Math.random() * (90 - 70 + 1) + 70)
    //   }
    //   if (this.chart.series[0].data.length === 15) {
    //     this.chart.series[0].addPoint([
    //       jsonMessage['time'],
    //       jsonMessage['temp']
    //     ], true, true);
    //   } else {
    //     this.chart.series[0].addPoint([
    //       jsonMessage['time'],
    //       jsonMessage['temp']
    //     ]);
    //   }
    // }, 1000);
  }

  mqtt(): void {
    this.client = new Paho.MQTT.Client(
      "m13.cloudmqtt.com",
      37347,
      "client-" + Date.now()
    );
    this.client.onConnectionLost = (res: any) => {
      console.warn('Connection to CloudMQTT lost!');
      this.toastCtrl.create({
        message: 'DISCONNECTED',
        duration: 3000
      }).present();
    };
    this.client.onMessageArrived = (msg: any) => {
      try {
        if (msg.destinationName === "test") {
          let jsonMsg: Object = JSON.parse(msg.payloadString);
          if (jsonMsg.hasOwnProperty('temp') && jsonMsg.hasOwnProperty('time')) {
            if (this.chart.series[0].data.length === 30) {
              this.chart.series[0].addPoint([
                jsonMsg['time'] * 1000,
                jsonMsg['temp']
              ], true, true);
            } else {
              this.chart.series[0].addPoint([
                jsonMsg['time'] * 1000,
                jsonMsg['temp']
              ]);
            }
          }
        }
      } catch (e) {
        console.warn(e);
      }
    };
    this.client.connect({
      onSuccess: () => {
        console.log('Connected to CloudMQTT broker.');
        this.toastCtrl.create({
          message: 'CONNECTED',
          duration: 3000
        }).present();

        // this.client.subscribe("sensor/grill");
        this.client.subscribe("test");
      },
      onFailure: () => {
        console.error('Failed to connect to CloudMQTT broker.');
        this.toastCtrl.create({
          message: 'DISCONNECTED',
          duration: 3000
        }).present();
      },
      userName: "app",
      password: "jrSwHCU5b588",
      useSSL: true
    });
  }

  public saveChart(chart) {
    this.chart = chart;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraphPage');
  }
}
