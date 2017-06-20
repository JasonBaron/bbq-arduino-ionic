import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Store } from '@ngrx/store';
import AppState from '../../../interfaces';

@Component({
  selector: 'page-meat-config',
  templateUrl: 'meat-config.html'
})
export class MeatConfigPage {

  public meat: any;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _store: Store<AppState>
  ) {
    this.meat = 200;
  }

  setDesiredTemp() {
    const meatTemp: number = this.meat;
    console.info("Desired Meat Temp", meatTemp);
    this._store.dispatch({
      type: 'SET_MEAT_CONFIG',
      payload: {
        meatDesiredTemperature: meatTemp,
        meatHideProgressbar: false
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeatConfigPage');
  }
  
}
