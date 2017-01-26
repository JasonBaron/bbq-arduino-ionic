import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MqttService } from 'angular2-mqtt';

const TOPIC: string = 'test';

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
    public storage: Storage,
    public mqtt: MqttService
  ) {
    this.beef = 130;
    this.custom = 200;
    this.customDisabled = true;
  }

  setDesiredTemp() {
    let jsonObj: string;
    let grillTemp: number;
    if (this.beef === 'custom') {
      grillTemp = this.custom;
    } else {
      grillTemp = parseInt(this.beef);
    }
    this.storage.set('grillTemp', grillTemp);
    jsonObj = JSON.stringify({
      grillTemp: grillTemp,
      killswitch: false
    });
    console.info(`Desired Grill Temp: ${grillTemp}`);
    this.mqtt.publish(TOPIC, jsonObj).subscribe((error) => {
      console.warn(error);
    });
  }

  customSlider(e: boolean) {
    this.customDisabled = !e;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
    this.defaultCheck = true;
  }

}
