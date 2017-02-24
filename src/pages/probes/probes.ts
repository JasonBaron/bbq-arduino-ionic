import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GrillConfigPage } from './grill-config/grill-config';
import { MeatConfigPage } from './meat-config/meat-config';
import { MqttService, MqttMessage } from 'angular2-mqtt';

const TOPIC: string = 'test';

@Component({
  selector: 'page-probes',
  templateUrl: 'probes.html'
})
export class ProbesPage {
  public hideGrillProgressbar: boolean;
  public hideMeatProgressbar: boolean;
  public pushGrillConfigPage;
  public pushMeatConfigPage;
  public currentProbe1Temp;
  public desiredProbe1Temp;
  public currentProbe2Temp;
  public desiredProbe2Temp;
  private timeToCheckBool: boolean;
  private grillTempBool: boolean;
  private meatTempBool: boolean;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public mqtt: MqttService
  ) {
    this.pushGrillConfigPage = GrillConfigPage;
    this.pushMeatConfigPage = MeatConfigPage;
    this.hideGrillProgressbar = true;
    this.hideMeatProgressbar = true;
    this.currentProbe1Temp = 0;
    this.desiredProbe1Temp = 0;
    this.currentProbe2Temp = 0;
    this.desiredProbe2Temp = 0;
    this.timeToCheckBool = true;
    this.grillTempBool = true;
    this.meatTempBool = true;
  }

  stop() {
    let jsonMsg = JSON.stringify({
      killswitch: true,
      timeToCheck: 5
    });
    this.mqtt.publish(TOPIC, jsonMsg).subscribe((error) => {
      console.warn(error);
    });
  }

  start() {
    let timeToCheck: number;
    let grillTemp: number;
    let meatTemp: number;

    this.storage.get('grillTemp').then(
      (val) => {
        // debugger;
        if (val) {
          grillTemp = val;
        } else {
          this.grillTempBool = false;
        }
      }
    );
    console.log(this.grillTempBool);
    // this.storage.get('meatTemp').then(
    //   (val) => {
    //     meatTemp = val;
    //   },
    //   (error) => {
    //     meatTempBool = false;
    //   }
    // );

    // this.storage.get('timeToCheck').then(
    //   (val) => {
    //     timeToCheck = val;
    //   },
    //   (error) => {
    //     timeToCheckBool = false;
    //   }
    // );
    
    // if (!grillTempBool || !meatTempBool || !timeToCheckBool) {
    //   console.log("error");
    // }

    // let jsonMsg = JSON.stringify({
    //   killswitch: false,
    //   timeToCheck: 5
    // });
    // this.mqtt.publish(TOPIC, jsonMsg).subscribe((error) => {
    //   console.warn(error);
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProbesPage');
    this.storage.clear().catch((error) => {
      console.warn(error);
    });
    this.mqtt.observe(TOPIC).subscribe(
      (msg: MqttMessage) => {
        try {
          if (msg.topic === TOPIC) {
            let jsonMsg: Object = JSON.parse(msg.payload.toString());
            if (jsonMsg.hasOwnProperty('timeRecorded')) {
              if ((jsonMsg['timeRecorded'] * 1000) > (Date.now() - 86400000)) {
                if (jsonMsg.hasOwnProperty('grillTempRecorded')) {
                  this.currentProbe1Temp = jsonMsg['grillTempRecorded'];
                }
                if (jsonMsg.hasOwnProperty('meatTempRecorded')) {
                  this.currentProbe2Temp = jsonMsg['meatTempRecorded'];
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

  ionViewDidEnter() {
    this.storage.get('grillTemp').then((val) => {
      if (val) {
        this.hideGrillProgressbar = false;
        this.desiredProbe1Temp = val;
      }
    });
    this.storage.get('meatTemp').then((val) => {
      if (val) {
        this.hideMeatProgressbar = false;
        this.desiredProbe2Temp = val;
      }
    });
  }
}
