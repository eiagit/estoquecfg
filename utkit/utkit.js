const criaDivBase = (destino,nome) => {
    const divBase = document.createElement('div');
    divBase.setAttribute('id', nome);
    divBase.setAttribute('style', '');
    divBase.setAttribute('class', 'styBaseJanela');
    destino.append(divBase);
    return divBase
}
const criaGrupCampos = (destino,nome,classe)=>{
    const divGrupoCampos  = document.createElement('div');
    divGrupoCampos.setAttribute('id',nome);
    divGrupoCampos.setAttribute('class',classe);
    divGrupoCampos.setAttribute('style','');
    destino.appendChild(divGrupoCampos);
    return divGrupoCampos;
}
const criCampo = (destino,nome,classe,titulo)=>{
var divCampo  = document.createElement('div');
divCampo.setAttribute('id',nome);
divCampo.setAttribute('class','styDivCampo');
divCampo.setAttribute('style','');
destino.appendChild(divCampo);
var labCampo = document.createElement('label');
labCampo.setAttribute('id',nome);
labCampo.setAttribute('class','styCampLabel');
labCampo.setAttribute('style','');
labCampo.innerHTML=titulo
divCampo.appendChild(labCampo);
var inpCampo = document.createElement('Input');
inpCampo.setAttribute('id',nome);
inpCampo.setAttribute('class',classe);
inpCampo.setAttribute('style','');
inpCampo.setAttribute('type','text');
divCampo.appendChild(inpCampo);
return {'divCampo' : divCampo,'inpCampo' : inpCampo}
}
const criaInput = (destino,nome,classe,vinicial,titulo)=>{
    var divCampo  = document.createElement('div');
    divCampo.setAttribute('id',nome);
    divCampo.setAttribute('class','styDivCampo');
    divCampo.setAttribute('style','');
    destino.appendChild(divCampo);
    var inpCampo = document.createElement('Input');
    inpCampo.setAttribute('id',nome);
    inpCampo.setAttribute('class',classe);
    inpCampo.setAttribute('style','');
    inpCampo.setAttribute('type','text');
    inpCampo.setAttribute('placehoder',titulo)
    inpCampo.value=vinicial;
    divCampo.appendChild(inpCampo);
    return {'divCampo' : divCampo,'inpCampo' : inpCampo}
}
const criaLabel = (destino,nome,classe,titulo)=>{
    var divCampo  = document.createElement('div');
    divCampo.setAttribute('id',nome);
    divCampo.setAttribute('class','styDivCampo');
    divCampo.setAttribute('style','');
    destino.appendChild(divCampo);
    var labCampo = document.createElement('label');
    labCampo.setAttribute('id',nome);
    labCampo.setAttribute('class','styCampLabel');
    labCampo.setAttribute('style','');
    labCampo.innerHTML=titulo
    divCampo.appendChild(labCampo);
    return {'divCampo' : divCampo,'inpCampo' : labCampo}
}
const criSelect = (destino, nome, classe, titulo, opcoes) => {
    var divCampo = document.createElement('div');
    divCampo.setAttribute('id', nome);
    divCampo.setAttribute('class', 'styDivCampo');
    divCampo.setAttribute('style', '');
    destino.appendChild(divCampo);
    var labCampo = document.createElement('label');
    labCampo.setAttribute('id', nome);
    labCampo.setAttribute('class', 'styCampLabel');
    labCampo.setAttribute('style', '');
    labCampo.innerHTML = titulo
    divCampo.appendChild(labCampo);
    var inpCampo = document.createElement('Select');
    inpCampo.setAttribute('id', nome);
    inpCampo.setAttribute('class', classe);
    inpCampo.setAttribute('style', '');
    divCampo.appendChild(inpCampo);
    opcoes.map((ite, id) => {
        var inpCampos = document.createElement('option');
        inpCampos.innerHTML = ite
        inpCampo.appendChild(inpCampos);
    })
    return { 'divCampo': divCampo, 'selCampo': inpCampo }
}
const criaBotao = (destino,nome,botao,tamanhos,radius,cores,imagem,titulo,funcao)=>{
    const styBas=`
    width : ${tamanhos[0]}px;
    height: ${tamanhos[0]}px;
    cursor : pointer;
    `;
    const styOut =`
    display : flex;
    align-items : center;
    justify-content : center;
    width : ${tamanhos[0]}px;
    height: ${tamanhos[0]}px;
    border-radius : ${radius};
    background : ${cores[2] == 'gradial' ?  `linear-gradient(-45deg, ${cores[0]} 0%, ${cores[1]}  100%) ` : `${cores[0]}`} ;
    ${botao[1] ?  'box-shadow: 4px 4px 4px rgb(90, 90, 90);' :''} ;
    ${botao[0] == '3d' ? `border : ${botao[2]}px solid;border-color: #999 #000 #000 #999;` : ''} 
    `;
    const styIn =`
    display : flex;
    width : ${tamanhos[0]-tamanhos[1]}px;
    height: ${tamanhos[0]-tamanhos[1]}px;
    border-radius : ${radius};
    align-items: center;
    justify-content : center;
    background : ${cores[2] == 'gradial' ?  `linear-gradient(-45deg, ${cores[1]} 0%, ${cores[0]}  100%) ` : `${cores[0]}`} ;
    ` ;
    const styImg =`
    display: flex;
    flex-direction : row;
    width : ${tamanhos[0]-tamanhos[1]}px;
    height: ${tamanhos[0]-tamanhos[1]}px;
    justify-content : center;
    align-items : center;
    padding : 20%
    `;
    const corLuz = imagem[2].replace('rgb','rgba').replace(')',',0.45)')
    const styLuz =`
    width : 60%;
    height : 15%;
    margin-top : 15%;
    background-color : ${corLuz};
    border-radius : 50%
    `;
    const styBot = `padding : 10% ; width : 100%; height:100% ; color : ${imagem[1]}`;

    var divCampo  = document.createElement('div');
    divCampo.setAttribute('id',nome);
    divCampo.setAttribute('class','');
    divCampo.setAttribute('style',styBas);
    destino.appendChild(divCampo);
    
    var divOut  = document.createElement('div');
    divOut.setAttribute('id','out'+nome);
    divOut.setAttribute('class','botaox');
    divOut.setAttribute('style',styOut);
    divCampo.appendChild(divOut);
    
    var divIn  = document.createElement('div');
    divIn.setAttribute('id','in'+nome);
    divIn.setAttribute('class','botaox');
    divIn.setAttribute('style',styIn);
    divOut.appendChild(divIn);
    
    if (imagem[0]=='ion-icons'){
        var inpCampo = document.createElement('ion-icon');
        inpCampo.setAttribute('name',imagem[1])
        inpCampo.setAttribute('style',styImg)
        inpCampo.style.setProperty('color',imagem[2])
        divIn.appendChild(inpCampo);
    }
    if (imagem[0]=='google'){
        var inpCampo = document.createElement('SPAN');
        inpCampo.setAttribute('class','material-symbols-outlined')
        inpCampo.setAttribute('style',styImg)
        inpCampo.style.setProperty('color',imagem[2])
        inpCampo.style.setProperty('font-size' ,`${tamanhos[0]-tamanhos[1]}px`)
        inpCampo.innerHTML=imagem[1];
        divIn.appendChild(inpCampo);
    }
    if(imagem[0]==''){
        var inpCampo  = document.createElement('div');
        inpCampo.setAttribute('id','luz'+nome);
        inpCampo.setAttribute('class','');
        inpCampo.setAttribute('style',styLuz);
        divIn.appendChild(inpCampo);
        divIn.style.setProperty('align-items','flex-start')
    }
    if(imagem[0] =='file'){
    var inpCampo = document.createElement('img');
    inpCampo.setAttribute('id','img'+nome);
    inpCampo.setAttribute('class','');
    inpCampo.setAttribute('style',styImg);
    inpCampo.setAttribute('src',imagem[1])
    divIn.appendChild(inpCampo);}
    divCampo.addEventListener('click', funcao)
    divCampo.title=titulo
    return {'divCampo': divCampo ,'inpCampo' : inpCampo}
}
const criaBotaoRedondo = (destino, nome, classe, imagem, titulo, funcao) => {
    const divCampo = document.createElement('div');
    divCampo.setAttribute('id', nome);
    divCampo.setAttribute('class', 'divBotaoRedondo');
    divCampo.setAttribute('style','');
    destino.appendChild(divCampo);
    const inpCampo = document.createElement('input')
    inpCampo.setAttribute('id',  nome);
    inpCampo.setAttribute('class', classe);
    inpCampo.setAttribute('style', '');
    inpCampo.setAttribute('type', 'image');
    inpCampo.setAttribute('src', imagem);
    inpCampo.setAttribute('title', titulo);
    inpCampo.addEventListener('click', funcao)
    divCampo.appendChild(inpCampo);
    return  {'divCampo' : divCampo,'inpCampo' : inpCampo}
}
const criaBtnImgRedondo = (destino, nome, classe, imagem, titulo, funcao) => {
    const divCampo = document.createElement('div');
    divCampo.setAttribute('id',  nome);
    divCampo.setAttribute('class', 'divBotaoImgRedondo');
    divCampo.setAttribute('style','');
    destino.appendChild(divCampo);
    const inpCampo = document.createElement('input')
    inpCampo.setAttribute('id', nome);
    inpCampo.setAttribute('class', classe);
    inpCampo.setAttribute('style', '');
    inpCampo.setAttribute('type', 'image');
    inpCampo.setAttribute('src', imagem);
    inpCampo.setAttribute('title', titulo);
    inpCampo.addEventListener('click', funcao)
    divCampo.appendChild(inpCampo);
    return  {'divCampo' : divCampo,'inpCampo' : inpCampo}
}
const criaBtnImgQuadrado = (destino, nome, classe, imagem, titulo, funcao) => {
    const divCampo = document.createElement('div');
    divCampo.setAttribute('id', nome);
    divCampo.setAttribute('class', 'divBotaoImgQuadrado');
    divCampo.setAttribute('style','');
    destino.appendChild(divCampo);
    const inpCampo = document.createElement('input')
    inpCampo.setAttribute('id', nome);
    inpCampo.setAttribute('class', classe);
    inpCampo.setAttribute('style', '');
    inpCampo.setAttribute('type', 'image');
    inpCampo.setAttribute('src', imagem);
    inpCampo.setAttribute('title', titulo);
    inpCampo.addEventListener('click', funcao)
    divCampo.appendChild(inpCampo);
    return  {'divCampo' : divCampo,'inpCampo' : inpCampo}
}
const criaBotaoQuadrado = (destino,nome,classe,funcao) =>{
    const inpCampo = document.createElement('input')
    inpCampo.setAttribute('id', nome);
    inpCampo.setAttribute('class', classe);
    inpCampo.setAttribute('style', '');
    inpCampo.setAttribute('type','button')
    inpCampo.setAttribute('value', nome);
    inpCampo.addEventListener('click', funcao)
    destino.prepend(inpCampo);
    return inpCampo
}
const janelaPopup = (destino,titulo,onclose) => {
    const divPopFundo = criaDivBase(destino, 'divPopFundo');
    const divJanela = criaGrupCampos(divPopFundo, 'DivPJanela', 'styJanela')
    const divTitulo = criaGrupCampos(divJanela, 'DivPTitulo', 'styTitulo')
    const divFantasma = criaGrupCampos(divTitulo, 'DivPFantasma', '')
    const divTextoTitulo = criaGrupCampos(divTitulo, 'DivPTexto', '')
    divTextoTitulo.innerHTML = '<H2> ' + titulo + ' <h2>'

    const btnSair = criaBotaoRedondo(divTitulo, 'BtnPSair', 'styBtnRedondo', '../img/close.svg', 'Fechar Janela', () => { divPopFundo.remove() })
    btnSair.inpCampo.style.backgroundColor = 'red'
    divTitulo.style.flexDirection = 'row'
    divTitulo.style.justifyContent = 'space-between'
    const divDados = criaGrupCampos(divJanela, 'DivPDados', 'styDados')
    const divRodape = criaGrupCampos(divJanela, 'DivPRodape', 'styRodape')
    const hide = () =>{
        divPopFundo.remove();
        ()=>{onclose()}
    }
    document.addEventListener('keyup',(evt)=>{
        if (evt.key==='Escape') hide()
    })
    return divJanela
}
class Login {
    static retorno
    static campoMensagem = ''
    static divBaselogin = undefined
    static campoConfirma = undefined
    static campoPassword = undefined
    static loginTipo = undefined // Login Alterar Gravar
    static loginImage = undefined
    static janelaLogin = async (destino, logurl, funcao, tipo) => {
        this.loginTipo = tipo
        if (logurl == null || logurl == undefined) logurl = this.loginImage
        var comprimentoJanela = 180
        if (this.loginTipo == 'Gravar') comprimentoJanela = 215

        this.divBaselogin = criaDivBase(destino, 'JanelaLogin')

        const divJanelaLogin = criaGrupCampos(this.divBaselogin, 'janelaLogin', 'styDivCampo')
        divJanelaLogin.style = `displey:flex ;flex-direction : row; width : 400px !important ; height : ${comprimentoJanela}px !important;`

        const divDadosLogin = criaGrupCampos(divJanelaLogin, 'dadosLogin', 'styDivCampo')
        divDadosLogin.style = `flex-direction : column ; background-color : rgb(220,220,220);padding : 10px 10px 10px 10px; border-radius : 12px 0px 0px 12px; height : 100% !important;width : 200px !important; justify-content : center!important;`

        const divLogoLogin = criaGrupCampos(divJanelaLogin, 'logoLogin', 'styDivCampo')
        divLogoLogin.style = 'background-color : rgb(190,190,190);align-items : center ; justify-content : center  ; padding : 15px;border-radius : 0px 12px 12px 0px;height : 100%; width : 200px !important; ';

        if (tipo != 'Alterar') {
            this.campoUser = criCampo(divDadosLogin, "User", 'styCampInput', "User Name")
            this.campoUser.divCampo.style.marginTop = '10px'
            this.campoUser.inpCampo.focus()
        }
        this.campoPassword = criCampo(divDadosLogin, "Password", 'styCampInput', "Password")
        this.campoPassword.inpCampo.setAttribute('type', 'password')

        if (tipo != 'Login') {
            this.campoConfirma = criCampo(divDadosLogin, "Confirma", 'styCampInput', "Confirma Password")
            this.campoConfirma.inpCampo.setAttribute('type', 'password')
        }

        var botaoPressionado = undefined
        const divBotoes = criaGrupCampos(divDadosLogin, 'Botoes', 'styDivCampo')

        divBotoes.style = 'flex-Direction : row ; justify-content : center; gap : 15px ;margin-top : 10px'

        var txtBntCancelar = undefined
        txtBntCancelar = "Cancelar"
        if (tipo == 'Login') txtBntCancelar = 'Cadastrar'
        const btnCancel = criaBotaoQuadrado(divBotoes, txtBntCancelar, 'styBtn', () => { })
        btnCancel.addEventListener('click', (ele => {
            this.hide()
            if (tipo == 'Login') this.janelaLogin(destino, logurl, funcao, 'Gravar');
            if (tipo == 'Gravar') this.janelaLogin(destino, logurl, funcao, 'Login');
        }))

        const btnLogin = criaBotaoQuadrado(divBotoes, tipo , 'styBtn', () => { })
        btnLogin.addEventListener('click', (evt) => {
            botaoPressionado = 'mr' + tipo
            var objetoRetorno = undefined
            var ok = false
            
            if (tipo == 'Login') { objetoRetorno = { 'user': this.campoUser.inpCampo.value, 'password': this.campoPassword.inpCampo.value, 'botao': botaoPressionado }; ok = this.verifica() }

            if (tipo == 'Gravar') { objetoRetorno = { 'user': this.campoUser.inpCampo.value, 'password': this.campoPassword.inpCampo.value, 'botao': botaoPressionado }; ok = this.verifica() }

            if (tipo == 'Alterar') { objetoRetorno = { 'password': this.campoPassword.inpCampo.value, 'botao': botaoPressionado }; ok = this.verifica() }

            this.retorno = objetoRetorno

            if (ok) funcao();
        })

        this.campoMensagem = document.createElement('label')
        this.campoMensagem.setAttribute('id', 'passwordMensagem')
        this.campoMensagem.setAttribute('class', 'login.mensagem')
        this.campoMensagem.innerHTML = ''
        divDadosLogin.appendChild(this.campoMensagem)

        const logo = document.createElement('img')
        logo.setAttribute('src', logurl)
        logo.style = 'display : flex ; width : 100%; height : 100%;'
        divLogoLogin.appendChild(logo)
    }
    static hide = () => {
        this.divBaselogin.remove()
    }
    static writeMensagem = (mensagem) => {
        this.campoMensagem.innerHTML = mensagem
    }
    static verifica = () => {
        var dadosOk = true
        if (this.loginTipo != 'Login' && this.campoPassword.inpCampo.value != this.campoConfirma.inpCampo.value ) {
            this.writeMensagem('Snhas não conferem')
            dadosOk = false
            this.campoPassword.inpCampo.focus()
        } 
        if (this.campoPassword==''){
            this.writeMensagem('Campo Vazio')
            dadosOk=false;
            this.campoPassword.inpCampo.focus()
        }
        if (this.loginTipo !='Login' && this.campoConfirma=='' ){
            this.writeMensagem('Campo Vazio')
            dadosOk=false;
            this.campoConfirma.inpCampo.focus()
        }
        if (this.loginTipo != 'Alterar' && this.campoUser=='' ){
            this.writeMensagem('Campo Vazio')
            dadosOk=false;
            this.campoUser.inpCampo.focus()
        }
        return dadosOk           
    }
    static logoffUser = () =>{
        sessionStorage.clear()
        localStorage.clear()
        MenuFlutuante.hide()
        Login.janelaLogin(document.body , null, ()=>{}, 'Login')
    }    
}
class MenuFlutuante {
    static dgDados = undefined;
     
    static show = (dgDados) => {
        this.dgDados=dgDados
        if (document.querySelector('#baseMenuSuspenso')!=undefined){
            this.hide()
        }
        const baseMenuSuspenso = document.createElement('DIV')
        baseMenuSuspenso.setAttribute('id', 'baseMenuSuspenso')
        baseMenuSuspenso.setAttribute('class', 'baseMenuSuspenso')
        const bms = 'dispaly : flex;'
        +' position: relative ;'
        +' align-items: center;'
        +' justify-content: center;'
        +' flex-direction: column;'
        +` top : ${this.dgDados.top};`
        +` left : ${this.dgDados.left};`
        +` width: ${this.dgDados.width};`
        +' height: 20px;'
        +' backgroud-color : red;'
        +' z-index : 500'
        baseMenuSuspenso.setAttribute('style', bms)
        this.dgDados.destino.append(baseMenuSuspenso)

        const msSeta = document.createElement('DIV')
        msSeta.setAttribute('id','msSeta')
        msSeta.setAttribute('class','msSeta')
        const styMss = 'position : relative;display: flex;left : 80%;width: 20px;height: 20px;top : 10px !important;rotate: 45deg;background-color : rgb(233, 233, 233);z-index:-1;'
        msSeta.setAttribute('style',styMss)
        baseMenuSuspenso.prepend(msSeta)

        const msItens = document.createElement('DIV')
        msItens.setAttribute('id', 'msItens')
        msItens.setAttribute('class', 'msItens')
        const styMsi    ='display : flex ;flex-direction : column ;width :100% !important;height : fit-content; width : fit-content ; background-color : rgb(233, 233, 233);'
        msItens.setAttribute('style',styMsi)
        baseMenuSuspenso.appendChild(msItens)

        ///////// acrescentar no arquivo css ///////////
        // .msoItem:hover{
        //     background-color: rgb(220, 220, 220) !important;
        //     animation: .02;   
        // }

        const styMso =   'display: flex;cursor: pointer;align-items: center;justify-content: flex-start;flex-direction: row;margin-bottom: 0px;width :100%;height: 30px !important;background-color: rgb(233, 233, 233);'
        const styMsImg = 'display: flex;margin-left :7px;'
        const styMsLab = 'font-weight :normal;font-size : large;display: flex;cursor : pointer;width: 100%;margin-left: 10px;color: rgb(109, 109, 109);text-align : center;'
        this.dgDados.opcoes.map((ite,id)=>{
            const msoItem = document.createElement('Div')
            msoItem.setAttribute('id','ite'+ite.nome)
            msoItem.setAttribute('class','msoItem')
            msoItem.setAttribute('style',styMso)
            msItens.appendChild(msoItem)

            const msoImg = document.createElement('img')
            msoImg.setAttribute('id','img'+id)
            msoImg.setAttribute('class','msoImgItem')
            msoImg.setAttribute('style',styMsImg)
            msoImg.setAttribute('src',ite.src)
            msoItem.appendChild(msoImg)

            const msoLab = document.createElement('label')
            msoLab.setAttribute('id','msLab'+id);
            msoLab.setAttribute('class','msoLabItem')
            msoLab.setAttribute('style',styMsLab)
            msoLab.innerHTML=ite.nome
            msoItem.appendChild(msoLab)

            msoItem.addEventListener('click',(evt)=>{
                ite.acao()
            })
        })
    }
    static hide = () => {
       baseMenuSuspenso.remove()

    }
}
class LoginUser {
    
    static imgLocal= undefined
    static loginLuId = undefined
    static LoginLuNome = undefined
    static tokenAtual = undefined
    static tokenValidade = (60000*100)
    static callLogin = async (apiServer) => {
        const janelaLogin = await Login.janelaLogin(document.body, this.imgLocal, () => { this.pesquisar(apiServer) }, 'Login')
    }
    static pesquisar = (apiServer) => {
        if (Login.retorno.botao == 'mrLogin') {
            const apiColab = apiServer+`usuario/login/?LOG_USER=${Login.retorno.user}&LOG_PASSWO=${Login.retorno.password}`
            fetch(apiColab)
                .then(res => res.json())
                .then(retorno => {
                    if (retorno.length <= 0) {
                        Login.writeMensagem('Usuario não Encontrado')
                    }
                    else {
                        sessionStorage.setItem('logUser', retorno[0].USO_NOME)
                        sessionStorage.setItem('logId', retorno[0].USO_ID)
                        if (window.location.pathname.indexOf('/') >=0){
                            document.querySelector('#menuIdUser').innerHTML = retorno[0].USO_ID;
                            document.querySelector('#menuNomeUser').innerHTML = retorno[0].USO_NOME;
                        }

                        this.loginLuId = retorno[0].USO_ID;
                        this.LoginLuNome = retorno[0].USO_NOME;

                        var tokValida =  new Date().getTime()
                        tokValida += this.tokenValidade

                        const tokChave = criaCripito(tokValida.toString()+retorno[0].USO_ID)
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
                                sessionStorage.setItem('userToken', result[0].TOK_CHAVE)
                            })
                            .catch(error => console.log('error', error));
                        Login.hide()
                    }
                })
        }
        if (Login.retorno.botao == 'mrGravar') {
            const apiColab = `${apiServer}usuario/email/?LOG_USER=${Login.retorno.user}`
            fetch(apiColab)
                .then(res => res.json())
                .then(retorno => {
                    if (retorno.length <= 0) {
                        Login.writeMensagem('Usário ou senha Errado')
                    }
                    else {
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        var raw = JSON.stringify({ 'LOG_ID': retorno[0].USO_ID, 'LOG_PASSWO': Login.retorno.password });
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
                                    Login.writeMensagem('Usuario Não Encontrado')
                                }
                                else {
                                    Login.hide()
                                    callLogin(apiServer)
                                }
                            })
                            .catch(error => console.log('error', error));

                    }
                })
        }
    }
    static prorrogaToke = (apiServer) =>{
        var tokValida =  new Date().getTime()
        tokValida = (this.tokenValidade / 6000)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({'TOK_CHAVE' : this.tokenAtual , 'TOK_VALIDA' : tokValida});
        var requestOptions = {
            method: 'PUT',
            mode: 'cors',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(apiServer + 'token', requestOptions)
            .then(response => response.json())
            .then(result => {
            })
            .catch(error => console.log('error', error));        
    }
    static limpaTokenVencido = ()=>{
        var tokValida =  new Date().getTime()
        tokValida += this.tokenValidade        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({});
        var requestOptions = {
            method: 'DELETE',
            mode: 'cors',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(apiServer + 'token', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
            .catch(error => console.log('error', error));        
    }
    static checkaToken = (api)=>{
        if (api.indexOf('null')>=0) {
            return new Promise((resolve, reject )=> {resolve(false)})
        };
        return fetch(api)
            .then(res => res.json())
            .then(retorno => {
                if (retorno.length > 0) {
                    return true
                } else {  return false }})
            .catch(error => console.log('error', error));
    }            
}
const criaCripito = (sen)=>{
    sen = String(sen)
    var res = undefined;
    var num = undefined;
    var P01 = undefined;
    var P02 = undefined;
    var tam =0 ;
    var cal = '';
    tam = sen.length;
       res = '';
       while (tam>0) {
          cal = sen.charCodeAt(tam-1)
          cal =(cal*2)+18-((tam-1)*2);
          num = cal.toString().padStart(3, '0')
          P01 =num[0]+num[1];
          P02 =num[2];
          const C01 = String.fromCharCode(parseInt(P01)+40)
          const C02 = String.fromCharCode(parseInt(P02)+40)
          res =C01+C02+res;
          tam --;
       }
       return res;    
}
const checkaTokenX = (api)=>{
    return fetch(api)
        .then(res => res.json())
        .then(retorno => {
            if (retorno.length > 0) {
                return true
            } else { return false }})
        .catch(error => console.log('error', error));
}

export default {janelaPopup,
    criaBotao,
    criaBtnImgRedondo,
    criaBtnImgQuadrado,
    criaBotaoQuadrado,
    criaBotaoRedondo,
    criaDivBase,
    criaLabel,
    criaInput,
    criSelect, 
    criCampo,
    criaGrupCampos,
    criaCripito,
    checkaTokenX,
    LoginUser,
    Login,
    MenuFlutuante,

}
