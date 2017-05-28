import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GrillConfigPage } from './grill-config/grill-config';
import { MeatConfigPage } from './meat-config/meat-config';
import { MqttService, MqttMessage } from 'angular2-mqtt';
import State, { defaultState } from '../IState';
import { Subscription } from 'rxjs';

const TOPIC: string = 'test';

@Component({
  selector: 'page-probes',
  templateUrl: 'probes.html'
})
export class ProbesPage {

  /**
   * Public variables for View (1-way)
   */
  public appRunning: string;
  public grillCurrentTemp: number;
  public grillDesiredTemp: number;
  public meatCurrentTemp: number;
  public meatDesiredTemp: number;
  public grillPbar: boolean;
  public meatPbar: boolean;
  public timeToCheck: number;

  public timeCheck: number = 5; // For input (2-way)

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public mqtt: MqttService
  ) {
    storage.ready().then(
      () => {
        storage.set('app_state', defaultState).then(
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
        console.info(state);
        this.appRunning = state.status ? 'Running' : 'Not Running';
        this.grillCurrentTemp = state.grillCurrentTemperature;
        this.grillDesiredTemp = state.grillDesiredTemperature;
        this.meatCurrentTemp = state.meatCurrentTemperature;
        this.meatDesiredTemp = state.meatDesiredTemperature;
        this.grillPbar = state.grillHideProgressbar;
        this.meatPbar = state.meatHideProgressbar;
        this.timeToCheck = state.timeToCheck;
      }
    );
  }

  setTimeToCheck() {
    console.info("Desired Time To Check", this.timeCheck);
    this.setState({
      timeToCheck: this.timeCheck
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
      () => {},
      err => { console.error(err); },
      () => {
        this.setState({
          status: false
        });
      }
    ).unsubscribe();
  }

  start() {
    this.getState();
    let jsonMsg = JSON.stringify({
      killswitch: false,
      timeToCheck: this.timeToCheck,
      grillTemp: this.grillDesiredTemp,
      meatTemp: this.meatDesiredTemp
    });
    this.mqtt.publish(TOPIC, jsonMsg, {
      retain: false
    }).subscribe(
      () => {},
      err => { console.error(err); },
      () => {
        this.setState({
          status: true
        });
      }
    ).unsubscribe();
  }

  clear() {
    this.setState(defaultState);
  }

  getMQTTMessage(): Subscription {
    return this.mqtt.observe(TOPIC).subscribe(
      (msg: MqttMessage) => {
        try {
          if (msg.topic === TOPIC) {
            let jsonMsg: Object = JSON.parse(msg.payload.toString());
            if (jsonMsg.hasOwnProperty('timeRecorded')) {
              if ((jsonMsg['timeRecorded'] * 1000) > (Date.now() - 86400000)) {
                if (jsonMsg.hasOwnProperty('grillTempRecorded')) {
                  this.setState({
                    grillCurrentTemperature: jsonMsg['grillTempRecorded']
                  });
                }
                if (jsonMsg.hasOwnProperty('meatTempRecorded')) {
                  this.setState({
                    meatCurrentTemperature: jsonMsg['meatTempRecorded']
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
    console.log('ionViewDidEnter ProbesPage');
    this.getState();
  }
}
