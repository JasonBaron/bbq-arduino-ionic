import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GraphPage } from './graph/graph';
import { TimerPage } from './timer/timer';
/*
  Generated class for the Tools page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tools',
  templateUrl: 'tools.html'
})
export class ToolsPage {
  public toolList: Object[] = [
    {
      title: 'Graph',
      name: 'graph'
    },
    {
      title: 'Timer',
      name: 'timer'
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  selectedItem(tool: Object) {
    if(tool['name'] === 'graph') {
      this.navCtrl.push(GraphPage);
    } else if(tool['name'] === 'timer') {
      this.navCtrl.push(TimerPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ToolsPage');
  }

}
