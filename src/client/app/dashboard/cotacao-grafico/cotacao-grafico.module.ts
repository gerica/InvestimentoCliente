import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
    AlertModule,
    TabsModule,
    ModalModule
} from 'ng2-bootstrap/ng2-bootstrap';

import { CotacaoGraficoComponent } from './cotacao-grafico.component';

@NgModule( {
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        AlertModule,
        TabsModule,
        ModalModule
    ],
    declarations: [CotacaoGraficoComponent],
    exports: [CotacaoGraficoComponent]
})

export class CotacaoGraficoModule { }
