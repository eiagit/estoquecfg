import { DataGrid } from "https://eiagit.github.io/DataGrid/src/dataGrid.js";
//import { DataGrid } from "../../../dataGrid.js";
import { Cxmsg } from "https://eiagit.github.io/java/cxmsg.js";
import utkit from  './../utkit/utkit.js'



//const api = apiServer+`token?TOK_USUARI=${sessionStorage.getItem('logId')}&TOK_CHAVE=${sessionStorage.getItem('userToken')}`
//const tokenOk = utkit.checkaToken(api).then(retorno => console.log(retorno))

var menuIdUser =  sessionStorage.getItem('logId')
var menuNomeUser  = sessionStorage.getItem('logUser')
var btnEntrada = document.querySelector('#btnEntrada')
const btnSaída  = document.querySelector('#btnSaida')
const btnRelatorios  = document.querySelector('#btnRelatorio')
var contatosDoFornecedor = undefined
var dadosdoProduto = undefined
var apiServer = undefined



const dgDados={
    destino : '#dataGridJ',
    local   : 'pt-br'   ,
    moeda   : 'BRL'     ,
    funcoes: {
        "grid"   : { "linha": ""    , "cor"   : "red"},
        "filtro" : { "hide" : false , "campo" : 1      ,selectHide : false },
        "rodape" : { "hide" : false},
        "titulo" : { "hide" : false , "cor"   : "#49F"},
        "acoes"  : { "hide" : false , "titulo": "Ações", "width": "90px", "align": "center" ,"material" : 'ion-icon','clicklinha' : ()=>{}},
        "onclose" : { "hide" : false , "funcao" : ()=>{}},
        icones : {
            switch : { hide: false  , name: 'lock-open-outline', func: ()=>{}},
            upstk : { hide: false  , name: 'arrow-down-outline', func: ()=>{entrada()}},
            dowstk : { hide: false  , name: 'arrow-up-outline', func: ()=>{saida()}},
            forn   : { hide: false  , name: 'business-outline'  , func: ()=>{verFornecedor()}},
            prod   : { hide: false  , name: 'search-outline'  , func: ()=>{janelaProduto()}},
        }
    },
    campos: [
        { campo : 'PRO_ID'    , titulo: 'Id'                    , formato : 'g' , width: '50px' , align: 'left' , soma : false},
        { campo : 'PRO_NOME'  , titulo: 'Descrissão do Produto' , formato : 'g' , width: '370px', align: 'left' , soma : false},
        { campo : 'PRO_BARRAS' , titulo: 'Código Barras'        , formato : 'g' , width: '120px', align: 'left' , soma : false},
        { campo : 'TIP_NOME'  , titulo: 'Tipo'                  , formato : 'g' , width: '150px', align: 'left' , soma : false},
        { campo : 'PRO_ESTOQU'  , titulo: 'Estoque'                , formato : 'g' , width:  '70px', align: 'left' , soma : false},
        { campo : 'PRO_PRECO' , titulo: 'Preço'                 , formato : 'm' , width: '100px', align: 'right', soma : true},                
    ]
}
const carregaProdutos = () => {
    const apiColab = apiServer+"Produtos"
    fetch(apiColab)
        .then(res => res.json())
        .then(retorno => {
            DataGrid.criaLista(dgDados, retorno)
                retorno.map((ite, id) => {
                    if (ite.PRO_STATUS == 0) {
                        document.querySelector('#dgLinha'+id).lastChild.firstChild.name='lock-closed-outline'
                        document.querySelector('#dgLinha'+id).lastChild.firstChild.style.color="red"
                    }
                    else{document.querySelector('#dgLinha'+id).lastChild.firstChild.style.color="green"}
                })
        })
}
new Promise((resolve, reject) => {
    apiServer = sessionStorage.getItem('servidor')
    resolve()
}).then(() => {
    carregaProdutos()
})

const carregaContatos = async (fcoFornec) => {
    const apiColab = apiServer+"fornecedor/contatos/?FCO_FORNEC="+DataGrid.campoRetorno.PRO_FORNEC
    await fetch(apiColab)
        .then(res => res.json())
        .then(retorno => {
                contatosDoFornecedor = retorno
                return retorno
            })
}

