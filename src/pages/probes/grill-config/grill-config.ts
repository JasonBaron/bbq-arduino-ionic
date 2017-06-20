import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Store } from '@ngrx/store';
import AppState from '../../../interfaces';

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
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _store: Store<AppState>
  ) {
    this.beef = 130;
    this.custom = 200;
    this.customDisabled = true;
  }

  setDesiredTemp() {
    let grillTemp: number;
    if (this.beef === 'custom') {
      grillTemp = this.custom;
    } else {
      grillTemp = parseInt(this.beef);
    }
    console.info("Desired Grill Temp", grillTemp);
    this._store.dispatch({
      type: 'SET_GRILL_CONFIG',
      payload: {
        grillDesiredTemperature: grillTemp,
        grillHideProgressbar: false
      }
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
