import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import '../../node_modules/ng2-mqtt/mqttws31.js';

platformBrowserDynamic().bootstrapModule(AppModule);
