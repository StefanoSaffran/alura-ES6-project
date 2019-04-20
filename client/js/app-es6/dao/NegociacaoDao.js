import {Negociacao} from '../models/Negociacao';

export class NegociacaoDao {

    constructor(connection) {

        this._connection = connection;
        this._store = 'negociacoes';
    }

    adiciona(negociacao) {

        return new Promise((resolve, reject) => {

        /*  let transaction = this._connection.transaction([this._store], 'readwrite');
            let store = transaction.objectStore(this._store);
            let request = store.add(negociacao); 
            
            podemos reduzir o request para add no banco para*/

            let request = this._connection
            .transaction([this._store],'readwrite')
            .objectStore(this._store)
            .add(negociacao);

            request.onsuccess = (e) => {
                resolve();
            };

            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível adicionar a negociação');
            };                
        });
    }

    listaTodos() {

        return new Promise((resolve, reject) => {

            let cursor = this._connection
            .transaction([this._store],'readwrite')
            .objectStore(this._store)
            .openCursor();
 
                let negociacoes = [];
    
                cursor.onsuccess = e => {
                    let atual = e.target.result;
    
                    if (atual) {
    
                        let dado = atual.value;
    
                        negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
                        atual.continue();
    
                    } else {
                        // quando não há mais objects em nossa store.
                        // Isso significa que já terminados de popular negociacoes
                        resolve(negociacoes);
                    }
                };
                cursor.onerror = e => {
                    console.log('Error:' + e.target.error.name);
                    reject("Não foi possivel listar as negociações");
                };
        });
    }

    apagaTodos() {

        return new Promise((resolve, reject) => {

            let request = this._connection
            .transaction([this._store],'readwrite')
            .objectStore(this._store)
            .clear();

            request.onsuccess = e => resolve("Negociações apagadas com sucesso");

            request.onerror = e => {
                console.log(e.target.error);
                reject("Não foi possivel apagar as negociações");
            }
            });
    }

}