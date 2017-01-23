import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GraphPage } from './graph/graph';

@Component({
  selector: 'page-tools',
  templateUrl: 'tools.html'
})
export class ToolsPage {
  public toolList: Object[] = [
    {
      title: 'Graph',
      name: 'graph'
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  selectedItem(tool: Object) {
    if(tool['name'] === 'graph') {
      this.navCtrl.push(GraphPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ToolsPage');
  }

}
