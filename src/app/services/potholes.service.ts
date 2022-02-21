import { AngularFireStorage, AngularFireUploadTask} from '@angular/fire/compat/storage';
import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pothole } from '../models/pothole';

@Injectable({
    providedIn: 'root',
  })
export class PotholeService {
  
  constructor(private http: HttpClient, private ngFirestore: AngularFirestore, public navCtrl: NavController) {}

  getPotholes() {
    return this.ngFirestore.collection('potholes').snapshotChanges();
  }

  savePothole(pothole: Pothole) {
    return this.ngFirestore.collection('potholes').add(pothole);
  }
}