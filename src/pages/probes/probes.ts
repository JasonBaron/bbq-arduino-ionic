import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GrillConfigPage } from './grill-config/grill-config';
import { MeatConfigPage } from './meat-config/meat-config';
import { MqttService, MqttMessage } from 'angular2-mqtt';

interface Config {
  desiredTemperature: number;
  currentTemperature: number;
  hideProgressbar: boolean;
}

interface State {
  timeToCheck: number;
  grill: Config;
  meat: Config;
  status: string;
}

const TOPIC: string = 'test';

@Component({
  selector: 'page-probes',
  templateUrl: 'probes.html'
})
export class ProbesPage {
  private state: State;

  public appStatus: string;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public mqtt: MqttService
  ) {
    storage.ready().then(
      () => {
        this.state = {
          timeToCheck: 5,
          status: 'Not running',
          grill: {
            desiredTemperature: 0,
            currentTemperature: 0,
            hideProgressbar: true
          },
          meat: {
            desiredTemperature: 0,
            currentTemperature: 0,
            hideProgressbar: true
          }
        };
        storage.set('app_state', this.state).then(
          () => {
            console.info('State set!');
          }
        );
      }
    );
  }

  getGrillConfigPage(): Component {
    return GrillConfigPage;
  }

  getMeatConfigPage(): Component {
    return MeatConfigPage;
  }

  getStatus() {
    this.storage.get('app_state').then(
      (state: State) => {
        this.appStatus = state.status;
      }
    );
  }

  // setTimeToCheck() {
  //   console.info(`Desired Time To Check: ${this.check['timeToCheck']}`);
  //   this.storage.set('timeToCheck', +this.check['timeToCheck']);
  // }

  // stop() {
  //   let jsonMsg = JSON.stringify({
  //     killswitch: true,
  //     timeToCheck: 5
  //   });
  //   this.mqtt.publish(TOPIC, jsonMsg, {
  //     retain: true
  //   }).subscribe(
  //     v => console.log(v),
  //     e => console.warn(e),
  //     () => {
  //       this.status = "Not running";
  //     }
  //   );
  // }

  // start() {
  //   this.storage.get('grillTempValid').then((grillTempValidValue) => {
  //     this.storage.get('meatTempValid').then((meatTempValidValue) => {

  //         if (grillTempValidValue && meatTempValidValue) {

  //           this.storage.get('grillTemp').then((grillTempValue) => {
  //             this.storage.get('meatTemp').then((meatTempValue) => {

  //                 let jsonMsg = JSON.stringify({
  //                   killswitch: false,
  //                   timeToCheck: this.check['timeToCheck'],
  //                   grillTemp: grillTempValue,
  //                   meatTemp: meatTempValue
  //                 });
  //                 this.mqtt.publish(TOPIC, jsonMsg, {
  //                   retain: false
  //                 }).subscribe(
  //                   v => console.log(v),
  //                   e => console.warn(e),
  //                   () => {
  //                     this.status = "Running";
  //                   }
  //                 );

  //             });
  //           });

  //         } else {
  //           console.warn("Invalid submission");
  //           this.status = "Not running";
  //         }

  //     });
  //   });
  // }

  // clear() {
  //   this.storage.clear().catch((error) => {
  //     console.warn(error);
  //   });
  //   this.storage.set('grillTempValid', false);
  //   this.storage.set('meatTempValid', false);
  //   this.check['timeToCheck'] = 5;
  //   this.grill['hideProgressbar'] = true;
  //   this.grill['current'] = 0;
  //   this.meat['hideProgressbar'] = true;
  //   this.meat['current'] = 0;
  //   this.check['timeToCheck'] = 5;
  // }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad ProbesPage');
    this.getStatus();
  //   this.mqtt.observe(TOPIC).subscribe(
  //     (msg: MqttMessage) => {
  //       try {
  //         if (msg.topic === TOPIC) {
  //           let jsonMsg: Object = JSON.parse(msg.payload.toString());
  //           if (jsonMsg.hasOwnProperty('timeRecorded')) {
  //             if ((jsonMsg['timeRecorded'] * 1000) > (Date.now() - 86400000)) {
  //               if (jsonMsg.hasOwnProperty('grillTempRecorded')) {
  //                 this.grill['current'] = jsonMsg['grillTempRecorded'];
  //               }
  //               if (jsonMsg.hasOwnProperty('meatTempRecorded')) {
  //                 this.meat['current'] = jsonMsg['meatTempRecorded'];
  //               }
  //             }
  //           }
  //         }
  //       } catch (e) {
  //         console.warn("JSON cannot be parsed!");
  //       }
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  //   this.storage.set('grillTempValid', false);
  //   this.storage.set('meatTempValid', false);
  //   this.status = "Not running";
  }

  // ionViewDidEnter(): void {
  //   this.storage.get('grillTemp').then(grillTempVal => {
  //     this.storage.get('meatTemp').then(meatTempVal => {
  //       this.meat['hideProgressbar'] = false;
  //       this.grill['hideProgressbar'] = false;
  //       this.meat['desired'] = meatTempVal;
  //       this.grill['desired'] = grillTempVal;
  //     });
  //   });
  // }
}
