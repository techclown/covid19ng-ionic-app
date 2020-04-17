import { Component, ViewChild, OnInit, AfterContentInit } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
declare var google;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterContentInit {

  map;
  @ViewChild('mapElement', { static: true }) mapElement;
  marker: any;
  defLng: any;
  defLat: any;
  bounds: any;
  states: any;
  infowindow: any;
  heatmap: any;
  heatMapData = [];
  areaCircle: any;
  nigeria: Object;
  myLng: number;
  myLat: number;
  dnear: number;

  constructor(private platform: Platform, public api: ApiService, private router: Router, private alertController: AlertController, private ga: GoogleAnalytics, private oneSignal: OneSignal, private androidPermissions: AndroidPermissions, private geolocation: Geolocation, private locationAccuracy: LocationAccuracy, private toastController: ToastController) { }

  ngOnInit() {
    // this.getStates();

  }

  ionViewWillEnter() {
    this.checkGPSPermission();
    this.setupPush();
    this.ga.startTrackerWithId('UA-123826791-1')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('case map');
        // Tracker is ready
        // You can now track pages or set additional information such as AppVersion or UserId
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
    
    this.getStates();
  }

  ionViewWillLeave() {
    this.ngAfterContentInit();
  }

  getStates() {
    this.ngAfterContentInit();
    this.api.allStates().subscribe(res => {

      this.states = res['data'];
      this.nigeria = res;
      console.log(this.states);
      this.bounds = new google.maps.LatLngBounds();
      this.states.forEach(element => {
        this.setMapMarkers(element.latitude, element.longitude, element.name, element);
        this.map.panToBounds(this.bounds);
        this.map.fitBounds(this.bounds);
        // console.log(this.bounds);


      });

      this.map.setZoom(6);

      this.makeHeatMap();

      this.getLocation();


    });
  }

  ngAfterContentInit() {
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        center: { lat: this.defLat ? this.defLat : 9.4820, lng: this.defLng ? this.defLng : 8.0753 },
        zoom: 9,
        disableDefaultUI: true,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "administrative.neighborhood",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.province",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#181818"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1b1b1b"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#2c2c2c"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8a8a8a"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#373737"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3c3c3c"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#4e4e4e"
              }
            ]
          },
          {
            "featureType": "road.local",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#127f23"
              },
              {
                "saturation": -65
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3d3d3d"
              }
            ]
          }
        ]
      });
  }

  setMapMarkers(latd, long, name, state) {
    this.marker = new google.maps.Marker({
      position: { lat: Number(latd), lng: Number(long) },
      animation: google.maps.Animation.DROP,
      label: `${state.cases}`,
      // icon: {
      //   url: 'http://maps.google.com/mapfiles/ms/icons/green.png',
      //   scaledSize: new google.maps.Size(40, 40),
      // }
    });
    this.bounds.extend(this.marker.getPosition());
    // To add the marker to the map, call setMap();
    this.marker.setMap(this.map);

    this.areaCircle = new google.maps.Circle({
      strokeColor: '#F1BC19',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: '#F1BC19',
      fillOpacity: 0.1,
      map: this.map,
      center: { lat: Number(latd), lng: Number(long) },
      radius: Number(state.cases) * 600
    });

    const visual = { location: new google.maps.LatLng(Number(latd), Number(long)), weight: Number(state.cases) };

    this.heatMapData.push(visual);

    // this.infowindow = new google.maps.InfoWindow({
    //   content: `${name}`
    // });

    this.marker.addListener('click', () => {
      this.presentAlert(state);
      console.log(`marker ${state.name} clicked`);
    });
  }


  makeHeatMap() {
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.heatMapData
    });
    this.heatmap.setMap(this.map);

    this.heatmap.set('radius', this.heatmap.get('radius') ? null : 50);

    console.log(this.heatMapData);
  }


  async presentAlert(state) {
    const content = `<p><b>On admission:</b> ${state.admission}</p>
    <p><b>Discharged:</b> ${state.recovered}</p>
    <p><b>Death:</b> ${state.death}</p>
    <p><b>Population infected:</b> ${state.population_percent}%</p>
    <p><b>Percentage death:</b> ${state.death_percent}%</p>
    <p><b>Percentage discharged:</b> ${state.recovery_percent}%</p>
    <p><b>Today</b> ${this.formatDate()}</p>
    `;
    const alert = await this.alertController.create({
      header: `${state.name}`,
      subHeader: `Confirmed cases: ${state.cases}`,
      message: content,
      buttons: ['OK']
    });

    await alert.present();
  }


  formatDate(iso?) {
    const d = new Date();
    return `${d.toLocaleString()}`;
  }

  getNigeria() {
    this.presentAlert(this.nigeria);
  }

  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit('2b88934c-8ae0-4670-ad86-8c759edb8038', 'com.covid19ng.daily');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      const msg = data.payload.body;
      const title = data.payload.title;
      const additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });

    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      const additionalData = data.notification.payload.additionalData;

      // this.showAlert('Notification opened', 'You already read this before', additionalData.task);
    });

    this.oneSignal.endInit();

    this.oneSignal.getIds().then(identity => {
      const id = identity.pushToken;
      const user = identity.userId;

      // this.api.updateProfile(this.token, { device_id: id, device_user: user }).subscribe(() => { });
    });
  }

  async showAlert(title, msg, task) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Ok`,
          handler: () => {
            switch (task) {
              case 'map':
                this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
                break;
              case 'contributions':
                this.router.navigate(['/tabs/tab2'], { replaceUrl: true });
                break;
              case 'info':
                this.router.navigate(['/tabs/tab3'], { replaceUrl: true });
                break;

              default:
                this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
                break;
            }

            // E.g: Navigate to a specific screen
          }
        }
      ]
    });
    alert.present();
  }

  getLocation() {
    const options = {
      enableHighAccuracy: true
    };
    this.geolocation.getCurrentPosition(options).then((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);

      this.myLat = data.coords.latitude;
      this.myLng = data.coords.longitude;

      // this.map.panTo({ lat: this.myLat, lng: this.myLng });

      this.marker = new google.maps.Marker({
        position: { lat: this.myLat, lng: this.myLng },
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/green.png',
          scaledSize: new google.maps.Size(32, 32),
        }
      });
      this.marker.setMap(this.map);



      this.getStateInfo(this.myLat, this.myLng);

    });
  }

  panToMe() {
    if (this.myLat && this.myLng) {

      this.getLocation();
      this.map.panTo({ lat: this.myLat, lng: this.myLng });
    } else {
      this.onGPS();
    }
  }

  async onGPS() {
    const toast = await this.toastController.create({
      message: 'On your device location and reload.',
      position: 'top',
      color: 'success',
      buttons: [
        {
          icon: 'refresh',
          text: 'Reload',
          role: 'cancel',
          handler: () => {
            window.location.reload();
          }
        }
      ]
    });
    toast.present();
  }

  getStateInfo(lat1, lon1) {

    const report = this.states.find(result => {
      var unit = 'K';
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * result.latitude / 180;
      var theta = lon1 - result.longitude;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }

      console.log(dist);

      this.dnear = dist;

      return 100 > dist;
    });

    if (report) {
      this.nearToast(this.dnear, report.name, report.cases, 'warning');
    } else {
      this.farToast();
    }

  }

  async nearToast(d, s, n, c) {
    const toast = await this.toastController.create({
      header: 'My GeoINFO:::',
      message: `Your radius is ${d.toFixed(2)}km (GPS est.) from ${s} with  ${n} reported cases of COVID-19. #StaySafe.`,
      color: c,
      duration: 10000,
      position: 'top',
      buttons: [
        {
          text: 'Info',
          handler: () => {
            this.router.navigate(['/tabs/tab3']);
          }
        }
      ]
    });
    toast.present();
  }

  async farToast() {
    const toast = await this.toastController.create({
      message: `Your radius is above 100km from Nigeria states with reported cases. But #StaySafe.`,
      color: 'success',
      duration: 10000,
      position: 'top'
    });
    toast.present();
  }

  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {

          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {

          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              console.log('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates

        this.getLocation();
        // const options = {
        //   enableHighAccuracy: true
        // };
        // this.geolocation.getCurrentPosition(options).then((data) => {
        //   // data can be a set of coordinates, or an error (if an error occurred).
        //   // data.coords.latitude
        //   console.log(data.coords.latitude);
        //   console.log(data.coords.longitude);

        //   // this.api.updateLocation(this.token, data.coords.latitude, data.coords.longitude);
        // });
      },
      error => console.log('Error requesting location permissions ' + JSON.stringify(error))
    );
  }


}