const janelaProduto = () =>{
    const apiColab = apiServer+"Produto/id/?PRO_ID="+DataGrid.campoRetorno.PRO_ID
    fetch(apiColab)
        .then(res => res.json())
        .then(retorno => {
            dadosdoProduto = retorno[0]
            mostraProduto()
        })

const mostraProduto = () => {
const popJanelaProduto = utkit.janelaPopup(document.querySelector('#dgBase'), "Dados do Produto", () => { })
const divDados = document.querySelector("#DivPDados")
const grupoL1 = utkit.criaGrupCampos(divDados, 'GruLinha01', 'styGrupCampos');
const CampoId = utkit.criCampo(grupoL1, 'Id', 'styCampInput', "Id")
CampoId.inpCampo.value = dadosdoProduto.PRO_ID
CampoId.divCampo.style = 'width : 10% !important;'
CampoId.inpCampo.setAttribute('disabled', 'true')
const CampoNome = utkit.criCampo(grupoL1, 'Produto', 'styCampInput', "Nome do Produto")
CampoNome.inpCampo.value = dadosdoProduto.PRO_NOME
const grupoL2 = utkit.criaGrupCampos(divDados, 'GruLinha02', 'styGrupCampos');
const CampoBarras = utkit.criCampo(grupoL2, 'Barras', 'styCampInput', "Código de Barras")
CampoBarras.inpCampo.value = dadosdoProduto.PRO_BARRAS
const CampoPreco = utkit.criCampo(grupoL2, 'Preco', 'styCampInput', "Preco")
CampoPreco.inpCampo.value = parseFloat(dadosdoProduto.PRO_PRECO).toLocaleString('pt-BR', { style: 'currency', currency: "BRL" });
const grupoL3 = utkit.criaGrupCampos(divDados, 'GruLinha03', 'styGrupCampos');
const CampoTipo = utkit.criCampo(grupoL3, 'Tipo', 'styCampInput', "Tipo")
CampoTipo.inpCampo.value = dadosdoProduto.TIP_NOME
const CampoStatus = utkit.criCampo(grupoL3, 'Status', 'styCampInput', "Status")
CampoStatus.inpCampo.value = dadosdoProduto.STA_NOME
const grupoL4 = utkit.criaGrupCampos(divDados, 'GruLinha04', 'styGrupCampos');
const btnFornecedor = utkit.criaBotaoRedondo(grupoL4, "btnEmpresa", 'btnMenu', '../img/fornec.svg', 'Busca Fornecedor', () => { gridFornecedor() })
const NomeFornecedor = utkit.criCampo(grupoL4, 'Fornecedor', 'styCampInput', "Nome do Fornecedor")
NomeFornecedor.inpCampo.value = dadosdoProduto.FOR_NOME
}
}
const verFornecedor = () =>{
    const divJBForFundo = utkit.criaDivBase(document.querySelector('#dgBase'),'divJBForFundo');
    const divJanela = utkit.criaGrupCampos(divJBForFundo,'DivJanela','styJanela')
    const divTitulo = utkit.criaGrupCampos(divJanela,'DivTitulo','styTitulo')
    const divFantasma = utkit.criaGrupCampos(divTitulo,'DivFantasma','')
    const divTextoTitulo = utkit.criaGrupCampos(divTitulo,'DivTexto','')
    divTitulo.innerHTML +='<H2> Fornecedor <h2>'
    const divDados = utkit.criaGrupCampos(divJanela,'DivDados','styDados')
    const divRodape = utkit.criaGrupCampos(divJanela,'DivRodape','styRodape')
    const btnSair = utkit.criaBotaoRedondo(divTitulo,'BtnSair','styBtnRedondo','../img/close.svg','Fechar Janela',()=>{divJBForFundo.remove()})
    btnSair.inpCampo.style.backgroundColor='red'
    divTitulo.style.flexDirection='row'
    divTitulo.style.justifyContent='space-between'

    const grupoL1 = utkit.criaGrupCampos(divDados, 'GruLinha01', 'styGrupCampos');
    const CampoId = utkit.criCampo(grupoL1, 'Id', 'styCampInput', "Id")
    CampoId.divCampo.style = 'width : 10% !important;'
    CampoId.inpCampo.setAttribute('disabled', 'true')
    const CampoNome = utkit.criCampo(grupoL1, 'Produto', 'styCampInput', "Nome do Produto")
    CampoNome.inpCampo.setAttribute('autofocus','true')
    const CampoRazao = utkit.criCampo(divDados, 'Razao', 'styCampInput', "Razão Social")
    const grupoL3 = utkit.criaGrupCampos(divDados, 'GruLinha03', 'styGrupCampos');    
    const CampoStatus = utkit.criCampo(grupoL3, 'Status', 'styCampInput', "Status")
    const CampoCnpj = utkit.criCampo(grupoL3, 'Cnpj', 'styCampInput', "Cnpj")
    const grupoL4 = utkit.criaGrupCampos(divDados, 'GruLinha04', 'styGrupCampos');
    grupoL4.style.marginTop='5px'
    grupoL4.style.backgroundColor='gray'
    grupoL4.innerHTML="Contatos"
    const apiColab = apiServer+"fornecedor/todos"
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        mode: 'cors',
        keepalive: false
    };
    const api = apiServer+`fornecedor/pesquisa/?FOR_CAMPO=FOR_NOME&FOR_DADOS=${DataGrid.campoRetorno.FOR_NOME }`
    fetch(api, requestOptions)
        .then(response => response.json())
        .then(retorno => {
            if (retorno.length > 0) {
                CampoId.inpCampo.value = retorno[0].FOR_ID
                CampoNome.inpCampo.value = retorno[0].FOR_NOME
                CampoRazao.inpCampo.value = retorno[0].FOR_RAZAO
                CampoCnpj.inpCampo.value = retorno[0].FOR_CNPJ
                CampoStatus.inpCampo.value = retorno[0].FOR_STANOM
                grupoL4.innerHTML='Contatos'
                const ctu = async () => {
                    if(retorno[0].FOR_ID){
                        await carregaContatos(retorno[0].FOR_ID)
                        const ctatos = await [].slice.call(contatosDoFornecedor)
                        if (ctatos.length>0){grupoL4.innerHTML=''}
                        await ctatos.map((ite, id) => {
                            addContato(ite.FCO_ID, ite.USO_ID, ite.USO_NOME, document.querySelector('#GruLinha04'), 0)
                        })
                    }
                }
                ctu()                                   
            }
        })
        .catch(error => console.log('error', error));
}

