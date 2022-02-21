import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { UserPhoto, PhotoService } from '../services/photo.service';
import { Geolocation } from '@capacitor/geolocation'
import { PotholeService } from '../services/potholes.service';
import { Pothole } from '../models/pothole';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public photoService: PhotoService, 
    public potholeService: PotholeService,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController) {}
  
  public options: google.maps.MapOptions = {
    center: {lat: 38.8951 , lng: -77.0364},
    zoom: 15
  };
  public coordinates: any;
  public photoUrl: any;

  public slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false
  };  

  async ngOnInit() {
    await this.photoService.clearStorage();
    this.coordinates = await Geolocation.getCurrentPosition();
    this.options = {
      center: {lat: this.coordinates.coords.latitude, lng: this.coordinates.coords.longitude},
      zoom: 16
    };
    console.log("the coordinates are " + this.coordinates.coords.latitude + " - " + this.coordinates.coords.longitude);
  }

  public async ReportIssue() {
    const pothole: Pothole = {
      url: this.photoUrl,
      latitude: this.coordinates.coords.latitude,
      longitude: this.coordinates.coords.longitude,
      potholeprediction: 90
    }
    console.log("Photo URL - " + this.photoUrl);
    await this.potholeService.savePothole(pothole);

    this.navCtrl.navigateForward('tabs/tab3');
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

  public async addNewToGallery() {
    const uploadmeta = await this.photoService.addNewToGallery();
    console.log("after calling uploadmeta");
    uploadmeta.downloadUrl$.subscribe(durl => {
      this.photoUrl = durl;
      console.log("sets the url - " + durl);      
    });  
  }
}
