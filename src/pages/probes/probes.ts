import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConfigPage } from './config/config';
import { MqttService } from 'angular2-mqtt';

@Component({
  selector: 'page-probes',
  templateUrl: 'probes.html'
})
export class ProbesPage {
  public probe1temp;
  public probe2temp;
  public hideProgressbar: boolean;
  public pushConfigPage;
  public currentProbe1Temp;
  public desiredProbe1Temp;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public mqtt: MqttService
  ) {
    this.pushConfigPage = ConfigPage;
    this.hideProgressbar = true;
    this.probe1temp = 'N/A';
    this.probe2temp = 'N/A';
    this.currentProbe1Temp = 0;
    this.desiredProbe1Temp = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProbesPage');
    this.storage.remove('desiredGrillTemp');
  }

  ionViewDidEnter() {
    this.storage.get('desiredGrillTemp').then((val) => {
      if (val) {
        this.hideProgressbar = false;
        this.probe1temp = 80;
        this.desiredProbe1Temp = val;
        this.currentProbe1Temp = 80;
      }
    });
  }
}