const addContato = (colabid,id, nome,destino,tipo) => {

    const styDivContato = 'display : flex;'
    +'align-items : center;'
    +'justify-content : flex-start;'
    +'flex-direction : row;'
    +'padding : 2px 0 2px 0 ;'
    +'border-radius : 8px 8px 8px 8px;'
    +'background-color: rgb(220,220,220);'
    +'gap: 5px'
    const styImgCta = 'background-color : red !important;'
       +'height : 25px;'
       +'width : 25px;'
       +'padding : 0 2px 0 2px;'
       +'margin : 0px 3px 0px 3px;'   
    const divCampoContato = document.createElement('div');
    divCampoContato.setAttribute('id', 'divCamoContatos');
    divCampoContato.setAttribute('class', 'styDivCampos');
    divCampoContato.setAttribute('style', styDivContato);
    destino.appendChild(divCampoContato);

    const imgTrashTelefone = document.createElement('input');
    imgTrashTelefone.setAttribute('id', 'inpImgContato');
    imgTrashTelefone.setAttribute('class', 'btnMenu');
    imgTrashTelefone.setAttribute('style', styImgCta);
    imgTrashTelefone.setAttribute('type', 'image');
    
    if (tipo == 0) {
        imgTrashTelefone.setAttribute('src', '../img/colab.svg')
        imgTrashTelefone.style.backgroundColor='rgb(180,180,180)'
        divCampoContato.appendChild(imgTrashTelefone);
        imgTrashTelefone.addEventListener('click', (evt) => {
            const idFco = evt.target.nextElementSibling.innerHTML
            listaTelefones(idFco)
        })        
    }    
    if (tipo == 1) {
        imgTrashTelefone.setAttribute('src', '../img/trash.svg')
        divCampoContato.appendChild(imgTrashTelefone);
        imgTrashTelefone.addEventListener('click', (evt) => {
            const idFco = parseInt(evt.target.nextElementSibling.getAttribute('data-colab'))
            if (document.querySelector('#divTitulo').innerHTML=='<h2>Alterar Fornecedor</h2>'){
                apagaUmContato(idFco)
            }
            evt.target.parentNode.remove()
        })
    }

    var divCampos = document.createElement('div');
    divCampos.setAttribute('id', 'divContatoLisId');
    divCampos.setAttribute('class', 'styDivTelefones');
    divCampos.setAttribute('style', '');
    divCampos.setAttribute('data-colab',colabid)
    divCampos.innerHTML = id
    divCampoContato.appendChild(divCampos);

    var divCampos = document.createElement('div');
    divCampos.setAttribute('id', 'divContatoLisNome');
    divCampos.setAttribute('class', 'styDivTelefones');
    divCampos.setAttribute('style', 'margin-right : 5px');
    divCampos.innerHTML = nome
    divCampoContato.appendChild(divCampos);

}


const refreshProdutos = async () => {
   await DataGrid.hideLista()
   carregaProdutos()
}

const entrada = ()=>{
    const jfont = movimento()
    const jtexto = jfont.querySelector('#DivPTexto')
    jtexto.innerHTML='<h2> Entrada de Estoque</h2>'
    jtexto.setAttribute('date-tipo','0')
}

