import { DataGrid } from "https://eiagit.github.io/java/dataGrid.js";
import { Cxmsg } from "https://eiagit.github.io/java/cxmsg.js";
import utkit from  './utkit/utkit.js'
const menuIdUser = document.querySelector('#menuIdUser')
const menuNomeUser = document.querySelector('#menuNomeUser')

const maiorZIndex = () => {
    return Math.max(
        ...Array.form(
            document.querySelectorAll('body *'),
            (el) => { parseFloat(window.getComputedStyle(el).zIndex)}
                ).filter((zIndex) => { !Number.isNaN(zIndex) }) 
        ,0,);
}
const LoginUser = ()=>{
    const callLogin = async () => {
        const janelaLogin = await utkit.Login.janelaLogin(document.body, './img/eia_cl.png', () => { pesquisar({ 'login': 'Maria' }) }, 'Login')
    }
    const pesquisar = () => {
        if (utkit.Login.retorno.botao == 'mrLogin') {
            const apiColab = `${apiServer}usuario/login/?LOG_USER=${utkit.Login.retorno.user}&LOG_PASSWO=${utkit.Login.retorno.password}`
            fetch(apiColab)
                .then(res => res.json())
                .then(retorno => {
                    if (retorno.length <= 0) {
                        utkit.Login.writeMensagem('Usuario não Encontrado')
                    }
                    else {
                        sessionStorage.setItem('logUser', retorno[0].USO_NOME)
                        sessionStorage.setItem('logId', retorno[0].USO_ID)
                        menuIdUser.innerHTML = retorno[0].USO_ID;
                        menuNomeUser.innerHTML = retorno[0].USO_NOME
                        var tokValida =  new Date().getTime()
                        tokValida +=(60000*30)
                        const tokChave = utkit.criaCripito(tokValida.toString()+retorno[0].USO_ID)
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        var raw = JSON.stringify({'TOK_USUARI': retorno[0].USO_ID , 'TOK_CHAVE' : tokChave , 'TOK_VALIDA' : tokValida});
                        var requestOptions = {
                            method: 'POST',
                            mode: 'cors',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };
                        fetch(apiServer + 'token', requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                sessionStorage.setItem('userToken', result.TOK_CHAVE)
                            })
                            .catch(error => console.log('error', error));


                        utkit.Login.hide()
                    }
                })
        }
        if (utkit.Login.retorno.botao == 'mrGravar') {
            const apiColab = `${apiServer}usuario/email/?LOG_USER=${utkit.Login.retorno.user}`
            fetch(apiColab)
                .then(res => res.json())
                .then(retorno => {
                    if (retorno.length <= 0) {
                        utkit.Login.writeMensagem('Usário ou senha Errado')
                    }
                    else {
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        var raw = JSON.stringify({ 'LOG_ID': retorno[0].USO_ID, 'LOG_PASSWO': utkit.Login.retorno.password });
                        var requestOptions = {
                            method: 'PUT',
                            mode: 'cors',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };
                        fetch(apiServer + 'usuario/password', requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                if (retorno.length <= 0) {
                                    utkit.Login.writeMensagem('Usuario Não Encontrado')
                                }
                                else {
                                    utkit.Login.hide()
                                    callLogin()
                                }
                            })
                            .catch(error => console.log('error', error));

                    }
                })
        }
    }
    callLogin()    
}

const index = document.querySelector('#base')

