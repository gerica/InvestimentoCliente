import { Component, OnInit, OnChanges, Input, SimpleChange } from '@angular/core';
import { Operacao } from '../../shared/entity/operacao';
import { OperacaoSaida } from '../../shared/entity/operacao-saida';
import { OperacaoService } from '../../shared/service/operacao.service';
import { AlertaUtil } from '../../shared/utils/alerta-util';

@Component({
    moduleId: module.id,
    selector: 'tab-operacao-fechada',
    templateUrl: './operacao-fechada-tab.component.html',
    providers: [OperacaoService]
})

export class OperacaoFechadaTabComponent implements OnInit, OnChanges {
    @Input() atualizarListaSaidas = 0;
    operacoesSaida: OperacaoSaida[];
    operacoes: Operacao[];
    alertaUtil: AlertaUtil;
    mostarTabelaSaida = false;

    /*Construtor*/
    constructor(private operacaoService: OperacaoService) {}

    /*Métodos*/
    public ngOnInit(): void {
        this.recuperarOperacaoSaida();
        this.operacoes = new Array();

    }
    public ngOnChanges(changes: {
        [propKey: string]: SimpleChange
    }) {
        for (let propName in changes) {
            let changedProp = changes[propName];
            let from = JSON.stringify(changedProp.previousValue);
            let to = JSON.stringify(changedProp.currentValue);
            if (from !== to) {
                this.recuperarOperacaoSaida();
                break;
            }

        };
    }
    public recuperarOperacaoSaida(): void {
        this.operacaoService.recuperarOperacaoSaida()
            .subscribe(
                data => {
                    this.operacoesSaida = data;
                    this.montarListaOperacaoEntrada();
                    this.calcularSaldoOperacao();
                },
                error => {
                    this.alertaUtil.addMessage({
                        type: 'danger',
                        closable: true,
                        msg: error
                    });
                }
            );
    }
    index: number;
    public showHideTabelaSaida(index: number): void {
        this.mostarTabelaSaida = !this.mostarTabelaSaida;
        if (index !== undefined) {
            this.index = index;
        }

    }
    public mostarTabelaSaida_f(index: number): boolean {
        console.log('mostarTabelaSaida_f');
        if (this.index === undefined) {
            return this.mostarTabelaSaida;
        } else {
            if (this.index === index) {
                this.index = undefined;
                return this.mostarTabelaSaida;
            }
        }
        return false;
    }
    private montarListaOperacaoEntrada(): void {
        this.operacoes = new Array();
        let tempOperacao: Operacao;
        let adicionar = true;

        for (let i = 0; i < this.operacoesSaida.length; i++) {

            if (this.operacoes.length > 0) {
                for (let x = 0; x < this.operacoes.length; x++) {
                    if (this.operacoes[x].id === this.operacoesSaida[i].operacaoEntrada.id) {
                        tempOperacao = this.operacoes[x];
                        adicionar = false;
                        this.operacoesSaida[i].operacaoEntrada = null;
                        break;
                    }

                }
                if (tempOperacao === null) {
                    tempOperacao = this.operacoesSaida[i].operacaoEntrada;
                    this.operacoesSaida[i].operacaoEntrada = null;
                }
            } else {
                tempOperacao = this.operacoesSaida[i].operacaoEntrada;
                this.operacoesSaida[i].operacaoEntrada = null;
            }

            // adicionar na lista de retonro
            if (tempOperacao.operacoesSaida === undefined) {
                tempOperacao.operacoesSaida = new Array < OperacaoSaida > ();
            }

            tempOperacao.operacoesSaida[tempOperacao.operacoesSaida.length] = this.operacoesSaida[i];
            if (adicionar) {
                this.operacoes[this.operacoes.length] = tempOperacao;
            }
            tempOperacao = null;
            adicionar = true;
        }
    }
    private calcularSaldoOperacao(): void {
        let tempOperacao: Operacao;
        let tempOperacaoSaida: OperacaoSaida;

        let parcialSaldoSaida = 0;
        let qtdSaida = 0;

        if (this.operacoes.length > 0) {
            for (let x = 0; x < this.operacoes.length; x++) {
                tempOperacao = this.operacoes[x];
                for (let i = 0; i < tempOperacao.operacoesSaida.length; i++) {
                    tempOperacaoSaida = tempOperacao.operacoesSaida[i];
                    parcialSaldoSaida += tempOperacaoSaida.totalOperacao;
                    qtdSaida += tempOperacaoSaida.quantidade;

                }
                tempOperacao.saldoOperacao = parcialSaldoSaida - ((tempOperacao.precoUnitario * qtdSaida) + tempOperacao.despesa);
                let operacaoSaidaSaldo = new OperacaoSaida();
                operacaoSaidaSaldo.totalOperacao = parcialSaldoSaida;
                tempOperacao.operacoesSaida[tempOperacao.operacoesSaida.length] = operacaoSaidaSaldo;

                parcialSaldoSaida = 0;
                qtdSaida = 0;
            }

        }
    }

}
