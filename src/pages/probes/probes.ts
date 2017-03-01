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
  public timeUntilCheck: any;
  public status: string;

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
    this.timeUntilCheck = 5;
  }

  setTimeToCheck() {
    let timeToCheck: number = this.timeUntilCheck;
    this.storage.set('timeToCheck', timeToCheck);
    this.storage.set('timeToCheckValid', true);
    console.info(`Desired Time To Check: ${timeToCheck}`);
  }

  stop() {
    let jsonMsg = JSON.stringify({
      killswitch: true,
      timeToCheck: 5
    });
    this.mqtt.publish(TOPIC, jsonMsg, {
      retain: true
    }).subscribe(
      v => console.log(v),
      e => console.warn(e),
      () => {
        this.status = "Not running";
      }
    );
  }

  start() {
    debugger;
    this.storage.get('timeToCheckValid').then((timeToCheckValidValue) => console.log(timeToCheckValidValue));

    this.storage.get('grillTempValid').then((grillTempValidValue) => {
      this.storage.get('meatTempValid').then((meatTempValidValue) => {
        this.storage.get('timeToCheckValid').then((timeToCheckValidValue) => {

          if (grillTempValidValue && meatTempValidValue && timeToCheckValidValue) {

            this.storage.get('grillTemp').then((grillTempValue) => {
              this.storage.get('meatTemp').then((meatTempValue) => {
                this.storage.get('timeToCheck').then((timeToCheckValue) => {

                  let jsonMsg = JSON.stringify({
                    killswitch: false,
                    timeToCheck: timeToCheckValue,
                    grillTemp: grillTempValue,
                    meatTemp: meatTempValue
                  });
                  this.mqtt.publish(TOPIC, jsonMsg, {
                    retain: false
                  }).subscribe(
                    v => console.log(v),
                    e => console.warn(e),
                    () => {
                      this.status = "Running";
                    }
                  );

                });
              });
            });

          } else {
            console.warn("Invalid submission");
            this.status = "Not running";
          }

        });
      });
    });
  }

  clear() {
    this.storage.clear().catch((error) => {
      console.warn(error);
    });
    this.storage.set('grillTempValid', false);
    this.storage.set('meatTempValid', false);
    this.storage.set('timeToCheckValid', false);
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
          console.warn("JSON cannot be parsed!");
        }
      },
      (error) => {
        console.error(error);
      }
    );
    this.storage.set('grillTempValid', false);
    this.storage.set('meatTempValid', false);
    this.storage.set('timeToCheckValid', false);
    this.status = "Not running";
  }

  ionViewDidEnter() {
    this.storage.get('grillTemp').then(grillTempVal => {
      this.storage.get('meatTemp').then(meatTempVal => {
        this.meat['hideProgressbar'] = false;
        this.grill['hideProgressbar'] = false;
        this.meat['desired'] = meatTempVal;
        this.grill['desired'] = grillTempVal;
      });
    });
  }
}