const saida = ()=>{
    const jfont = movimento()
    const jtexto = jfont.querySelector('#DivPTexto')
    jtexto.innerHTML='<h2> Saída de Estoque</h2>'
    jtexto.setAttribute('date-tipo','1')
}

const movimento=()=>{
    const destino = document.querySelector('#dgBase')
    const jfonte = utkit.janelaPopup(destino,'<h2> Movimento</h2>')
    
    const janDados = jfonte.querySelector('#DivPDados')
    const janRodape = jfonte.querySelector('#DivPRodape')
    const grupoL1 = utkit.criaGrupCampos(janDados,'GrupoL1','styGrupCampos')
    const CampoId = utkit.criCampo(grupoL1, 'Id', 'styCampInput', "Id")
    CampoId.divCampo.style = 'width : 10% !important;'
    CampoId.inpCampo.setAttribute('disabled', 'true')
    CampoId.inpCampo.value=DataGrid.campoRetorno.PRO_ID
    const CampoNome = utkit.criCampo(grupoL1, 'Produto', 'styCampInput', "Nome do Produto")
    CampoNome.inpCampo.setAttribute('disabled', 'true')
    CampoNome.inpCampo.value=DataGrid.campoRetorno.PRO_NOME

    const grupoL2 = utkit.criaGrupCampos(janDados,'GrupoL2','styGrupCampos')
    const CampoEstoque = utkit.criCampo(grupoL2, 'Estoque', 'styCampInput', "Estoque")
    CampoEstoque.inpCampo.setAttribute('disabled', 'true')
    CampoEstoque.inpCampo.value=DataGrid.campoRetorno.PRO_ESTOQU
    const CampoPreco = utkit.criCampo(grupoL2, 'Preco', 'styCampInput', "Preço")
    CampoPreco.inpCampo.setAttribute('disabled', 'true')
    CampoPreco.inpCampo.value=DataGrid.campoRetorno.PRO_PRECO

    const CampoUsuario = utkit.criCampo(janDados, 'Uauario', 'styCampInput', "Usuário")
    CampoUsuario.inpCampo.value=menuNomeUser.innerHTML
    const grupoL4 = utkit.criaGrupCampos(janDados,'GrupoL4','styGrupCampos')
    const CampoData = utkit.criCampo(grupoL4, 'Data', 'styCampInput', "Data")
    CampoData.inpCampo.setAttribute('type','date')
    CampoData.divCampo.setAttribute('value',Date.now())
    const CampoQuantidade = utkit.criCampo(grupoL4, 'Quant', 'styCampInput', "Quantidade")
    CampoQuantidade.inpCampo.setAttribute('type','number')
    CampoQuantidade.inpCampo.value=1
    const CampoValor = utkit.criCampo(grupoL4, 'Valor', 'styCampInput', "Valor")
    CampoValor.inpCampo.value=DataGrid.campoRetorno.PRO_PRECO
    CampoValor.inpCampo.setAttribute('type','number')

    const BtnGravar = utkit.criaBotaoQuadrado(janRodape,'Gravar','styBtn',()=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ 'MOV_USUARI' : menuIdUser ,'MOV_TIPO' :  jfonte.querySelector('#DivPTexto').getAttribute('date-tipo') , 'MOV_DATA' : CampoData.inpCampo.value, 'MOV_VALOR' : CampoValor.inpCampo.value, 'MOV_QUANTI' : CampoQuantidade.inpCampo.value , 'MOV_PRODUT' : CampoId.inpCampo.value,'MOV_VCNID': -1});
        var requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(apiServer+'produtos/movimento', requestOptions)
            .then(response => response.json())
            .then(result => { 
                
                var raw = JSON.stringify({ 'MOV_TIPO' : jfonte.querySelector('#DivPTexto').getAttribute('date-tipo'), 'MOV_QUANTI' : CampoQuantidade.inpCampo.value, 'PRO_ID' : CampoId.inpCampo.value});
                var requestOptions = {
                    method: 'PUT',
                    mode: 'cors',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                fetch(apiServer+'produtos/estoque', requestOptions)
                    .then(response => response.json())
                    .then(result => { 
                        jfonte.offsetParent.remove()
                        refreshProdutos()
                    })
                    .catch(error => console.log('error', error)); 
                
            })
            .catch(error => console.log('error', error));    
    })    
    return jfonte
}

// var da = new Date().getTime()
// console.log(da)
// da = da + (60000*5)
// console.log(da.toString()+'ennio')
// console.log(utkit.criaCripito(utkit.criaCripito(da)))