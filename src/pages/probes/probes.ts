import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Store } from '@ngrx/store';
// import { Storage } from '@ionic/storage';
import { GrillConfigPage } from './grill-config/grill-config';
import { MeatConfigPage } from './meat-config/meat-config';
import { MqttService, MqttMessage } from 'angular2-mqtt';
import AppState from '../../interfaces';
import { Observable } from 'rxjs';

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
  public appRunning: string;
  public grillCurrentTemp: number;
  public grillDesiredTemp: number;
  public meatCurrentTemp: number;
  public meatDesiredTemp: number;
  public grillPbar: boolean;
  public meatPbar: boolean;
  public timeToCheck: number;
  public status: boolean;

  public timeCheck: number; // For input (2-way)

  public state$: Observable<AppState>;

  constructor(
    private navCtrl: NavController,
    private mqtt: MqttService,
    private platform: Platform,
    private _store: Store<AppState>
  ) {
    this.state$ = _store.select('state');
    this.appRunning = this.state$['status'] ? 'Running' : 'Not Running';
    this.grillCurrentTemp = this.state$['grillCurrentTemperature'];
    this.grillDesiredTemp = this.state$['grillDesiredTemperature'];
    this.meatCurrentTemp = this.state$['meatCurrentTemperature'];
    this.meatDesiredTemp = this.state$['meatDesiredTemperature'];
    this.grillPbar = this.state$['grillHideProgressbar'];
    this.meatPbar = this.state$['meatHideProgressbar'];
    this.timeToCheck = this.state$['timeToCheck'];
    this.status = this.state$['status'];
    // platform.ready().then(
    //   () => {
    //     console.info('Platform is ready');
    //     return storage.ready();
    //   }
    // ).then(
    //   () => {
    //     console.info('Storage is ready');
    //     return storage.get('app_state');
    //   }
    // ).then(
    //   (data) => {
    //     if (data == null) {
    //       return storage.set('app_state', defaultState);
    //     }
    //   }
    // ).then(
    //   () => {
    //     console.info('State set!');
    //   },
    //   (error) => {
    //     console.error('State was not set!');
    //   }
    // );
  }

  /**
   * Similar implementation to React's "setState"
   * @param givenState: State(Like) - whatever you want changed
   */
  // setState(givenState): void {
  //   this.storage.ready().then(
  //     () => {
  //       return this.storage.get('app_state');
  //     }
  //   ).then(
  //     (currentState: State) => {
  //       const newState: State = Object.assign({}, currentState, givenState);
  //       return this.storage.set('app_state', newState);
  //     }
  //   ).then(
  //     () => {
  //       this.getState();
  //     },
  //     (error) => {
  //       console.warn('State could not be set!');
  //     }
  //   );
  // }

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
   * Sets all public variables (ones being accessed from html view) to whatever is in state
   */
  // getState(): void {
  //   this.storage.ready().then(
  //     () => {
  //       return this.storage.get('app_state');
  //     }
  //   ).then(
  //     (state: State) => {
  //       this.appRunning = state.status ? 'Running' : 'Not Running';
  //       // this.grillCurrentTemp = state.grillCurrentTemperature;
  //       this.grillDesiredTemp = state.grillDesiredTemperature;
  //       this.meatCurrentTemp = state.meatCurrentTemperature;
  //       this.meatDesiredTemp = state.meatDesiredTemperature;
  //       this.grillPbar = state.grillHideProgressbar;
  //       this.meatPbar = state.meatHideProgressbar;
  //       this.timeToCheck = state.timeToCheck;
  //     }
  //   );
  // }

  /**
   * Sets timeToCheck variable - How long between temperature checks?
   */
  setTimeToCheck() {
    console.info("Desired Time To Check", this.timeCheck);
    this._store.dispatch({
      type: 'SET_TIME_TO_CHECK',
      payload: this.timeCheck
    });
    // this.setState({
    //   timeToCheck: this.timeCheck
    // });
  }

  /**
   * Stop the Arduino from taking readings and controlling the fan
   */
  stop() {
    let jsonMsg = JSON.stringify({
      killswitch: true,
      timeToCheck: 5
    });
    this.mqtt.publish(OUT_TOPIC, jsonMsg, {
      retain: true
    }).subscribe(
      () => {},
      err => console.error("stop()", err),
      () => {
        this._store.dispatch({ type: 'STATUS_OFF' });
        // this.setState({ status: false });
      }
    );
  }

  /**
   * Instructs the Arduino to start taking readings and controlling the fan
   */
  start() {
    // this.getState(); // Gets fresh values
    let jsonMsg = JSON.stringify({
      killswitch: false,
      timeToCheck: this.state$['timeToCheck'],
      grillTemp: this.state$['grillDesiredTemperature'],
      meatTemp: this.state$['meatDesiredTemperature']
    });
    this.mqtt.publish(OUT_TOPIC, jsonMsg, {
      retain: false
    }).subscribe(
      () => {},
      err => {
        console.error(err);
        this._store.dispatch({ type: 'STATUS_ON' });
        // this.setState({ status: false });
      },
      () => {
        // When mqtt publishes successfully it fires complete(), not next()
        this._store.dispatch({ type: 'STATUS_OFF' });
        // this.setState({ status: true });
      }
    );
  }

  /**
   * Clear all fields to their default state
   */
  clear() {
    // this.setState(defaultState);
    this._store.dispatch({ type: 'RESET_STATE' });
    this.timeCheck = this.state$['timeToCheck'];
    console.log(this.appRunning, this.grillCurrentTemp);
  }

  /**
   * Starts MQTT Message subscription service
   */
  startMQTTMessages(): void {
    this.mqtt.observe(IN_TOPIC).subscribe(
      (msg: MqttMessage) => {
        try {
          const jsonMsg: Object = JSON.parse(msg.payload.toString());
          if (jsonMsg.hasOwnProperty('timeRecorded')) {
            if ((jsonMsg['timeRecorded'] * 1000) > (Date.now() - 86400000)) {
              if (jsonMsg.hasOwnProperty('grillTempRecorded') || jsonMsg.hasOwnProperty('meatTempRecorded')) {
                this._store.dispatch({
                  type: 'SET_GRILL_MEAT_CURRENT_TEMPERATURE',
                  payload: {
                    grillCurrentTemperature: jsonMsg['grillTempRecorded'] | 0,
                    meatCurrentTemperature: jsonMsg['meatTempRecorded'] | 0
                  }
                });
                // this.setState({
                //   grillCurrentTemperature: jsonMsg['grillTempRecorded'] | 0,
                //   meatCurrentTemperature: jsonMsg['meatTempRecorded'] | 0
                // });
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
    // this.getState();
    this.startMQTTMessages();
  }

  /**
   * Is called when you leave and come back to this page
   */
  ionViewDidEnter(): void {
    console.log('ionViewDidEnter ProbesPage');
    // this.getState();
  }
}
