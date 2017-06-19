import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import State from '../../IState';

@Component({
  selector: 'page-meat-config',
  templateUrl: 'meat-config.html'
})
export class MeatConfigPage {

  public meat: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage
  ) {
    this.meat = 200;
  }

  setState(givenState): void {
    this.storage.ready().then(
      () => {
        return this.storage.get('app_state');
      }
    ).then(
      (currentState) => {
        const newState = Object.assign({}, currentState, givenState);
        return this.storage.set('app_state', newState);
      }
    ).catch(
      (error) => { (console.warn('State could not be set!', error)) }
    );
  }

  setDesiredTemp() {
    const meatTemp: number = this.meat;
    console.info("Desired Meat Temp", meatTemp);
    this.setState({
      meatDesiredTemperature: meatTemp,
      meatHideProgressbar: false
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeatConfigPage');
  }
  
}
