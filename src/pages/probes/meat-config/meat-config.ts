import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import State from '../../IState';

@Component({
  selector: 'page-meat-config',
  templateUrl: 'meat-config.html'
})
export class MeatConfigPage {

  public meat: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage
  ) {
    this.meat = 200;
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
    let meatTemp: number = this.meat;
    this.setState({
      meatDesiredTemperature: meatTemp,
      meatHideProgressbar: false
    });
    console.info("Desired Meat Temp", meatTemp);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeatConfigPage');
  }
  
}
