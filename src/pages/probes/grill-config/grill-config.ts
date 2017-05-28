import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import State from '../../IState';

@Component({
  selector: 'page-grill-config',
  templateUrl: 'grill-config.html'
})
export class GrillConfigPage {

  public beef: any;
  public custom: any;
  public customDisabled: boolean;
  public defaultCheck: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage
  ) {
    this.beef = 130;
    this.custom = 200;
    this.customDisabled = true;
  }

  setState(givenState): void {
    this.storage.ready().then(
      () => {
        return this.storage.get('app_state');
      }
    ).then(
      (currentState: State) => {
        const newState: State = Object.assign({}, currentState, givenState);
        return this.storage.set('app_state', newState);
      }
    ).catch(
      (error) => { (console.warn('State could not be set!', error)) }
    );
  }

  setDesiredTemp() {
    let grillTemp: number;
    if (this.beef === 'custom') {
      grillTemp = this.custom;
    } else {
      grillTemp = parseInt(this.beef);
    }
    console.info("Desired Grill Temp", grillTemp);
    this.setState({
      grillDesiredTemperature: grillTemp,
      grillHideProgressbar: false
    });
  }

  customSlider(toggle: boolean) {
    this.customDisabled = !toggle;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrillConfigPage');
    this.defaultCheck = true;
  }

}
