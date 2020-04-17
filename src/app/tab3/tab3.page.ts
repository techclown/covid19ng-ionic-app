import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private ga: GoogleAnalytics) { }

  ionViewWillEnter() {
    this.ga.startTrackerWithId('UA-123826791-1')
      .then(() => {
        // console.log('Google analytics is ready now');
        this.ga.trackView('info-page');
        // Tracker is ready
        // You can now track pages or set additional information such as AppVersion or UserId
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  contact(type) {
    switch (type) {
      case 'call':
        window.location.href = 'tel:07036708970';
        break;
      case 'toll':
        window.location.href = 'tel:080097000010';
        break;
      case 'email':
        window.location.href = 'mailto:info@ncdc.gov.ng';
        break;
      case 'website':
        window.location.href = 'https://ncdc.gov.ng';
        break;
      case 'twitter':
        window.location.href = 'https://twitter.com/NCDCgov';
        break;
      case 'facebook':
        window.location.href = 'https://facebook.com/NCDCgov';
        break;
      case 'sms':
        window.location.href = 'sms:08099555577';
        break;
      case 'whatsapp':
        window.location.href = 'https://wa.me/2347087110839/';
        break;

      default:
        break;
    }
  }

}
