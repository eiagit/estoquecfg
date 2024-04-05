import { DataGrid } from "https://eiagit.github.io/DataGrid/src/dataGrid.js";
//import { DataGrid } from "../../../dataGrid.js";
import { Cxmsg } from "https://eiagit.github.io/java/cxmsg.js";
import utkit from  './../utkit/utkit.js'
const janelaGrid = document.querySelector('#dataGridJ')
const btnCadastrar = document.querySelector('#colabCadastrar')
const btncolabPesquisar  = document.querySelector('#colabPesquisar')
const filtro = document.querySelector('#inputFiltro')
const apiServer = sessionStorage.getItem('servidor')

const tokenOk = async ()=>{
    const api = apiServer+`token?TOK_USUARI=${sessionStorage.getItem('logId')}&TOK_CHAVE=${sessionStorage.getItem('userToken')}`
    var retorno = undefined
    await utkit.LoginUser.checkaToken(api)
    .then( (retor)=>{
        retorno = retor
    })
    try{
    if(retorno) {
        utkit.LoginUser.tokenAtual = sessionStorage.getItem('userToken')
        utkit.LoginUser.tokenValidade = (6000*100)
        utkit.LoginUser.prorrogaToke()
        }
        else {
            utkit.LoginUser.imgLocal= '../img/eia_cl.png'
            utkit.LoginUser.tokenValidade = (6000*100)
            await utkit.LoginUser.callLogin()
        }
    }catch{
        utkit.LoginUser.imgLocal= '../img/eia_cl.png'
        utkit.LoginUser.tokenValidade = (6000*100)
        await utkit.LoginUser.callLogin()
    }
}
tokenOk()

const dgDados={
    destino : '#dataGridJ',
    local   : 'pt-br'   ,
    moeda   : 'BRL'     ,
    funcoes: {
        "grid"   : { "linha" : "v" , "cor" : "RGB(220,220,220)"},
        "filtro" : { "hide" : false , "campo" : 1 ,selectHide : false},
        "rodape" : { "hide" : false},
        "onclose" : { "hide" : false , "funcao" : ()=>{}},
        "titulo" : { "hide" : false , "cor"   : "#49F"},
        "acoes"  : { "hide" : false , "titulo": "Ações", "width": "90px", "align": "center","material" : 'ion-icon' ,'clicklinha' : ()=>{} },        
        icones : {
            switch : { hide: false  , name: 'lock-open-outline', func: ()=>{toggleAtivar()}},
            edit   : { hide: false  , name: 'pencil-outline'   , func: ()=>{alterar()}},
            delete : { hide: false  , name: 'trash-outline'    , func: ()=>{apagar()}},
            view   : { hide: false  , name: 'call-outline'     , func: ()=>{listaTelefones()}},
            photo  : { hide: false  , name: 'camera-outline'   , func: ()=>{mostraFoto()}},
        }
    },
    campos: [
        { campo : 'USO_ID'    , titulo: 'Id'                    , formato: 'g'   , width: '50px' , align: 'left', soma : false},
        { campo : 'USO_NOME'  , titulo: 'Nome Pessoa'      , formato: 'g'   , width: '300px', align: 'left', soma : false},
        { campo : 'USO_STANOM', titulo: 'Status'                , formato: 'g'   , width: '70px', align: 'left', soma : false},
        { campo : 'TIU_NOME'  , titulo: 'Tipo'                  , formato: 'g'   , width: '170px', align: 'left', soma : false},        
    ]
}
var listaTipoUsuario = []
const apiTipoUsuario = apiServer+"tabelas/tipousuario"
fetch(apiTipoUsuario)
.then(res=>res.json())
.then(retorno=>{
    listaTipoUsuario=retorno;
})

const carregaColaboradores = () => {
    const apiColab = apiServer+"usuario/todos"
    fetch(apiColab)
        .then(res => res.json())
        .then(retorno => {
            DataGrid.criaLista(dgDados, retorno)
//            setTimeout(() => {
                retorno.map((ite, id) => {
                    if (ite.USO_STATUS == 0) {
                        document.querySelector('#dgLinha'+id).lastChild.firstChild.name='lock-closed-outline'
                        document.querySelector('#dgLinha'+id).lastChild.firstChild.style.color="red"
                    }
                    else{document.querySelector('#dgLinha'+id).lastChild.firstChild.style.color="green"}
                })
//            }, 2000);
        })
}
carregaColaboradores()

var telefonesDoUsuario = undefined
const carregaTelefones = async (usuID) => {
    const apiColab = apiServer+"telefone/?TEL_USUARI="+usuID
    await fetch(apiColab)
        .then(res => res.json())
        .then(retorno => {
                telefonesDoUsuario = retorno
                return retorno
            })
}

const apagaUmTelefone = async(teluso)=>{
    console.log(teluso)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(teluso);
    var requestOptions = {
        method: 'DELETE',
        mode: 'cors',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    setTimeout( async() => {
        await fetch(apiServer+"telefone/apagaum", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
            .catch(error => console.log('error', error));
        },300)
}

const inserirTelefone = async (colabId,telcolab)=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(colabId)
    var raw = JSON.stringify({ "TEL_USUARI": colabId , "TEL_TELEFO": telcolab[0], "TEL_DDD": telcolab[1]});
   console.log(raw)
    var requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiServer+"telefone", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
        })
        .catch(error => console.log('error', error));
}

const refreshLista=()=>{
    const janelaBase = document.querySelector('#divBaseJanela')
       if(janelaBase)janelaBase.remove()
        DataGrid.hideLista(dgDados)
        carregaColaboradores()
}

