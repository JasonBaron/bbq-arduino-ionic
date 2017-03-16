import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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

  setDesiredTemp() {
    let grillTemp: number;
    if (this.beef === 'custom') {
      grillTemp = this.custom;
    } else {
      grillTemp = parseInt(this.beef);
    }
    this.storage.set('grillTemp', grillTemp);
    this.storage.set('grillTempValid', true);
    console.info(`Desired Grill Temp: ${grillTemp}`);
  }

  customSlider(e: boolean) {
    this.customDisabled = !e;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrillConfigPage');
    this.defaultCheck = true;
  }

}
