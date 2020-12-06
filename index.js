/**
 * Modulo che si collega a diversi registri elettronici
 * - Argo ScuolaNext
 * - Axios
 * 
 * @author Gabriele Princiotta
 * @version 1.0
 * @module schoolapijs
 * @requires console-error
*/
require('console-error');
require('./utils/Array/Prototypes/average');

const fetch = require('node-fetch');
const config = require('./config/config');

class SchoolApi {
    /**
     * Costruttore
     * 
     * @param {string} registro Registro scelto
     * @param {string} token Token utente
     * @param {string} codice Codice scuola
     * @param {string} sceltaAccount Scelta utente
     * @param {string} prgAlunno 
     * @param {string} prgScuola 
     * @param {string} prgScheda 
     */
    constructor(registro, token, codice, sceltaAccount, prgAlunno, prgScuola, prgScheda) {
        // Informazioni dell'utente
        this.registro = registro;
        this.token = token;
        this.codice = codice;
        this.sceltaAccount = sceltaAccount;
        this.prgAlunno = prgAlunno;
        this.prgScuola = prgScuola;
        this.prgScheda = prgScheda;
    }
    
    /**
     * Effettua il login
     * 
     * @async
     * @method
     * @param {string} cod Codice scuola dell'utente
     * @param {string} user Username dell'utente
     * @param {string} pwd Password dell'utente
     */
    async login(cod, user, pwd) {
        switch(registro) {  // In base al registro scelto
            case 'argo':
                const loginProm = await fetch(config.argo.loginURL, {
                    method: 'GET',
                    headers: config.argo.headers(cod, user, pwd)
                }).catch((error) => {
                    console.error('Impossibile effettuare la chiamata per il login!');
                    console.error(error);
                });
        
                try {
                    const log = await loginProm.json();
                    this.token = log.token;
                    this.codice = cod;
                    return log.token;
                } catch (e) {
                    console.error('Impossibile effettuare il login!');
                    console.error(e);
                    return null;
                }
            default:
                return null;
        }
    }
    /**
     * Salva le informazioni prese dalle chiamate
     * 
     * @method
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @param {*} prgAlunno
     */
    async setInfo(prgScuola, prgScheda, prgAlunno) {
        this.prgScuola = prgScuola;
        this.prgScheda = prgScheda;
        this.prgAlunno = prgAlunno;
    }
    /**
     * Prende le informazioni dell'alunno
     * 
     * @async
     * @method
     * @param {boolean} [set=true] Se salvare le informazioni
     */
    async info(set = true) {
        switch(registro) {  // In base al registro scelto
            case 'argo':
                data = typeof data !== 'undefined' ? `?datGiorno=${data}` : '';
                if (typeof prgAlunno == 'undefined' || typeof prgScuola == 'undefined' || typeof prgScheda == 'undefined') {    // Se non ci sono i dati li prendo
                    const info = await this.info();
                    if (info.length == 0) { // Se non riesce a prendere le info
                        return false;
                    }
                }

                const methodProm = await fetch(`${this.baseURL}/${method}${data}`, {
                    method: 'GET',
                    headers: config.argo.headers(this.codice, null, null, this.token, this.prgScuola, this.prgScheda, this.prgAlunno)
                }).catch((error) => {
                    console.error(error);
                });

                try {
                    return await methodProm.json();
                } catch (e) {
                    console.error('Impossibile effettuare la chiamata!');
                    console.error(e);
                    return false;
                }
            default:
                return false;
        }
    }
    /**
     * Prende i voti dal registro
     *
     * @method
     * @param {string} data Data di cui prendere i dati
     * @returns {*} Array di voti giornalieri
     */
    async voti(data) {
        try {
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'votigiornalieri', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende la media dei voti dal registro
     *
     * @method
     * @param {string} data Data di cui prendere i dati
     * @returns {*} Array di voti giornalieri
     */
    async mediaVoti(data) {
        try {
            const voti = await this.voti(token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda);

            if(voti.length == 0) return 0;  // Se non ci sono voti torno direttamente 0 di media

            // Prendo tutte le materie
            const materie = voti.map((x) => {
                return x.desMateria;
            }).filter((value, index, self) => {
                return self.indexOf(value) === index;
            });

            // Media di ogni materia
            let medie = [];

            materie.forEach((materia) => {
                let orali = voti.filter((x) => {
                    return x.desMateria == materia && x.codVotoPratico == 'N' && x.decValore !== null && x.codVoto !== 'A' && x.codVoto !== 'IMP';
                }).map((x) => {
                    return x.decValore;
                });

                let pratici = voti.filter((x) => {
                    return x.desMateria == materia && x.codVotoPratico == 'P' && x.decValore !== null && x.codVoto !== 'A' && x.codVoto !== 'IMP';
                }).map((x) => {
                    return x.decValore;
                });

                let scritti = voti.filter((x) => {
                    return x.desMateria == materia && x.codVotoPratico == 'S' && x.decValore !== null && x.codVoto !== 'A' && x.codVoto !== 'IMP';
                }).map((x) => {
                    return x.decValore;
                });

                const mediaOrali = orali.average();
                const mediaPratici = pratici.average();
                const mediaScritti = scritti.average();
                
                const media = [mediaOrali, mediaPratici, mediaScritti].filter((x) => {
                    return x >= 0;
                }).average();

                if(media >= 0) medie.push(media);

            });

            return medie.average();
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende cosa e' successo oggi dal registro
     * 
     * @method
     * @param {string} data Data di cui prendere i dati
     * @returns {*} Cosa è successo oggi
     */
    async oggi (data) {
        try {
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'oggi', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende le assenze dal registro
     * 
     * @method
     * @param {string} data Data di cui prendere i dati
     * @returns {*} Elenco di assenze
     */
    async assenze (data) {
        try {
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'assenze', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende le note disciplinari dal registro
     * 
     * @method
     * @param {string} data Data di cui prendere i dati
     * @returns {*} Elenco di note
     */
    async note (data) {
        try {
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'notedisciplinari', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende i voti dello scrutinio dal registro
     * 
     * @method
     * @param {string} data Data di cui prendere i dati
     * @returns {*} Elenco dei voti scrutinio
     */
    async votiscrutinio (data) {
        return this.chiamata(token, codice, sceltaAccount, 'votiscrutinio', data, prgAlunno, prgScuola, prgScheda);
    }
    /**
     * Prende i compiti dal registro
     * 
     * @method
     * @param {string} data Data di cui prendere i dati
     * @returns {*} Elenco di campi
     */
    async compiti (data) {
        try {
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'compiti', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende gli argomenti dal registro
     * 
     * @method
     * @param {string} data Data di cui prendere i dati
     * @returns {*} Elenco degli argomenti
     */
    async argomenti (data) {
        try {
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'argomenti', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende i promemoria dal registro
     * 
     * @method
     * @param {string} data Data di cui prendere i dati
     * @returns {*} Elenco dei promemoria
     */
    async promemoria (data) {
        try {
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'promemoria', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende i docenti dal registro
     * 
     * @method
     * @param {string} data Data di cui prendere i dati
     * @returns {*} Elenco di tutti i docenti 
     */
    async docenti (data) {
        return this.chiamata(token, codice, sceltaAccount, 'docenticlasse', data, prgAlunno, prgScuola, prgScheda);
    }
    /**
     * Prende l'orario dal registro
     * 
     * @method
     * @param {string} data Data di cui prendere i dati
     * @returns {*} Orario attualmente registrato
     */
    async orario (data) {
        try {
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'orario', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende gli elementi della bacheca dal registro Argo
     *
     * @async
     * @method
     * @param {string} data
     * @returns {Object[]} Array di lementi della bacheca
     */
    async bacheca (data) {
        try {
            if(data !== null && typeof data !== 'undefined') {  // Se ha scelto di prendere gli elementi di una certa data
                return await this.chiamata('oggi', data);
            }

            const dateFinoAOggi = (() => {
                const mese = new Date().getMonth();
                const anno = new Date().getFullYear();
                const steps = 1;

                let startDate;

                if(mese >= 0 && mese <= 5) {   // Se e' da gennaio a giugno
                    startDate = `${anno - 1}-09-01`;    // Comincia dall'1 settembre dell'anno scorso
                }else { // Altrimenti
                    startDate = `${anno}-09-01`;    // Comincia dall'1 settembre di quest'anno
                }

                const endDate = new Date().toISOString().slice(0, 10);

                const dateArray = [];
                let currentDate = new Date(startDate);
                
                while (currentDate <= new Date(endDate)) {
                    dateArray.push(new Date(currentDate).toISOString().slice(0, 10));
                    // Use UTC date to prevent problems with time zones and DST
                    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
                }
                
                return dateArray;
            })().reverse(); 

            let elsBacheca = [];
            for(let i = 0;i < dateFinoAOggi.length;i++) {   // Per ogni data
                const cosaOggi = await this.chiamata('oggi', dateFinoAOggi[i]);
                let elBacheca = [];
                
                let bacheca = cosaOggi.dati.filter((x) => {
                    return x.tipo == 'BAC';
                });

                bacheca.forEach((bac) => {
                    elBacheca.push({
                        oggetto: bac.dati.desOggetto,
                        messaggio: bac.dati.desMessaggio,
                        url: bac.dati.desUrl,
                        data: dateFinoAOggi[i]
                    });
                });
                
                if(elBacheca.length > 0) {
                    elBacheca.forEach((el) => {
                        elsBacheca.push(el);
                    });
                }
            };
            
            return elsBacheca;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
}

module.exports = (registro, token, codice, sceltaAccount, prgAlunno, prgScuola, prgScheda) => {
    return new SchoolApi(registro, token, codice, sceltaAccount, prgAlunno, prgScuola, prgScheda);
};