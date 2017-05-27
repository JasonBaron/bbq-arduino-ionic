import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GrillConfigPage } from './grill-config/grill-config';
import { MeatConfigPage } from './meat-config/meat-config';
import { MqttService, MqttMessage } from 'angular2-mqtt';

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
  selector: 'page-probes',
  templateUrl: 'probes.html'
})
export class ProbesPage {
  public appRunning: string;
  public grillCurrentTemp: number;
  public grillDesiredTemp: number;
  public meatCurrentTemp: number;
  public meatDesiredTemp: number;
  public grillPbar: boolean;
  public meatPbar: boolean;
  public timeToCheck: number;

  private defaultState: State = {
    timeToCheck: 5,
    status: false,
    grill: {
      desiredTemperature: 100,
      currentTemperature: 87,
      hideProgressbar: false
    },
    meat: {
      desiredTemperature: 200,
      currentTemperature: 50,
      hideProgressbar: false
    }
  };

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public mqtt: MqttService
  ) {
    storage.ready().then(
      () => {
        storage.set('app_state', this.defaultState).then(
          () => {
            console.info('State set!');
          }
        );
      }
    );
  }

  setState(givenState): void {
    let oldState: State;
    let newState: State;
    this.storage.get('app_state').then((state: State) => {
      oldState = state;
    }).then(() => {
      newState = Object.assign({}, oldState, givenState);
      this.storage.set('app_state', newState).then(
        () => {
          this.getState();
        },
        (error) => {
          console.error("setState() error", error);
        });
    });
  }

  getGrillConfigPage(): Component {
    return GrillConfigPage;
  }

  getMeatConfigPage(): Component {
    return MeatConfigPage;
  }

  getState(): void {
    this.storage.get('app_state').then(
      (state: State) => {
        this.appRunning = state.status ? 'Running' : 'Not Running';
        this.grillCurrentTemp = state.grill.currentTemperature;
        this.grillDesiredTemp = state.grill.desiredTemperature;
        this.meatCurrentTemp = state.meat.currentTemperature;
        this.meatDesiredTemp = state.meat.desiredTemperature;
        this.grillPbar = state.grill.hideProgressbar;
        this.meatPbar = state.meat.hideProgressbar;
      }
    );
  }

  setTimeToCheck() {
    console.info("Desired Time To Check", this.timeToCheck);
    this.setState({
      timeToCheck: this.timeToCheck
    });
  }

  stop() {
    let jsonMsg = JSON.stringify({
      killswitch: true,
      timeToCheck: 5
    });
    this.mqtt.publish(TOPIC, jsonMsg, {
      retain: true
    }).subscribe(
      () => {
        this.setState({
          status: false
        });
      }
      );
  }

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

  clear() {
    this.setState(this.defaultState);
  }

  getMQTTMessage() {
    return this.mqtt.observe(TOPIC).subscribe(
      (msg: MqttMessage) => {
        try {
          if (msg.topic === TOPIC) {
            let jsonMsg: Object = JSON.parse(msg.payload.toString());
            if (jsonMsg.hasOwnProperty('timeRecorded')) {
              if ((jsonMsg['timeRecorded'] * 1000) > (Date.now() - 86400000)) {
                if (jsonMsg.hasOwnProperty('grillTempRecorded')) {
                  this.setState({
                    grill: {
                      currentTemperature: jsonMsg['grillTempRecorded']
                    }
                  });
                }
                if (jsonMsg.hasOwnProperty('meatTempRecorded')) {
                  this.setState({
                    meat: {
                      currentTemperature: jsonMsg['meatTempRecorded']
                    }
                  });
                }
              }
            }
          }
        } catch (e) {
          console.warn("JSON cannot be parsed!");
        }
      },
      (error) => {
        console.error("getMQTTMessage() error", error);
      }
    );
  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad ProbesPage');
    this.getState();
    this.getMQTTMessage();
  }

  ionViewDidEnter(): void {
    this.getState();
    //       this.meat['hideProgressbar'] = false;
    //       this.grill['hideProgressbar'] = false;
    //       this.meat['desired'] = meatTempVal;
    //       this.grill['desired'] = grillTempVal;
    //     });
    //   });
  }
}
