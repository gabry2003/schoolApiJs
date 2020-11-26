/**
 * Api Non ufficiali di Argo ScuolaNext
 * 
 * @author Gabriele Princiotta
 * @version 1.0
 * @module didupapi
 * @requires console-error
*/
require('console-error');

const fetch = require('node-fetch');

class DidUpApi {
    /**
     * Costruttore
     */
    constructor() {
        /**
         * @type string
         */
        this.baseURL = `https://www.portaleargo.it/famiglia/api/rest`;
        this.produttoreSoftware = 'ARGO Software s.r.l. - Ragusa';
        /**
         * @type string
         */
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36';
        /**
         * @type string
         */
        this.keyApp = 'ax6542sdru3217t4eesd9';
        /**
         * @type string
         */
        this.appCode = 'APF';
        /**
         * @type string
         */
        this.version = '2.1.0';
        /**
         Informazioni sull'alunno ricavate dalla chiamate
        */
       this.gettedInfo = {
            codice: null,
            token: null,
            prgAlunno: null,
            prgScuola: null,
            prgScheda: null
        };
    }
    
    /**
     * Effettua il login
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @async
     * @method
     * @param {string} cod Codice scuola dell'utente
     * @param {string} user Username dell'utente
     * @param {string} pwd Password dell'utente
     */
    async login(cod, user, pwd) {
        const loginProm = await fetch(`${this.baseURL}/login`, {
            method: 'GET',
            headers: {
                'x-key-app': this.keyApp,
                'x-version': this.version,
                'user-agent': this.userAgent,
                'x-cod-min': cod,
                'x-user-id': user,
                'x-pwd': pwd,
                'x-produttore-software': this.produttoreSoftware,
                'x-app-code': this.appCode,
            }
        }).catch((error) => {
            console.error('Impossibile effettuare la chiamata per il login!');
            console.error(error);
        });

        try {
            const log = await loginProm.json();
            this.gettedInfo.token = log.token;
            this.gettedInfo.codice = cod;
            return log.token;
        } catch (e) {
            console.error('Impossibile effettuare il login!');
            console.error(e);
            return null;
        }
    }
    /**
     * Salva le informazioni prese dalle chiamate
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @method
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @param {*} prgAlunno
     */
    async setInfo(prgScuola, prgScheda, prgAlunno) {
        this.gettedInfo.prgScuola = prgScuola;
        this.gettedInfo.prgScheda = prgScheda;
        this.gettedInfo.prgAlunno = prgAlunno;
    }
    /**
     * Prende le informazioni dell'alunno
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @async
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {boolean} set Se salvare le informazioni
     */
    async info(token, codice, sceltaAccount, set) {
        token = typeof token !== 'undefined' && token !== null ? token : this.gettedInfo.token;
        codice = typeof codice !== 'undefined' && codice !== null ? codice : this.gettedInfo.codice;
        set = typeof set !== 'undefined' ? set : true;
        const headers = {
            'x-key-app': this.keyApp,
            "x-version": this.version,
            "x-cod-min": codice,
            "user-agent": this.userAgent,
            "x-produttore-software": this.produttoreSoftware,
            "x-app-code": this.appCode,
            "x-auth-token": token
        };
        const infoProm = await fetch(`${this.baseURL}/schede`, {
            method: 'GET',
            headers: headers
        }).catch((error) => {
            console.error('Impossibile effettuare la chiamate per recuperare le info!');
            console.error(error);
        });

        try {
            const info = await infoProm.json();
            if (set) {
                this.setInfo(info[sceltaAccount].prgScuola, info[sceltaAccount].prgScheda, info[sceltaAccount].prgAlunno);
            }
            return info;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    /**
     * Esegue una chiamata ad Argo
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @async
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {string} method Servizio da chiamare
     * @param {string} data Data da passare al servizio
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     */
    async chiamata(token, codice, sceltaAccount, method, data, prgAlunno, prgScuola, prgScheda) {
        data = typeof data !== 'undefined' ? `?datGiorno=${data}` : "";
        token = typeof token !== 'undefined' && token !== null ? token : this.gettedInfo.token;
        codice = typeof codice !== 'undefined' && codice !== null ? codice : this.gettedInfo.codice;
        if (typeof prgAlunno == 'undefined' || typeof prgScuola == 'undefined' || typeof prgScheda == 'undefined') {
            const info = await this.info(token, codice, sceltaAccount);
            if (info.length == 0) { // Se non riesce a prendere le info
                return false;
            }
        }
        prgAlunno = typeof prgAlunno !== 'undefined' && prgAlunno !== null ? prgAlunno : this.gettedInfo.prgAlunno;
        prgScuola = typeof prgScuola !== 'undefined' && prgScuola !== null ? prgScuola : this.gettedInfo.prgScuola;
        prgScheda = typeof prgScheda !== 'undefined' && prgScheda !== null ? prgScheda : this.gettedInfo.prgScheda;
        const headers = {
            'x-key-app': this.keyApp,
            "x-version": this.version,
            "user-agent": this.userAgent,
            "x-cod-min": codice,
            "x-produttore-software": this.produttoreSoftware,
            "x-app-code": this.appCode,
            "x-auth-token": token,
            "x-prg-scuola": prgScuola,
            "x-prg-scheda": prgScheda,
            "x-prg-alunno": prgAlunno
        };
        const methodProm = await fetch(`${this.baseURL}/${method}${data}`, {
            method: 'GET',
            headers: headers
        }).catch((error) => {
            console.error(error);
        });

        try {
            const methods = await methodProm.json();
            return methods;
        } catch (e) {
            console.error('Impossibile effettuare la chiamata!');
            console.error(e);
            return false;
        }
    }
    /**
     * Prende i voti dal registro Argo
     *
     * @author Gabriele Princiotta
     * @version 1.0
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {string} data Data di cui prendere i dati
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @returns {*} Array di voti giornalieri
     */
    async voti(token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda) {
        try {
            /**
             * @type Object[]
             */
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'votigiornalieri', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende cosa e' successo oggi dal registro Argo
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {string} data Data di cui prendere i dati
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @returns {*} Cosa è successo oggi
     */
    async oggi (token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda) {
        try {
            /**
             * @type Object[]
             */
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'oggi', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende le assenze dal registro Argo
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {string} data Data di cui prendere i dati
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @returns {*} Elenco di assenze
     */
    async assenze (token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda) {
        try {
            /**
             * @type Object[]
             */
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'assenze', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende le note disciplinari dal registro Argo
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {string} data Data di cui prendere i dati
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @returns {*} Elenco di note
     */
    async note (token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda) {
        try {
            /**
             * @type Object[]
             */
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'notedisciplinari', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende i voti dello scrutinio dal registro Argo
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {string} data Data di cui prendere i dati
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @returns {*} Elenco dei voti scrutinio
     */
    async votiscrutinio (token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda) {
        return this.chiamata(token, codice, sceltaAccount, 'votiscrutinio', data, prgAlunno, prgScuola, prgScheda);
    }
    /**
     * Prende i compiti dal registro Argo
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {string} data Data di cui prendere i dati
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @returns {*} Elenco di campi
     */
    async compiti (token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda) {
        try {
            /**
             * @type Object[]
             */
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'compiti', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende gli argomenti dal registro Argo
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {string} data Data di cui prendere i dati
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @returns {*} Elenco degli argomenti
     */
    async argomenti (token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda) {
        try {
            /**
             * @type Object[]
             */
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'argomenti', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende i promemoria dal registro Argo
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {string} data Data di cui prendere i dati
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @returns {*} Elenco dei promemoria
     */
    async promemoria (token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda) {
        try {
            /**
             * @type Object[]
             */
            const dati = (await this.chiamata(token, codice, sceltaAccount, 'promemoria', data, prgAlunno, prgScuola, prgScheda)).dati;
            return dati;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    /**
     * Prende i docenti dal registro Argo
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {string} data Data di cui prendere i dati
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @returns {*} Elenco di tutti i docenti 
     */
    async docenti (token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda) {
        return this.chiamata(token, codice, sceltaAccount, 'docenticlasse', data, prgAlunno, prgScuola, prgScheda);
    }
    /**
     * Prende l'orario dal registro Argo
     * 
     * @author Gabriele Princiotta
     * @version 1.0
     * @method
     * @param {string} token Token dell'utente
     * @param {string} codice Codice scuola dell'utente
     * @param {number} sceltaAccount Scelta account dell'utente
     * @param {string} data Data di cui prendere i dati
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @returns {*} Orario attualmente registrato
     */
    async orario (token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda) {
        try {
            /**
             * @type Object[]
             */
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
     * @author Gabriele Princiotta
     * @version 1.0
     * @async
     * @method
     * @param {string} token
     * @param {string} codice
     * @param {number} sceltaAccount
     * @param {string} data
     * @param {*} prgAlunno
     * @param {*} prgScuola
     * @param {*} prgScheda
     * @returns {Object[]} Array di lementi della bacheca
     */
    async bacheca (token, codice, sceltaAccount, data, prgAlunno, prgScuola, prgScheda) {
        try {
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
                const cosaOggi = await this.chiamata(token, codice, sceltaAccount, 'oggi', dateFinoAOggi[i], prgAlunno, prgScuola, prgScheda);
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

module.exports = new DidUpApi();