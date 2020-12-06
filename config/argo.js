module.exports = {
    baseURL: `https://www.portaleargo.it/famiglia/api/rest`,
    loginURL: module.exports.baseURL + '/login',
    produttoreSoftware: 'ARGO Software s.r.l. - Ragusa',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36',
    keyApp: 'ax6542sdru3217t4eesd9',
    appCode: 'APF',
    version: '2.1.0',
    headers: (cod, user, pwd, token, prgScuola, prgScheda, prgAlunno) => {
        let obj = {
            'x-key-app': module.exports.keyApp,
            'x-version': module.exports.version,
            'user-agent': module.exports.userAgent,
            'x-produttore-software': module.exports.produttoreSoftware,
            'x-app-code': module.exports.appCode,
        };

        if(cod !== null && typeof cod !== 'undefined') {
            obj['x-cod-min'] = cod;
        }

        if(user !== null && typeof user !== 'undefined') {
            obj['x-user-id'] = user;
        }

        if(pwd !== null && typeof pwd !== 'undefined') {
            obj['x-pwd'] = pwd;
        }

        if(token !== null && typeof token !== 'undefined') {
            obj['x-auth-token'] = token;
        }

        if(prgScuola !== null && typeof prgScuola !== 'undefined') {
            obj['x-prg-scuola'] = prgScuola;
        }

        if(prgScheda !== null && typeof prgScheda !== 'undefined') {
            obj['x-prg-scheda'] = prgScheda;
        }

        if(prgAlunno !== null && typeof prgAlunno !== 'undefined') {
            obj['x-prg-alunno'] = prgAlunno;
        }
    }
};