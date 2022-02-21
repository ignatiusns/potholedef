import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { UserPhoto, PhotoService } from '../services/photo.service';
import { Geolocation } from '@capacitor/geolocation'
import { PotholeService } from '../services/potholes.service';
import { Pothole } from '../models/pothole';
import { NavController } from '@ionic/angular';
import { PredictionAPIClient } from '@azure/cognitiveservices-customvision-prediction'
import { ApiKeyCredentials } from '@azure/ms-rest-js'

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
  public probability: any;

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
      potholeprediction: this.probability
    }
    console.log("Photo URL - " + this.photoUrl);
    console.log("Probability - " + this.probability);
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
    uploadmeta.uploadProgress$.subscribe(uplprogress => {
      console.log("Upload progress - " + uplprogress);
    })

    uploadmeta.downloadUrl$.subscribe(durl => {
      this.photoUrl = durl;
      console.log("sets the url - " + durl);  
      this.postForPrediction(durl);  
    });  
  }

  public postForPrediction(imgurl: string) {
    const customVisionPredictionKey = "2890a4d458b74286ac9d9912fecd3fbc";
    const customVisionPredictionEndPoint = "https://potholeid.cognitiveservices.azure.com/customvision/v3.0/Prediction/0bb219d4-ed58-43ff-a5ed-82bb5112541a/detect/iterations/Iteration1/url";
    const projectId = "0bb219d4-ed58-43ff-a5ed-82bb5112541a";

    const credentials = new ApiKeyCredentials({ inHeader: {"Prediction-key": customVisionPredictionKey } });
    const client = new PredictionAPIClient(credentials, customVisionPredictionEndPoint);

    const imageURL = imgurl;

    client
      .classifyImageUrl(projectId, "Iteration1", { url: imageURL })
      .then(result => {
        console.log("The result is: ", JSON.stringify(result));
        this.probability = Math.max.apply(Math, result.predictions.map(function(o) { 
          console.log("probability is", o.probability.toFixed(2));
          return o.probability.toFixed(2);
        }))
      })
      .catch(err => {
        console.log("An error occurred:", JSON.stringify(err));
      });
  }      
  
}
