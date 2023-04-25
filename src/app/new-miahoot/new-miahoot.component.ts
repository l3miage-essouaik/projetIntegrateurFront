import { Component } from '@angular/core';

interface QuestionReponses {
  question: string;
  reponses: string[];
  estCorrecte: boolean[];
}

@Component({
  selector: 'app-new-miahoot',
  templateUrl: './new-miahoot.component.html',
  styleUrls: ['./new-miahoot.component.scss']
})
export class NewMiahootComponent {
  questRep: QuestionReponses[] = [];
  newQuestion = '';
  newReponses: string[] = [];
  newCorrect: boolean[] = [];
  editable = false;
  
  onSubmit() {
    // Vérifier si la nouvelle question n'est pas vide (après avoir enlevé les espaces blancs)
    if (this.newQuestion.trim()) {
      this.questRep.push({
        question: this.newQuestion,
        reponses: this.newReponses.filter((reponse) => reponse.trim()), // filtre les réponses vides (après avoir enlevé les espaces blancs)
        estCorrecte: this.newCorrect
      });
      this.newQuestion = '';
      this.newReponses = [];
      this.newCorrect = [];
    }
  }

  ajouteRep(i: number) {
    // Vérifier si la nouvelle réponse n'est pas vide (après avoir enlevé les espaces blancs)
    if (this.newReponses[i].trim()) {
      this.questRep[i].reponses.push(this.newReponses[i]);
      this.newReponses[i] = '';
      this.newCorrect[i] = false;
    }
  }
  
}
