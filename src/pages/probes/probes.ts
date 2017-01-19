import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-probes',
  templateUrl: 'probes.html'
})
export class ProbesPage {
  public probe1temp = 'N/A';
  public probe2temp = 'N/A';

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProbesPage');
  }
}
