import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  contributions: any;

  constructor(private alertController: AlertController, private api: ApiService, private toastController: ToastController, private ga: GoogleAnalytics) { }

  ionViewWillEnter() {
    this.getContributions();

    this.ga.startTrackerWithId('UA-123826791-1')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('contributions');
        // Tracker is ready
        // You can now track pages or set additional information such as AppVersion or UserId
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  getContributions() {
    this.api.getContributions().subscribe(data => {
      this.contributions = data['data'];
      console.log(this.contributions);
    });
  }

  async contributeAlert() {
    const alert = await this.alertController.create({
      header: 'Share valid updates',
      subHeader: `Contribute to safety via safe report.`,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Your name - optional'
        },
        {
          name: 'message',
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Your short message'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Post',
          handler: (data) => {
            console.log(data);

            if(data.message) {
              this.api.postContribution(data).subscribe((res) => {
                console.log(res);
                this.presentToast('Your contribution has been submitted for review', 'success');
              }, () => {
                this.presentToast('Your contribution has been submitted for review', 'danger');
              });
            } else {
              this.presentToast('A valid message or report is required', 'danger');
            }

            
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      color: type,
      duration: 2000
    });
    toast.present();
  }

}
