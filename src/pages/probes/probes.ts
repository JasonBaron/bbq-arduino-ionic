import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { Store } from '@ngrx/store';
import { GrillConfigPage } from './grill-config/grill-config';
import { MeatConfigPage } from './meat-config/meat-config';
import { MqttService, MqttMessage } from 'angular2-mqtt';
import AppState from '../../interfaces';
import { Observable } from 'rxjs/Observable';

//TODO: change to receive topic
const OUT_TOPIC: string = 'config';
const IN_TOPIC: string = 'sensor';

@Component({
  selector: 'page-probes',
  templateUrl: 'probes.html'
})
export class ProbesPage {

  /**
   * Public variables for View (1-way)
   */
  public grillCurrentTemp: number;
  public grillDesiredTemp: number;
  public meatCurrentTemp: number;
  public meatDesiredTemp: number;
  public grillPbar: boolean;
  public meatPbar: boolean;
  public timeToCheck: number;
  public status: boolean;

  public timeCheck: any; // For input (2-way)

  constructor(
    private _navCtrl: NavController,
    private _mqtt: MqttService,
    private _store: Store<AppState>
  ) {
    this._store.select('state').subscribe(
      (state$: Observable<AppState>) => {
        this.grillCurrentTemp = state$['grillCurrentTemperature'];
        this.grillDesiredTemp = state$['grillDesiredTemperature'];
        this.meatCurrentTemp = state$['meatCurrentTemperature'];
        this.meatDesiredTemp = state$['meatDesiredTemperature'];
        this.grillPbar = state$['grillHideProgressbar'];
        this.meatPbar = state$['meatHideProgressbar'];
        this.timeToCheck = state$['timeToCheck'];
        this.status = state$['status'];
      }
    );
  }

  /**
   * Returns the GrillConfigPage component
   */
  getGrillConfigPage(): Component {
    return GrillConfigPage;
  }

  /**
   * Returns the MeatConfigPage component
   */
  getMeatConfigPage(): Component {
    return MeatConfigPage;
  }

  /**
   * Sets timeToCheck variable - How long between temperature checks?
   */
  setTimeToCheck() {
    this._store.dispatch({
      type: 'SET_TIME_TO_CHECK',
      payload: parseInt(this.timeCheck)
    });
  }

  /**
   * Stop the Arduino from taking readings and controlling the fan
   */
  stop() {
    let jsonMsg = JSON.stringify({
      killswitch: true,
      timeToCheck: 5
    });
    this._mqtt.publish(OUT_TOPIC, jsonMsg, {
      retain: true
    }).subscribe(
      () => {},
      err => console.error("stop()", err),
      () => {
        this._store.dispatch({ type: 'STATUS_OFF' });
      }
    );
  }

  /**
   * Instructs the Arduino to start taking readings and controlling the fan
   */
  start() {
    let jsonMsg = JSON.stringify({
      killswitch: false,
      timeToCheck: this.timeToCheck,
      grillTemp: this.grillDesiredTemp,
      meatTemp: this.meatDesiredTemp
    });
    this._mqtt.publish(OUT_TOPIC, jsonMsg, {
      retain: false
    }).subscribe(
      () => {},
      err => {
        console.error(err);
        this._store.dispatch({ type: 'STATUS_OFF' });
      },
      () => {
        // When mqtt publishes successfully it fires complete(), not next()
        this._store.dispatch({ type: 'STATUS_ON' });
      }
    );
  }

  /**
   * Clear all fields to their default state
   */
  clear() {
    this._store.dispatch({ type: 'RESET_STATE' });
    this.timeCheck = this.timeToCheck;
  }

  /**
   * Starts MQTT Message subscription service
   */
  startMQTTMessages(): void {
    this._mqtt.observe(IN_TOPIC).subscribe(
      (msg: MqttMessage) => {
        try {
          const jsonMsg: Object = JSON.parse(msg.payload.toString());
          if (jsonMsg.hasOwnProperty('timeRecorded')) {
            if ((jsonMsg['timeRecorded'] * 1000) > (Date.now() - 86400000)) {
              if (jsonMsg.hasOwnProperty('grillTempRecorded') || jsonMsg.hasOwnProperty('meatTempRecorded')) {
                this._store.dispatch({
                  type: 'SET_GRILL_MEAT_CURRENT_TEMPERATURE',
                  payload: {
                    grillCurrentTemperature: parseInt(jsonMsg['grillTempRecorded']) | 0,
                    meatCurrentTemperature: parseInt(jsonMsg['meatTempRecorded']) | 0
                  }
                });
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

  /**
   * Is called after Component constructor is finished
   */
  ionViewDidLoad(): void {
    console.log('ionViewDidLoad ProbesPage');
    this.startMQTTMessages();
  }

  /**
   * Is called when you leave and come back to this page
   */
  ionViewDidEnter(): void {
    console.log('ionViewDidEnter ProbesPage');
  }
}
