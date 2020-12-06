// Maggiori informazioni su https://wspublic.axioscloud.it/AxiosPublicRest_Help.html

module.exports = {
    'baseURL': 'https://wspublic.axioscloud.it/webservice/AxiosPublicRest.svc',
    'loginURL': module.exports.baseURL + '/PublicLogin',
    'getURL': module.exports.baseURL + '/PublicRetrieveDataInformation',
    /**
     * Ritorna i dati da passare alla chiamata per effettuare il login
     * 
     * @param {string} codiceFiscale Codice fiscale della scuola
     * @param {string} user Username dell'utente
     * @param {string} pwd Passowrd dell'utente
     */
    'loginData': (codiceFiscale, user, pwd) => {
        return {
            JsonRequest: JSON.stringify({
                sCodiceFiscale: codiceFiscale,
                user: user,
                pwd: pwd
            })
        };
    },
    /**
     * Ritorna i dati da passare alla chiamata per ritornare i dati dell'utente
     * app uguale a "SD" è possibile passare i seguenti servizio
     * 
     *      servizio="USER_NOTIFICHE" che ritorna l'elenco delle notifiche disponibili per l'utente che ha fatto la richiesta
     *      servizio="USER_CALENDARIO" che ritorna l'elenco degli eventi del calendario disponibili per l'utente che ha fatto la richiesta
     * 
     * Valore app uguale a "FAM" è possibile passare i seguenti servizio
     * 
     *      servizio="GET_STUDENTI" che ritorna l'elenco degli alunni associati all'utente che ha fatto la richiesta
     *      servizio="GET_ORARIO_MASTER" che ritorna l'orario delle lezioni per tutti gli alunni associati all'utente che ha fatto la richiesta
     *      servizio="GET_COMPITI_MASTER" che ritorna i compiti assegnati per tutti gli alunni associati all'utente che ha fatto la richiesta
     *      servizio="GET_ARGOMENTI_MASTER" che ritorna gli argomenti delle lezioni trattati per tutti gli alunni associati all'utente che ha fatto la richiesta
     * 
     * Valore app uguale a "SC" è possibile passare i seguenti servizio
     * 
     *      servizio="ANAGRAFICHE_FORNITORI" che ritorna l'elenco dei fornitori
     *      servizio="ANAGRAFICHE_DIPENDENTI" che ritorna l'elenco dei dipendenti
     * 
     * @param {string} codiceFiscale Codice fiscale della scuola
     * @param {string} idSessione Id sessione ritornato dal login
     * @param {string} app Applicazione da cui prendere i dati
     * @param {string} servizio Servizio da chiamare
     */
    'getData': (codiceFiscale, idSessione, app, servizio) => {
        return {
            JsonRequest: JSON.stringify({
                sCodiceFiscale: codiceFiscale,
                sSessionGuid: idSessione,
                sCommandJSON: `${app}|${servizio}`
            })
        };
    }
};