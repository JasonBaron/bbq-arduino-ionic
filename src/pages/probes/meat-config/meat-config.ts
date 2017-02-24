import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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

  setDesiredTemp() {
    let meatTemp: number = this.meat;
    this.storage.set('meatTemp', meatTemp);
    console.info(`Desired Grill Temp: ${meatTemp}`);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrillConfigPage');
  }
  
}
