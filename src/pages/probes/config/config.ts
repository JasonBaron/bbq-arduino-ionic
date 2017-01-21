import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {
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
    if (this.beef === 'custom') {
      this.storage.set('desiredGrillTemp', this.custom);
      console.log(this.custom);
    } else {
      this.storage.set('desiredGrillTemp', this.beef);
      console.log(this.beef);
    }
  }

  customSlider(e: boolean) {
    this.customDisabled = !e;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
    this.defaultCheck = true;
  }

}
