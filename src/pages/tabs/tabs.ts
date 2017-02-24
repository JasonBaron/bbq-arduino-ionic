import { Component } from '@angular/core';

import { ProbesPage } from '../probes/probes';
import { ToolsPage } from '../tools/tools';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ProbesPage;
  tab2Root: any = ToolsPage;

  constructor() {

  }
}
