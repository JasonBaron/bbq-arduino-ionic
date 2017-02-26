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
  public grill: Object;
  public meat: Object;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public mqtt: MqttService
  ) {
    this.grill = {
      desired: 0,
      current: 0,
      hideProgressbar: true,
      configPage: GrillConfigPage
    };
    this.meat = {
      desired: 0,
      current: 0,
      hideProgressbar: true,
      configPage: MeatConfigPage
    };
  }

  stop() {
    let jsonMsg = JSON.stringify({
      killswitch: true,
      timeToCheck: 5
    });
    this.mqtt.publish(TOPIC, jsonMsg, {
      retain: true
    }).subscribe((error) => {
      console.warn(error);
    });
  }

  start() {
    let timeToCheck: number;
    let grillTemp: number;
    let meatTemp: number;

    this.storage.get('grillTemp').then(
      (val) => {
        grillTemp = val;
      }
    );
    this.storage.get('meatTemp').then(
      (val) => {
        meatTemp = val;
      }
    );
    this.storage.get('timeToCheck').then(
      (val) => {
        timeToCheck = val;
      }
    );
    let jsonMsg = JSON.stringify({
      killswitch: false,
      timeToCheck: timeToCheck,
      grillTemp: grillTemp,
      meatTemp: meatTemp
    });
    this.mqtt.publish(TOPIC, jsonMsg, {
      retain: false
    }).subscribe((error) => {
      console.warn(error);
    });
  }

  clear() {
    this.storage.clear().catch((error) => {
      console.warn(error);
    });
    this.grill['hideProgressbar'] = true;
    this.grill['current'] = 0;
    this.meat['hideProgressbar'] = true;
    this.meat['current'] = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProbesPage');
    this.mqtt.observe(TOPIC).subscribe(
      (msg: MqttMessage) => {
        try {
          if (msg.topic === TOPIC) {
            let jsonMsg: Object = JSON.parse(msg.payload.toString());
            if (jsonMsg.hasOwnProperty('timeRecorded')) {
              if ((jsonMsg['timeRecorded'] * 1000) > (Date.now() - 86400000)) {
                if (jsonMsg.hasOwnProperty('grillTempRecorded')) {
                  this.grill['current'] = jsonMsg['grillTempRecorded'];
                }
                if (jsonMsg.hasOwnProperty('meatTempRecorded')) {
                  this.meat['current'] = jsonMsg['meatTempRecorded'];
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
        this.grill['hideProgressbar'] = false;
        this.grill['desired'] = val;
      }
    });
    this.storage.get('meatTemp').then((val) => {
      if (val) {
        this.meat['hideProgressbar'] = false;
        this.meat['desired'] = val;
      }
    });
  }
}