const apagar = () => {
    const config = {
        cor: "rgb(136, 223, 223)",
        tipo: 'mbsim,mbnao', // mbsim,mbnao,mbcancela
        btnretorno: 'mrsim',
    }
    Cxmsg.retorno = null
    Cxmsg.show(config,
        "Confirma Apagar o Resistro",
        'Tem certeza que quer apagar os dados de ' + dgDados.campoRetorno[1]['innerHTML'],
        ['mbsim', 'mbnao'], () => { resposta() })
}
const resposta = async() => {
    if (Cxmsg.mr() == 'mrsim') {
        // APAGA USUARIO
        const apagaCobab = () => {
            console.log('entrou no apagar usuário')
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({ "USO_ID": usuario });

            var requestOptions = {
                method: 'DELETE',
                mode: 'cors',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch(apiServer + "colaborador", requestOptions)
                .then(response => response.text())
                .then(result => {
                    refreshLista()
                })
                .catch(error => console.log('error', error));
        }
        const usuario = parseInt(dgDados.campoRetorno[0]['innerHTML'])
        // APAGA OS TELEFONES
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "TEL_USUARI" : usuario });
        var requestOptions = {
            method: 'DELETE',
            mode: 'cors',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        await fetch(apiServer+"telefone/apagatodos", requestOptions)
                .then(response => response.text())
                .then(result => {
                    apagaCobab()
                })
                .catch(error => console.log({'error': error}));

    }
}
   
