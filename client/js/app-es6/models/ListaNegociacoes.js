export class ListaNegociacoes {

    constructor() {
        this._negociacoes = [];

    }

    adiciona(negociacao) {

        this._negociacoes.push(negociacao);
                                       //  aqui usando arrow function que tem escopo lexico. entao seu "this" é estatico e não preciso passa-lo como parametro.
    //  Reflect.apply(this._armadilha, this._contexto, [this]);          usando Reflect do ES6
    //  this._armadilha.apply(this._contexto, [this]);                  maneira utilizada no ES5
    }

    get volumeTotal() {
        return this._negociacoes.reduce((total, n) => total + n.volume, 0.0);
    }

    get negociacoes() {
        return[...this._negociacoes];
        //return [].concat(this._negociacoes);
    }

    esvazia() {
        this._negociacoes = [];

    }

    inverteOrdem() {
        this._negociacoes.reverse();
    }

    ordena(criterio) {
        this._negociacoes.sort(criterio);        
    }
}