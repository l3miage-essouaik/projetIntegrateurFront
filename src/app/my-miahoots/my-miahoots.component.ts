import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import 'firebase/compat/firestore';
import { MiahootService } from '../services/miahoot.service';
import { CreateMihaootComponent } from '../create-mihaoot/create-mihaoot.component';
import { MatDialog } from '@angular/material/dialog';
import { Miahoot } from '../models/models';
import { DataService } from '../data.service';


/**
 * @title Table with sorting
 */
@Component({
  selector: 'app-my-miahoots',
  templateUrl: './my-miahoots.component.html',
  styleUrls: ['./my-miahoots.component.scss']
})
export class MyMiahootsComponent implements AfterViewInit, OnInit {
  idTeacher = this.route.snapshot.paramMap.get('id');
  displayedColumns: string[] = ['id', 'name', 'date', 'status', 'actions'];
  dataSource: MatTableDataSource<Miahoot> = new MatTableDataSource();
  codePin : number;

  public user: User | null = null;

  constructor(
    private router: Router,
    private auth: Auth,
    private fs: Firestore,
    private miService: MiahootService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private dataService : DataService
  ) {
    authState(auth).subscribe((user) => {
      this.user = user;
    });
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    const id = (this.route.snapshot.paramMap.get('id'));
    this.miService.miahootsByTeacherId(id)
      .then(miahoot => {
        console.log(miahoot);
        this.dataSource.data = miahoot;
      })
      .catch(err => console.error(err));
  }
  //popup create miahoot
  openNewMiahootDialog() {
    const dialogRef = this.dialog.open(CreateMihaootComponent, {
      data: { teacherId: this.idTeacher }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


  editMiahoot(miahootId: number) {
    this.router.navigate(['/new-miahoot/' + miahootId]);
  }

  deleteMiahoot(id: number, miahoot: Miahoot): void {
    this.dataSource.data = this.dataSource.data.filter(m => m !== miahoot);
    this.miService.deleteMiahoot(id)
      .then(() => console.log("miahoot deleted"))
      .catch(err => console.log(err));
  }

  lectureMiahoot(miahootId: number) {
    //Ajouter le miahoot correspondant au miahootId a la collection projectedMiahoots
    const miahoot = this.miService.getMiahoot(miahootId);

    // Update the user's projectedMiahoot field in Firestore
    if (this.user) {
      const userId = this.user.uid;
      const docRef = doc(this.fs, `users/${userId}`);
      updateDoc(docRef, { projectedMiahoot: miahootId }).then(() => {
        this.router.navigate(['/presentateur/' + miahootId]);
      }).catch((error) => {
        console.error('Error updating Firestore document:', error);
      });
    }
  }

  async play(miahootId: number){  
    let doc = await this.dataService.addMiahootToFs(miahootId); 
    this.router.navigate(['presentateur/'+doc.id]);
    let miahoot = await this.miService.getMiahoot(miahootId);
    let updatedMiahoot = {
      ...miahoot, 
      status: 0
    };    
   this.miService.updateMiahoot(miahootId, updatedMiahoot).then((result) => console.log("miahoot updated successfully "+result)); 
  }
  

  createNewMiahoot() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(id);
    this.router.navigate(['/new-miahoot/' + id]);
  }

  getStatusDisplayValue(status: string): string {
    if (status === 'PRESENTED') {
      return 'Présenté';
    } else if (status === 'NOT_PRESENTED') {
      return 'Pas encore présenté';
    } else {
      return '';
    }
  }



}
