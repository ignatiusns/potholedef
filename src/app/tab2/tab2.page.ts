import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { UserPhoto, PhotoService } from '../services/photo.service';
import { Geolocation } from '@capacitor/geolocation'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public photoService: PhotoService, public actionSheetController: ActionSheetController) {}
  public options: google.maps.MapOptions = {
    center: {lat: 38.8951 , lng: -77.0364},
    zoom: 15
  };
  public coordinates: any;
  public slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false
  };  

  async ngOnInit() {
    await this.photoService.loadSaved();
    this.coordinates = await Geolocation.getCurrentPosition();
    this.options = {
      center: {lat: this.coordinates.coords.latitude, lng: this.coordinates.coords.longitude},
      zoom: 16
    };
    console.log("the coordinates are " + this.coordinates.coords.latitude + " - " + this.coordinates.coords.longitude);
  }

  public ReportIssue() {

  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present();
  }
}
