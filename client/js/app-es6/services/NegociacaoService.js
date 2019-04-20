import {HttpService} from './HttpService';
import {ConnectionFactory} from './ConnectionFactory';
import {NegociacaoDao} from '../dao/NegociacaoDao';
import {Negociacao} from '../models/Negociacao';

export class NegociacaoService {

    constructor() {

        this._http = new HttpService();
    }

    obterNegociacoesDaSemana() {
       
        return new Promise((resolve, reject) => {
         
             this._http
                 .get('negociacoes/semana')
                 .then(negociacoes => {
                     console.log(negociacoes);
                     resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                 })
                 .catch(erro => {
                     console.log(erro);
                     reject('Não foi possível obter as negociações da semana');
                 });  
        });        
     }
     
     obterNegociacoesDaSemanaAnterior() {
        
        return new Promise((resolve, reject) => {
         
             this._http
                 .get('negociacoes/anterior')
                 .then(negociacoes => {
                     console.log(negociacoes);
                     resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                 })
                 .catch(erro => {
                     console.log(erro);
                     reject('Não foi possível obter as negociações da semana anterior');
                 });  
        }); 
        
         
     }
     
     obterNegociacoesDaSemanaRetrasada() {
        
        return new Promise((resolve, reject) => {
         
             this._http
                 .get('negociacoes/retrasada')
                 .then(negociacoes => {
                     console.log(negociacoes);
                     resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                 })
                 .catch(erro => {
                     console.log(erro);
                     reject('Não foi possível obter as negociações da semana retrasada');
                 });  
        }); 
     }

    obterNegociacoes() {

        return new Promise((resolve, reject) => {

            Promise.all([
                this.obterNegociacoesDaSemana(),
                this.obterNegociacoesDaSemanaAnterior(),
                this.obterNegociacoesDaSemanaRetrasada()
            ]).then(periodos => {

                let negociacoes = periodos
                    .reduce((dados, periodo) => dados.concat(periodo), [])
                    .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor ));

                resolve(negociacoes);

            }).catch(erro => reject(erro));
        });
    }

    cadastra(negociacao) {

        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação cadastrada com sucesso')
            .catch(error => {
                throw new Error(error);
            })
    }

    lista() {

        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .catch(error => {
                throw new Error(error);
            })
    }

    apaga() {

        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => mensagem)
            .catch(error => {
                throw new Error(error);
            })
    }

    importa(listaAtual) {

       return this.obterNegociacoes()
        .then(negociacoes => 
            negociacoes.filter(negociacao =>
                !listaAtual.some(negociacaoExistente =>
                    negociacao.isEquals(negociacaoExistente)))
        )
        .catch(error => {
            throw new Error(error);
        })
    }

}



    /* 
 
    Implementação utilizando promises para apenas um request
    
    
    obterNegociacoesDaSemana() {
 
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'negociacoes/semana');
            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4) {
                    if(xhr.status == 200) {
    
                      resolve(JSON.parse(xhr.responseText)
                            .map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
    
                    } else {
                        console.log(xhr.responseText);
                        reject('Não foi possível obter as negociações da semana');
    
                    }
                  }
              };
              xhr.send();
    
            });
    
        } */





    /*
            *** Implementação utilizando callback function errorFirst 
    
    
    obterNegociacoresDaSemana(cb) {
 
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'negociacoes/semdana');
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
 
                    cb(null, JSON.parse(xhr.responseText)
                    .map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
 
                } else {
                    cb("Não foi possivel obter as negociações", null);
                }
            }
        };
        xhr.send(); 
 
    }*/

    /* Estados possíveis de um requisição AJAX.
    0: requisição ainda não iniciada
    1: conexão com o servidor estabelecida
    2: requisição recebida
    3: processando requisição
    4: requisição está concluída e a resposta está pronta */

