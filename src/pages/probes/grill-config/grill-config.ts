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
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage
  ) {
    this.beef = 130;
    this.custom = 200;
    this.customDisabled = true;
  }

  setState(givenState): void {
    let oldState: State;
    let newState: State;
    this.storage.get('app_state').then((state: State) => {
      oldState = state;
    }).then(() => {
      newState = Object.assign({}, oldState, givenState);
      this.storage.set('app_state', newState).catch(
        (error) => {
          console.error("setState() error", error);
        });
    });
  }

  setDesiredTemp() {
    let grillTemp: number;
    if (this.beef === 'custom') {
      grillTemp = this.custom;
    } else {
      grillTemp = parseInt(this.beef);
    }
    this.setState({
      grillDesiredTemperature: grillTemp,
      grillHideProgressbar: false
    });
    console.info("Desired Grill Temp", grillTemp);
  }

  customSlider(e: boolean) {
    this.customDisabled = !e;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrillConfigPage');
    this.defaultCheck = true;
  }

}
