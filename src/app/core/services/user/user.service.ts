import { Injectable } from '@angular/core';
import { getDatabase, ref, set } from "firebase/database";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  writeUserData(){
    const db = getDatabase();
    set(ref(db, 'users/' +  "001userTeste"), {
      username: "Ewerton",
      email: "ewertonolivaleal6@gmail.com"
    });
  }

}
