import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import * as Highcharts from 'highcharts';

declare var Paho: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public chart: any;
  private options: Object;
  private client: any;
  public status: string;
  public stopPoll: number;

  constructor(public navCtrl: NavController) {
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
        minTickInterval: 5,
        maxTickInterval: 5,
        min: 70,
        max: 90
      },
      tooltip: {
        pointFormat: "{point.y}\u00B0F",
        xDateFormat: "%A, %b %e, %I:%M:%S %P"
      }
    };
    // this.mqtt(); //Disable for Ionic View

    // this.stopPoll = setInterval(() => { //Disable for Ionic View
    //   let jsonMessage: Object = {
    //     time: Date.now(),
    //     temp: Math.floor(Math.random()*(90-70+1)+70)
    //   }
    //   let message = new Paho.MQTT.Message(JSON.stringify(jsonMessage));
    //   message.destinationName = "test";
    //   this.client.send(message);
    // }, 1000);

    this.stopPoll = setInterval(() => { //Enable for Ionic View
      let jsonMessage: Object = {
        time: Date.now(),
        temp: Math.floor(Math.random() * (90 - 70 + 1) + 70)
      }
      if (this.chart.series[0].data.length === 15) {
        this.chart.series[0].addPoint([
          jsonMessage['time'],
          jsonMessage['temp']
        ], true, true);
      } else {
        this.chart.series[0].addPoint([
          jsonMessage['time'],
          jsonMessage['temp']
        ]);
      }
    }, 1000);
  }

  mqtt(): void {
    this.client = new Paho.MQTT.Client(
      "m13.cloudmqtt.com",
      37347,
      "client-" + Math.round(Math.random() * 1000)
    );
    this.client.onConnectionLost = (res: any) => {
      console.warn('Connection to CloudMQTT lost!');
      this.status = "DISCONNECTED";
    };
    this.client.onMessageArrived = (msg: any) => {
      try {
        if (msg.destinationName === "test") {
          let jsonMsg: Object = JSON.parse(msg.payloadString);
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
    };
    this.client.connect({
      onSuccess: () => {
        console.log('Connected to CloudMQTT broker.');
        this.status = "CONNECTED";

        // this.client.subscribe("sensor/grill");
        this.client.subscribe("test");
      },
      onFailure: () => {
        console.error('Failed to connect to CloudMQTT broker.');
        this.status = "DISCONNECTED";
      },
      userName: "app",
      password: "jrSwHCU5b588",
      useSSL: true
    });
  }

  public saveChart(chart) {
    this.chart = chart;
  }

  public stop() {
    clearInterval(this.stopPoll);
  }
}
