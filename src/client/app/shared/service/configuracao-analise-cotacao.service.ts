import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

//import {Operacao} from '../../shared/entity/operacao';

import { ConfiguracaoAnaliseCotacoes } from '../entity/configuracaoAnaliseCotacoes';

import { URL_RECUPERAR_CONFIGURACAO_ANALISE_COTACAO } from '../../common/url_const';
import { URL_SALVAR_CONFIGURACAO_ANALISE_COTACAO } from '../../common/url_const';


@Injectable()
export class ConfiguracaoAnaliseCotacaoService {

    constructor( private http: Http ) { }

    createAuthorizationHeader( contentHeaders: Headers ) {
        contentHeaders.append( 'Accept', 'application/json' );
        contentHeaders.append( 'Content-Type', 'application/json' );
        contentHeaders.append( 'X-Auth-Token', localStorage.getItem( 'id_token' ) );
    }

    public salvarConfiguracaoAnalise( configuracao: ConfiguracaoAnaliseCotacoes ): Observable<any> {
        let contentHeaders = new Headers();
        this.createAuthorizationHeader( contentHeaders );
        let body = JSON.stringify( configuracao );

        return this.http.post( URL_SALVAR_CONFIGURACAO_ANALISE_COTACAO, body, { headers: contentHeaders })
            // ...and calling .json() on the response to return data
            .map( this.extractData )
            //...errors if any
            .catch( this.handleError );
    }

    public recuperarConfiguracaoAnalise(): Observable<any> {
        let contentHeaders = new Headers();
        this.createAuthorizationHeader( contentHeaders );

        return this.http.get( URL_RECUPERAR_CONFIGURACAO_ANALISE_COTACAO, { headers: contentHeaders })
            // ...and calling .json() on the response to return data
            .map( this.extractData )
            //...errors if any
            .catch( this.handleError );
    }

    private extractData( res: Response ) {
        return res.json();
    }
    private handleError( error: Response | any ) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if ( error instanceof Response ) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify( body );
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error( errMsg );
        return Observable.throw( error.json() );
    }

}
