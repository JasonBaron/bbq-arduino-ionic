import { Component } from '@angular/core';

import { ProbesPage } from '../probes/probes';
import { GraphPage } from '../graph/graph';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ProbesPage;
  tab2Root: any = GraphPage;

  constructor() {

  }
}
