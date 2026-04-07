import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EditableImage } from '../editable-image/editable-image';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, EditableImage],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {}