const janelaColab = () => {
    const divBaseJanela = document.createElement('div');
    const styBaseJanela =
        'display : flex;' +
        'justify-content :center;' +
        'align-items : center;' +
        'position : absolute;' +
        'top : 0px;' +
        'left : 0px;' +
        'width : 100%;' +
        'height : 100vh;' +
        'background-color : rgba(0,0,0,0.7);' +
        'z-index : 9099999999';
    divBaseJanela.setAttribute('id', 'divBaseJanela');
    divBaseJanela.setAttribute('style', styBaseJanela);
    divBaseJanela.setAttribute('class', 'styLJanela');
    document.body.appendChild(divBaseJanela);

    const divJanela = document.createElement('div');
    divJanela.setAttribute('id', 'divJanela');
    const styJanela = 'display : flex;'
        + 'justify-content : flex-start;'
        + 'align-items : flex-start;'
        + 'flex-direction : column;'
        + 'width : 500px;'
    divJanela.setAttribute('style', styJanela);
    divBaseJanela.appendChild(divJanela);

    const divTitulo = document.createElement('div');
    const styTitulo = 'display: flex;'
        + 'justify-content: center;'
        + 'align-items: center;'
        + 'flex-direction: colum;'
        + 'background-color: #248;'
        + 'color:white;'
        + 'border-radius: 15px 15px 0 0;'
        + 'width : 100%;'
        + 'height: 50px;'
        + 'padding:  5px 3px 5px 3px'
    divTitulo.setAttribute('id', 'divTitulo');
    divTitulo.setAttribute('class', 'styLTitulo');
    divTitulo.setAttribute('style', styTitulo)
    divTitulo.innerHTML = '<h3> Altera Colaborador</h3>'
    divJanela.appendChild(divTitulo);

    const divDados = document.createElement('div');
    divDados.setAttribute('id', 'divDados');
    const styDados = 'display : flex;'
        + 'justify-content : flex-start;'
        + 'align-items : flex-start;'
        + 'flex-direction : column;'
        + 'width : 100%;'
        + 'background-color : rgb(245,245,245) !important;'
        + 'padding : 5px 5px 5px 5px;';
    divDados.setAttribute('style', styDados);
    divDados.setAttribute('class', 'styLDados');
    divJanela.appendChild(divDados);

    const styDivCampos = 'display : flex;'
        + 'justify-content : flex-start;'
        + 'align-itens : flex=start;'
        + 'flex-direction : column;'
        + 'width : 100%;'
        + 'color : #000;'
        + 'padding : 3px;';
    const styInput = 'displey: flex ;'
        + 'width : 100%'
        + 'padding : 3px'
    const styLabel = 'displey: flex ;'
    const stySelect = 'displey: flex ;'
        + 'width : 100%'
        + 'padding : 3px'

    var divCampos = document.createElement('div');
    divCampos.setAttribute('id', 'divCID');
    divCampos.setAttribute('class', 'styDivCampos');
    divCampos.setAttribute('style', styDivCampos);
    divDados.appendChild(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id', 'labCId');
    labCampos.setAttribute('class', 'stylabCampos');
    labCampos.setAttribute('style', styLabel);
    labCampos.innerHTML = 'Id'
    divCampos.appendChild(labCampos);
    var inpCampos = document.createElement('Input');
    inpCampos.setAttribute('id', 'inpCId');
    inpCampos.setAttribute('class', 'styinpCampos');
    inpCampos.setAttribute('style', styInput);
    inpCampos.setAttribute('type', 'number');
    inpCampos.setAttribute('readonly', 'true');
    divCampos.appendChild(inpCampos);

    var divCampos = document.createElement('div');
    divCampos.setAttribute('id', 'divCNome');
    divCampos.setAttribute('class', 'styDivCampos');
    divCampos.setAttribute('style', styDivCampos);
    divDados.appendChild(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id', 'labCNome');
    labCampos.setAttribute('class', 'stylabCampos');
    labCampos.setAttribute('style', styLabel);
    labCampos.innerHTML = 'Nome'
    divCampos.appendChild(labCampos);
    var inpCampos = document.createElement('Input');
    inpCampos.setAttribute('id', 'inpCNome');
    inpCampos.setAttribute('class', 'styinpCampos');
    inpCampos.setAttribute('style', styInput);
    inpCampos.setAttribute('type', 'text');
    divCampos.appendChild(inpCampos);

    const styDivCamposSelect = 'display : flex;'
        + 'align-items : flex-start;'
        + 'justify-content : flex-start;'
        + 'flex-direction : row;'
        + 'width : 100%;'
        + 'gap : 5px;'
    const divCamposSelect = document.createElement('div');
    divCamposSelect.setAttribute('id', 'divCNome');
    divCamposSelect.setAttribute('class', 'styDivCampos');
    divCamposSelect.setAttribute('style', styDivCamposSelect);
    divDados.appendChild(divCamposSelect);

    var divCampos = document.createElement('div');
    divCampos.setAttribute('id', 'divCStatus');
    divCampos.setAttribute('class', 'styDivCampos');
    divCampos.setAttribute('style', styDivCampos);
    divCamposSelect.appendChild(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id', 'labCStatus');
    labCampos.setAttribute('class', 'stylabCampos');
    labCampos.setAttribute('style', styLabel);
    labCampos.innerHTML = 'Status'
    divCampos.appendChild(labCampos);

    var inpCampos = document.createElement('select');
    inpCampos.setAttribute('id', 'inpCStatus');
    inpCampos.setAttribute('class', 'stySelCampos');
    inpCampos.setAttribute('style', stySelect);
    divCampos.appendChild(inpCampos);
    var checkOpcao = document.createElement('option')
    checkOpcao.setAttribute('class', 'sysCoptions');
    checkOpcao.setAttribute('style', 'diplay:flex;');
    checkOpcao.innerHTML = 'Inativo'
    inpCampos.appendChild(checkOpcao);
    var checkOpcao = document.createElement('option')
    checkOpcao.setAttribute('class', 'sysCoptions');
    checkOpcao.setAttribute('style', 'diplay:flex;');
    checkOpcao.innerHTML = 'Ativo'
    inpCampos.appendChild(checkOpcao);

    var divCampos = document.createElement('div');
    divCampos.setAttribute('id', 'divCTipo');
    divCampos.setAttribute('class', 'styDivCampos');
    divCampos.setAttribute('style', styDivCampos);
    divCamposSelect.appendChild(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id', 'labCTipo');
    labCampos.setAttribute('class', 'stylabCampos');
    labCampos.setAttribute('style', styLabel);
    labCampos.innerHTML = 'Tipo de Usuário'
    divCampos.appendChild(labCampos);
    var inpCampos = document.createElement('select');
    inpCampos.setAttribute('id', 'inpCTipo');
    inpCampos.setAttribute('class', 'stySelCampos');
    inpCampos.setAttribute('style', stySelect);
    divCampos.appendChild(inpCampos);
    listaTipoUsuario.map((dat, id) => {
        var checkOpcao = document.createElement('option')
        checkOpcao.setAttribute('class', 'sysCoptions');
        checkOpcao.setAttribute('style', 'diplay:flex;');
        checkOpcao.innerHTML = dat.TIU_NOME
        inpCampos.appendChild(checkOpcao);
    })

    const grupoL2 = utkit.criaGrupCampos(divDados, 'GrupoL2', 'styGrupCampos')
    const CampoLogin = utkit.criCampo(grupoL2, 'inpCLogin', 'styCampInput', "Login")
    const CampoPassword = utkit.criCampo(grupoL2, 'inpCPassword', 'styCampInput', "Senha")

    var divCampos = document.createElement('div');
    divCampos.setAttribute('id', 'divCFoto');
    divCampos.setAttribute('class', 'styDivCampos');
    divCampos.setAttribute('style', styDivCampos);
    divDados.appendChild(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id', 'labCNome');
    labCampos.setAttribute('class', 'stylabCampos');
    labCampos.setAttribute('style', styLabel);
    labCampos.innerHTML = 'Foto do Usáriou'
    divCampos.appendChild(labCampos);
    var inpCampos = document.createElement('Input');
    inpCampos.setAttribute('id', 'inpCFoto');
    inpCampos.setAttribute('class', 'styinpCampos');
    inpCampos.setAttribute('style', styInput);
    inpCampos.setAttribute('type', 'file');
    inpCampos.setAttribute('accept', 'image/png, image/jpeg, image/jpg')
    divCampos.appendChild(inpCampos);

    const eleFoto = inpCampos;
    eleFoto.addEventListener('change', (evt) => {
        janelaPopup()
        const janTitulo = document.querySelector('#janTitulo')
        const janDados = document.querySelector('#JanDivDados')
        janDados.style.justifyContent = 'center'
        janDados.style.alignItems = 'center'
        janTitulo.innerHTML = "<f2>Foto<F2>";
        const styDivJanFoto = 'display : flex;'
            + 'align-items : center;'
            + 'justify-content : center;'
            + 'width : 200px;'
            + 'height : 266px;'
            + 'flex-wrap : wrap;'
            + 'object-fit: cover;'
            + 'position: relative;'
            + 'overflow: hidden;'
        const styImgJanFoto = 'display : flex;'
        'width : 100%;'
        'height : 100%'
        var divCampos = document.createElement('div');
        divCampos.setAttribute('id', 'divJanFoto');
        divCampos.setAttribute('class', 'styDivJanFoto');
        divCampos.setAttribute('style', styDivJanFoto);
        janDados.appendChild(divCampos);
        var imgCampos = document.createElement('img');
        imgCampos.setAttribute('id', 'imgJanFoto');
        imgCampos.setAttribute('class', 'styDivJanfoto');
        imgCampos.setAttribute('style', styImgJanFoto);
        divCampos.appendChild(imgCampos);
        converteImagemBase64(imgCampos, evt.target.files[0])
    })

    var divCampos = document.createElement('div');
    divCampos.setAttribute('id', 'divCTelefone');
    divCampos.setAttribute('class', 'styDivCampos');
    divCampos.setAttribute('style', styDivCampos);
    divDados.appendChild(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id', 'labCNome');
    labCampos.setAttribute('class', 'stylabCampos');
    labCampos.setAttribute('style', styLabel);
    labCampos.innerHTML = 'Telefone'
    divCampos.appendChild(labCampos);
    var inpCampos = document.createElement('Input');
    inpCampos.setAttribute('id', 'inpCTelefone');
    inpCampos.setAttribute('class', 'styinpCampos');
    inpCampos.setAttribute('style', styInput);
    inpCampos.setAttribute('type', 'text');
    divCampos.appendChild(inpCampos);
    const inpTelefone = document.querySelector('#inpCTelefone');

    const styDivTelefones =
        'display : flex;'
        + 'justify-content : flex-start;'
        + 'align-items : flex-start;'
        + 'flex-direction : row;'
        + 'border-radius : 5px;'
        + 'width : 100%;'
        + 'padding : 5px;'
        + 'background-color : white;'
        + 'flex-wrap: wrap;'
        + 'gap : 5px'
    const styDivTelefone = 'display : flex;'
        + 'align-items : center;'
        + 'justify-content : flex-start;'
        + 'flex-direction : row;'
        + 'width : 155px;'
        + 'padding : 2px 0 2px 0 ;'
        + 'border-radius : 8px 8px 8px 8px;'
        + 'background-color: rgb(235,235,235);'
    const styImgTel = 'background-color : red !important;'
        + 'height : 25px;'
        + 'width : 25px;'
        + 'padding : 0 2px 0 2px;'
        + 'margin : 0px 3px 0px 3px;'
    const divCTelefones = document.createElement('div');
    divCTelefones.setAttribute('id', 'divCTelefones');
    divCTelefones.setAttribute('class', 'styDivTelefones');
    divCTelefones.setAttribute('style', styDivTelefones);
    divDados.appendChild(divCTelefones);

    inpTelefone.addEventListener('keyup', (evt) => {
        if (evt.key == 'Enter') {
            const divCampoTelefone = document.createElement('div');
            divCampoTelefone.setAttribute('id', 'divCTelefone');
            divCampoTelefone.setAttribute('class', 'styDivCampos');
            divCampoTelefone.setAttribute('style', styDivTelefone);
            divCTelefones.appendChild(divCampoTelefone);

            const imgTrashTelefone = document.createElement('input');
            imgTrashTelefone.setAttribute('id', 'inpImgTelefone');
            imgTrashTelefone.setAttribute('class', 'btnMenu');
            imgTrashTelefone.setAttribute('style', styImgTel);
            imgTrashTelefone.setAttribute('type', 'image');
            imgTrashTelefone.setAttribute('src', '../img/trash.svg')
            divCampoTelefone.appendChild(imgTrashTelefone);
            imgTrashTelefone.addEventListener('click', (evt) => {
                evt.target.parentNode.remove()
            })

            var divCampos = document.createElement('div');
            divCampos.setAttribute('id', 'divTelefoneAdd');
            divCampos.setAttribute('class', 'styDivTelefones');
            divCampos.setAttribute('style', '');
            divCampos.innerHTML = inpTelefone.value
            divCampoTelefone.appendChild(divCampos);


            if (divTitulo.innerHTML == 'Alterar Usuário') {
                const telefone = inpTelefone.value
                const inidd = telefone.indexOf('(')
                const findd = telefone.indexOf(')')
                const ddd = telefone.substring(inidd + 1, findd)
                inserirTelefone(document.querySelector('#inpCId').value, [inpTelefone.value, ddd])
            }
            evt.target.value = ''
        }
    })


    divDados.setAttribute('style', styDados);
    divDados.setAttribute('class', 'styLDados');
    divJanela.appendChild(divDados);

    const divRodape = document.createElement('div');
    const styRodape = 'display: flex;'
        + 'justify-content: center;'
        + 'align-items: flex-start;'
        + 'flex-direction: row;'
        + 'background-color: #248;'
        + 'color:white;'
        + 'border-radius: 0 0 10px 10px;'
        + 'width : 100%;'
        + 'gap: 10px;'
        + 'padding:  5px 3px 5px 3px;'
    divRodape.setAttribute('id', 'divRodape');
    divRodape.setAttribute('class', 'styLRodape');
    divRodape.setAttribute('style', styRodape)
    divJanela.appendChild(divRodape);

    const styBtn = 'display: flex;'
        + 'flex-direction: row;'
        + 'align-items: center;'
        + 'border-radius: 5px;'
        + 'cursor: pointer;'
        + 'padding: 5px;'
        + 'width: 70px;'
        + 'background-color: #248;'
        + 'color: white;'
        + 'border: 1px solid;'
        + 'border-color: #999 #000 #000 #999;'
    const btncancela = document.createElement('input');
    btncancela.setAttribute('id', 'btncancela');
    btncancela.setAttribute('type', 'Button');
    btncancela.setAttribute('value', 'Cancelar');
    btncancela.addEventListener('click', () => {
        divBaseJanela.remove()
    })
    btncancela.setAttribute('style', styBtn);
    divRodape.appendChild(btncancela);
}

var fotoPertilUsuario = undefined
const converteImagemBase64 =  (localDestino,arquivoImagem)=>{
    const obj = arquivoImagem;
    const reader = new FileReader()
    reader.addEventListener('load',async (evt)=>{
        const res =  reader.result
        localDestino.src = res
        fotoPertilUsuario = await res
    });
    if(obj){
        reader.readAsDataURL(obj);
    }
}

btnCadastrar.addEventListener('click',()=>{
    janelaColab()

    document.querySelector('#divTitulo').innerHTML='<h2>Cadastrar Usuário<h2>'
    const styBtnx = document.querySelector('#btncancela').style.cssText

    const btnAlterar = document.createElement('input');
    btnAlterar.setAttribute('id', 'btnAlterar');
    btnAlterar.setAttribute('type', 'Button');
    btnAlterar.setAttribute('value', 'Cadastrar');
    btnAlterar.setAttribute('style', styBtnx);
    btnAlterar.addEventListener('click', () => {
        const campoID =  document.querySelector('#inpCId').value
        const campoNome = document.querySelector('#inpCNome').value
        const campoFoto = document.querySelector('#inpCFoto')
        fotoPertilUsuario = fotoPertilUsuario ? fotoPertilUsuario : null
        const campoLogin = document.querySelector('#inpCLogin').childNodes[1].value
        const campoPassword = document.querySelector('#inpCPassword').childNodes[1].value
        const campoStatus = document.querySelector('#inpCStatus').selectedIndex
        const campoTipo = document.querySelector('#inpCTipo').selectedIndex
        const telefontesInseridos =document.querySelector('#divCTelefones').children
        var arr = [].slice.call(telefontesInseridos);
        const telGravar =[]
        arr.map((ite,id)=>{
            const telefone = ite.children[1].innerHTML
            const inidd = telefone.indexOf('(')
            const findd = telefone.indexOf(')')
            const ddd = telefone.substring(inidd+1,findd)
            telGravar.push([ite.children[1].innerHTML,ddd])
        })
        var idColaborador = undefined
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "USO_NOME": campoNome, "USO_STATUS": campoStatus, "USO_TIPO": campoTipo, "USO_FOTO": fotoPertilUsuario, 'USO_LOGIN':campoLogin, 'USO_PASSWO':campoPassword});
        var requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(apiServer+"colaborador", requestOptions)
            .then(response => response.json())
            .then(result => { 
                idColaborador = result;
                telGravar.map((ite,id)=>{
                    inserirTelefone(idColaborador[0].USO_ID,ite)
                })                
                refreshLista()
            })
            .catch(error => console.log('error', error));
        fotoPertilUsuario = undefined
    })
     divRodape.prepend(btnAlterar);
})

const alterar = () => {
    janelaColab()
    const divJanTelefones = document.querySelector('#divCTelefones')

    document.querySelector('#divTitulo').innerHTML = '<h2>Alterar Usuário<h2>'
    document.querySelector('#inpCId').value = DataGrid.campoRetorno.USO_ID
    document.querySelector('#inpCNome').value = DataGrid.campoRetorno.USO_NOME
    document.querySelector('#inpCStatus').selectedIndex = DataGrid.campoRetorno.USO_STATUS
    document.querySelector('#inpCTipo').selectedIndex = DataGrid.campoRetorno.USO_TIPO
    document.querySelector('#inpCLogin').childNodes[1].value = DataGrid.campoRetorno.USO_LOGIN
    document.querySelector('#inpCPassword').childNodes[1].value = DataGrid.campoRetorno.USO_PASSWO
    const campoFoto = document.querySelector('#inpCFoto')
    fotoPertilUsuario = DataGrid.campoRetorno.FOR_FOTO
    const ctu = async () => {
        await carregaTelefones(DataGrid.campoRetorno.USO_ID)
        const styDivTelefone = 'display : flex;'
            + 'align-items : center;'
            + 'justify-content : flex-start;'
            + 'flex-direction : row;'
            + 'width : 155px!important;'
            + 'padding : 2px 0 2px 0 ;'
            + 'border-radius : 8px 8px 8px 8px;'
            + 'background-color: rgb(220,220,220);'
        const styImgTel = 'background-color : red !important;'
            + 'height : 25px;'
            + 'width : 25px;'
            + 'padding : 0 2px 0 2px;'
            + 'margin : 0px 3px 0px 3px;'
        telefonesDoUsuario.map((ite, id) => {
            const divCampoTelefone = document.createElement('div');
            divCampoTelefone.setAttribute('id', 'divCTelefone');
            divCampoTelefone.setAttribute('class', 'styDivCampos');
            divCampoTelefone.setAttribute('style', styDivTelefone);
            divJanTelefones.appendChild(divCampoTelefone);

            const imgTrashTelefone = document.createElement('input');
            imgTrashTelefone.setAttribute('id', 'inpImgTelefone');
            imgTrashTelefone.setAttribute('class', 'btnMenu');
            imgTrashTelefone.setAttribute('style', styImgTel);
            imgTrashTelefone.setAttribute('type', 'image');
            imgTrashTelefone.setAttribute('src', '../img/trash.svg')
            divCampoTelefone.appendChild(imgTrashTelefone);
            imgTrashTelefone.addEventListener('click', (evt) => {
                apagaUmTelefone({"TEL_USUARI":parseInt(document.querySelector('#inpCId').value),"TEL_TELEFO":evt.target.parentNode.children[1].innerHTML })
                evt.target.parentNode.remove()
            })
            var divCampos = document.createElement('div');
            divCampos.setAttribute('id', 'divTelefoneAdd');
            divCampos.setAttribute('class', 'styDivTelefones');
            divCampos.setAttribute('style', '');
            divCampos.innerHTML = ite.TEL_TELEFO
            divCampoTelefone.appendChild(divCampos);
        })
    }
    ctu()

    const styBtnx = document.querySelector('#btncancela').style.cssText
    const btnAlterar = document.createElement('input');
    btnAlterar.setAttribute('id', 'btnAlterar');
    btnAlterar.setAttribute('type', 'Button');
    btnAlterar.setAttribute('value', 'Alterar');
    btnAlterar.setAttribute('style', styBtnx);
    btnAlterar.addEventListener('click', () => {
        const campoID = parseInt(document.querySelector('#inpCId').value)
        const campoNome = document.querySelector('#inpCNome').value
        const campoLogin = document.querySelector('#inpCLogin').childNodes[1].value
        const campoPassword = document.querySelector('#inpCPassword').childNodes[1].value
        const campoStatus = document.querySelector('#inpCStatus').selectedIndex
        const campoTipo = document.querySelector('#inpCTipo').selectedIndex
        const campoFoto = document.querySelector('#inpCFoto')
        if (campoFoto.files.length==0) fotoPertilUsuario = DataGrid.campoRetorno.USO_FOTO
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({ "USO_NOME": campoNome, "USO_STATUS": campoStatus, "USO_TIPO": campoTipo, "USO_FOTO": fotoPertilUsuario ,"USO_LOGIN" : campoLogin, "USO_PASSWO" : campoPassword, "USO_ID" : campoID });
        var requestOptions = {
            method: 'PUT',
            mode: 'cors',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        console.log(campoLogin)
        console.log(campoPassword)
        console.log(raw)
        fetch(apiServer+"colaborador", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                refreshLista()
            })
            .catch(error => console.log('error', error));
    })

    divRodape.prepend(btnAlterar);
}

const listaTelefones = async()=>{
    janelaPopup()
    const titulo= document.querySelector('#janTitulo')
    const janDados = document.querySelector('#JanDivDados')
    const janRodape = document.querySelector('#janDivRodape')
    titulo.innerHTML='<h2> Listagem dos contatos</h2>'
    janDados.style.flexDirection='row'
    janDados.style.gap='10px'
    janDados.style.flexWrap='wrap'
    janRodape.style.height='30px'
    
    await carregaTelefones(dgDados.campoRetorno[0].innerHTML)   
    const styDivTelefone = 'display : flex;'
    +'align-items : center;'
    +'justify-content : flex-start;'
    +'flex-direction : row;'
    +'width : 155px!important;'
    +'padding : 2px 0 2px 0 ;'
    +'border-radius : 8px 8px 8px 8px;'
    +'background-color: rgb(220,220,220);'
    telefonesDoUsuario.map((ite,id)=>{
        const divCampoTelefone  = document.createElement('div');
        divCampoTelefone.setAttribute('id','divCTelefone');
        divCampoTelefone.setAttribute('class','styDivCampos');
        divCampoTelefone.setAttribute('style',styDivTelefone);
        janDados.appendChild(divCampoTelefone);
        const styImgTel = 'background-color : #248 !important;'
        +'height : 25px;'
        +'width : 25px;'
        +'padding : 0 2px 0 2px;'
        +'margin : 0px 3px 0px 3px;'        
        const imgTrashTelefone = document.createElement('input');
        imgTrashTelefone.setAttribute('id','inpImgTelefone');
        imgTrashTelefone.setAttribute('class','btnMenu');
        imgTrashTelefone.setAttribute('style',styImgTel);
        imgTrashTelefone.setAttribute('type','image');
        imgTrashTelefone.setAttribute('src','../img/tellist.svg')
        divCampoTelefone.appendChild(imgTrashTelefone);
        imgTrashTelefone.addEventListener('click',(evt)=>{
            evt.target.parentNode.remove()
        })
        
        var divCampos  = document.createElement('div');
        divCampos.setAttribute('id','divTelefoneAdd');
        divCampos.setAttribute('class','styDivTelefones');
        divCampos.setAttribute('style','');
        divCampos.innerHTML = ite.TEL_TELEFO
        divCampoTelefone.appendChild(divCampos);
    })

}

const mostraFoto = ()=>{
    janelaPopup()
    const janTitulo = document.querySelector('#janTitulo')
    const janDados = document.querySelector('#JanDivDados')
    janDados.style.justifyContent='center'
    janDados.style.alignItems='center'
    janTitulo.innerHTML="<h2>Foto</h2>";
    const styDivJanFoto = 'display : flex;'
        +'align-items : center  !important;'
        +'justify-content : center !important;'
        +'width : 200px;'
        +'height : 266px;'
        +'object-fit: cover;'
        +'position: relative;'
        +'overflow: hidden;'
    const styImgJanFoto = 'display : flex;'
        'width : 100%;'
        'height : 100%'
    var divCampos  = document.createElement('div');
    divCampos.setAttribute('id','divJanFoto');
    divCampos.setAttribute('class','styDivJanFoto');
    divCampos.setAttribute('style',styDivJanFoto);
    janDados.appendChild(divCampos);
    var imgCampos  = document.createElement('img');
    imgCampos.setAttribute('id','imgJanFoto');
    imgCampos.setAttribute('class','styDivJanfoto');
    imgCampos.setAttribute('style',styImgJanFoto);
    imgCampos.setAttribute('src',DataGrid.campoRetorno.USO_FOTO)
    divCampos.appendChild(imgCampos);    
}

const janelaPopup = () => {
    const divBaseJanela = document.createElement('div');
    const styBaseJanela =
        'display : flex;' +
        'justify-content :center;' +
        'align-items : center;' +
        'position : absolute;' +
        'top : 0px;' +
        'left : 0px;' +
        'width : 100%;' +
        'height : 100vh;' +
        'background-color : rgba(0,0,0,0.7);' +
        'z-index : 9099999999';
    divBaseJanela.setAttribute('id', 'divBaseJanela');
    divBaseJanela.setAttribute('style', styBaseJanela);
    divBaseJanela.setAttribute('class', 'styLJanela');
    document.body.appendChild(divBaseJanela);

    const divJanela = document.createElement('div');
    divJanela.setAttribute('id', 'divJanela');
    const styJanela = 'display : flex;'
        + 'justify-content : flex-start;'
        + 'align-items : flex-start;'
        + 'flex-direction : column;'
        + 'width : 500px;'
    divJanela.setAttribute('style', styJanela);
    divBaseJanela.appendChild(divJanela);

    const divTitulo = document.createElement('div');
    const styTitulo = 'display: flex;'
        + 'justify-content: space-between;'
        + 'align-items: center;'
        + 'flex-direction: row;'
        + 'background-color: #248;'
        + 'color:white;'
        + 'border-radius: 15px 15px 0 0;'
        + 'width : 100%;'
        + 'height: 50px;'
        + 'padding:  5px 3px 5px 3px'
    divTitulo.setAttribute('id', 'divTitulo');
    divTitulo.setAttribute('class', 'styLTitulo');
    divTitulo.setAttribute('style', styTitulo)
    divJanela.appendChild(divTitulo);

    var labCampos = document.createElement('label');
    labCampos.setAttribute('id','labTFake');
    labCampos.setAttribute('class','stylabCampos');
    labCampos.setAttribute('style','');
    labCampos.innerHTML=''
    divTitulo.appendChild(labCampos);

    const stylabCampos ='display : flex;'
        +'align-itens : center;'
        +'justify-content : center;'
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id','janTitulo');
    labCampos.setAttribute('class','stylabCampos');
    labCampos.setAttribute('style','');
    labCampos.innerHTML='<h2>Título da Janela<h2>'
    divTitulo.appendChild(labCampos);    
    const styImgTel = 'background-color : white !important;'
    +'height : 25px;'
    +'width : 25px;'
    +'padding : 0 2px 0 2px;'
    +'margin : 0px 3px 0px 3px;'
    const imgTrashTelefone = document.createElement('input');
    imgTrashTelefone.setAttribute('id','inpImgTelefone');
    imgTrashTelefone.setAttribute('class','btnMenu');
    imgTrashTelefone.setAttribute('style',styImgTel);
    imgTrashTelefone.setAttribute('type','image');
    imgTrashTelefone.setAttribute('src','../img/close.svg')
    divTitulo.appendChild(imgTrashTelefone);
    imgTrashTelefone.addEventListener('click',(evt)=>{
        divBaseJanela.remove()
    })

    const divDados = document.createElement('div');
    divDados.setAttribute('id', 'JanDivDados');
    const styDados = 'display : flex;'
        + 'justify-content : flex-start;'
        + 'align-items : flex-start;'
        + 'flex-direction : column;'
        + 'width : 100%;'
        + 'background-color : rgb(245,245,245) !important;'
        + 'padding : 5px 5px 5px 5px;';
    divDados.setAttribute('style', styDados);
    divDados.setAttribute('class', 'styLDados');
    divJanela.appendChild(divDados);

    const styDivCampos = 'display : flex;'
        + 'justify-content : flex-start;'
        + 'align-itens : flex=start;'
        + 'flex-direction : column;'
        + 'width : 100%;'
        + 'color : #000;'
        + 'padding : 3px;';

    const divRodape = document.createElement('div');
    const styRodape = 'display: flex;'
        + 'justify-content: center;'
        + 'align-items: flex-start;'
        + 'flex-direction: row;'
        + 'background-color: #248;'
        + 'color:white;'
        + 'border-radius: 0 0 10px 10px;'
        + 'width : 100%;'
        + 'gap: 10px;'
        + 'padding:  5px 3px 5px 3px;'
    divRodape.setAttribute('id', 'janDivRodape');
    divRodape.setAttribute('class', 'styLRodape');
    divRodape.setAttribute('style', styRodape)
    divJanela.appendChild(divRodape);
}

const toggleAtivar = ()=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ "USO_STATUS": DataGrid.campoRetorno.USO_STATUS, "USO_ID" : DataGrid.campoRetorno.USO_ID});
    var requestOptions = {
        method: 'PUT',
        mode: 'cors',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiServer+"usuario/status", requestOptions)
        .then(response => response.json())
        .then(result => { 
            refreshLista()
        })
        .catch(error => console.log('error', error));
}


btncolabPesquisar.addEventListener('click', (evt) => {
    janelaColab()
    document.querySelector('#divTitulo').innerHTML = '<h2>Pesquisa<h2>'    
    const janelaPesquisa = document.querySelector('#divDados')
    const janelaRodape = document.querySelector('#divRodape')
    const divJanTelefones = document.querySelector('#divCTelefones')
    const styDivPesquisa = 'display : flex;'
        + 'justify-content : flex-start;'
        + 'align-itens : flex=start;'
        + 'flex-direction : row;'
        + 'width : 100%;'
        + 'color : #000;'
        + 'padding : 3px;';
    const styDivCampos = 'display : flex;'
        + 'justify-content : flex-start;'
        + 'align-itens : flex=start;'
        + 'flex-direction : column;'
        + 'width : 100%;'
        + 'color : #000;'
        + 'padding : 3px;';
    const styInput = 'displey: flex ;'
        + 'width : 100%'
        + 'padding : 3px'
    const styLabel = 'displey: flex ;'
    const stySelect = 'displey: flex ;'
        + 'width : 100%'
        + 'padding : 3px'

        var divCPesquisa = document.createElement('div');
        divCPesquisa.setAttribute('id', 'divGPesquisa');
        divCPesquisa.setAttribute('class', 'styDivCampos');
        divCPesquisa.setAttribute('style', styDivPesquisa);
        janelaPesquisa.prepend(divCPesquisa);

    var divCampos = document.createElement('div');
    divCampos.setAttribute('id', 'divCID');
    divCampos.setAttribute('class', 'styDivCampos');
    divCampos.setAttribute('style', styDivCampos);
    divCPesquisa.prepend(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id', 'labCId');
    labCampos.setAttribute('class', 'stylabCampos');
    labCampos.setAttribute('style', styLabel);
    labCampos.innerHTML = 'Pesquisa'
    divCampos.appendChild(labCampos);
    var inpCampos = document.createElement('Input');
    inpCampos.setAttribute('id', 'inpPesquisa');
    inpCampos.setAttribute('class', 'styinpCampos');
    inpCampos.setAttribute('style', styInput);
    inpCampos.setAttribute('type', 'text');
    divCampos.appendChild(inpCampos);
    const campoPesquiss=inpCampos
    
    var divCampos = document.createElement('div');
    divCampos.setAttribute('id', 'divSPesquisa');
    divCampos.setAttribute('class', 'styDivCampos');
    divCampos.setAttribute('style', styDivCampos);
    divCPesquisa.prepend(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id', 'labCId');
    labCampos.setAttribute('class', 'stylabCampos');
    labCampos.setAttribute('style', styLabel);
    labCampos.innerHTML = 'Campo Pesquisa'
    divCampos.appendChild(labCampos);
    var inpCampos = document.createElement('Select');
    inpCampos.setAttribute('id', 'selPesquisa');
    inpCampos.setAttribute('class', '');
    inpCampos.setAttribute('style', 'border-radius : 5px;padding : 5px');
    const pesSelect = inpCampos;
    var inpCampos = document.createElement('option');
    inpCampos.innerHTML="Id"
    pesSelect.appendChild(inpCampos);
    var inpCampos = document.createElement('option');
    inpCampos.innerHTML='Nome'
    pesSelect.appendChild(inpCampos); 
    var inpCampos = document.createElement('option');
    inpCampos.innerHTML='Status'
    pesSelect.appendChild(inpCampos);     
    var inpCampos = document.createElement('option');
    inpCampos.innerHTML='Tipo'
    pesSelect.appendChild(inpCampos);     

    divCampos.appendChild(pesSelect);
    pesSelect.selectedIndex = 1
    const nomeCampos=["USO_ID","USO_NOME","USO_STATUS","USO_TIPO"]

    const styBtnx = document.querySelector('#btncancela').style.cssText

    const btnAlterar = document.createElement('input');
    btnAlterar.setAttribute('id', 'btnAlterar');
    btnAlterar.setAttribute('type', 'Button');
    btnAlterar.setAttribute('value', 'Pesquisar');
    btnAlterar.setAttribute('style', styBtnx);
    janelaRodape.prepend(btnAlterar)
    btnAlterar.addEventListener('click', () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            mode: 'cors',
            keepalive: false
        };
        const api = `${apiServer}usuario/pesquisa/?USO_NOME=${campoPesquiss.value.toUpperCase()}&USO_CAMPO=${nomeCampos[pesSelect.selectedIndex]}`
        fetch(api, requestOptions)
            .then(response => response.json())
            .then(retorno => {
                if (retorno.length > 0) {
                    document.querySelector('#inpCId').value = retorno[0].USO_ID
                    document.querySelector('#inpCNome').value = retorno[0].USO_NOME
                    document.querySelector('#inpCLogin').childNodes[1].value = retorno[0].USO_LOGIN
                    document.querySelector('#inpCPassword').childNodes[1].value = retorno[0].USO_PASSWO
                    document.querySelector('#inpCStatus').selectedIndex = retorno[0].USO_STATUS
                    document.querySelector('#inpCTipo').selectedIndex = retorno[0].USO_TIPO
                    const carTel = async () => {
                        await carregaTelefones(retorno[0].USO_ID)
                        const styDivTelefone = await 'display : flex;'
                            + 'align-items : center;'
                            + 'justify-content : flex-start;'
                            + 'flex-direction : row;'
                            + 'width : 155px!important;'
                            + 'padding : 2px 0 2px 0 ;'
                            + 'border-radius : 8px 8px 8px 8px;'
                            + 'background-color: rgb(220,220,220);'

                        await telefonesDoUsuario.map((ite, id) => {
                            const divCampoTelefone = document.createElement('div');
                            divCampoTelefone.setAttribute('id', 'divCTelefone');
                            divCampoTelefone.setAttribute('class', 'styDivCampos');
                            divCampoTelefone.setAttribute('style', styDivTelefone);
                            divJanTelefones.appendChild(divCampoTelefone);
                            const styImgTel = 'background-color : #248 !important;'
                                + 'height : 25px;'
                                + 'width : 25px;'
                                + 'padding : 0 2px 0 2px;'
                                + 'margin : 0px 3px 0px 3px;'
                            const imgTrashTelefone = document.createElement('input');
                            imgTrashTelefone.setAttribute('id', 'inpImgTelefone');
                            imgTrashTelefone.setAttribute('class', 'btnMenu');
                            imgTrashTelefone.setAttribute('style', styImgTel);
                            imgTrashTelefone.setAttribute('type', 'image');
                            imgTrashTelefone.setAttribute('src', '../img/tellist.svg')
                            divCampoTelefone.appendChild(imgTrashTelefone);

                            var divCampos = document.createElement('div');
                            divCampos.setAttribute('id', 'divTelefoneAdd');
                            divCampos.setAttribute('class', 'styDivTelefones');
                            divCampos.setAttribute('style', '');
                            divCampos.innerHTML = ite.TEL_TELEFO
                            divCampoTelefone.appendChild(divCampos);
                        })
                    }
                    carTel()
                }
            })
            .catch(error => console.log('error', error));
    })
    
})