import { DataGrid } from "https://eiagit.github.io/DataGrid/src/dataGrid.js";
//import { DataGrid } from "../../../dataGrid.js";
import { Cxmsg } from "https://eiagit.github.io/java/cxmsg.js";
import utkit from  './../utkit/utkit.js'
const btnCadastrar = document.querySelector('#btnCadastrar')
const btnPesquisar  = document.querySelector('#btnPesquisar')
btnCadastrar.setAttribute('backgroundColor','rgb(255,255,255)')
var registroSelected = {'FOR_ID' : null}
var listaTipos  = []
var listaStatus = []
var telefonesDoUsuario = undefined
var contatosDoFornecedor = undefined
var dadosdoProduto = undefined
var apiServer = undefined
var api = undefined
var teste = undefined

const dgDados={
    destino : '#dataGridJ',
    local   : 'pt-br'   ,
    moeda   : 'BRL'     ,
    funcoes: {
        "onclose" : { "hide" : false , "funcao" : ()=>{}},
        "grid"   : { "linha": ""    , "cor"   : "red"},
        "filtro" : { "hide" : false , "campo" : 1      ,selectHide : false },
        "rodape" : { "hide" : false},
        "titulo" : { "hide" : false , "cor"   : "#49F"},
        "acoes"  : { "hide" : false , "titulo": "Ações", "width": "90px", "align": "center" ,"material" : 'ion-icon','clicklinha' : ()=>{}},
        icones : {
            switch : { hide: false  , name: 'lock-open-outline', func: ()=>{toggleStatus()}},
            edit   : { hide: false  , name: 'pencil-outline'   , func: ()=>{alterar()}},
            forn   : { hide: false  , name: 'business-outline'  , func: ()=>{verFornecedor()}},
            prod   : { hide: false  , name: 'search-outline'  , func: ()=>{verProduto()}},
        }
    },
    campos: [
        { campo : 'PRO_ID'    , titulo: 'Id'                    , formato : 'g' , width: '50px' , align: 'left' , soma : false},
        { campo : 'PRO_NOME'  , titulo: 'Descrissão do Produto' , formato : 'g' , width: '370px', align: 'left' , soma : false},
        { campo : 'PRO_BARRAS' , titulo: 'Código Barras'        , formato : 'g' , width: '120px', align: 'left' , soma : false},
        { campo : 'PRO_PRECO' , titulo: 'Preço'                 , formato : 'm' , width: '100px', align: 'right', soma : true},        
        { campo : 'TIP_NOME'  , titulo: 'Tipo'                  , formato : 'g' , width: '150px', align: 'left' , soma : false},
        { campo : 'STA_NOME'  , titulo: 'Status'                , formato : 'g' , width:  '70px', align: 'left' , soma : false},
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
}).then(() => {
    api = apiServer + "tipo"
    fetch(api)
        .then(res => res.json())
        .then(retorno => {
            listaTipos = retorno;
        })
}).then(() => {
    api = apiServer + "status"
    fetch(api)
        .then(res => res.json())
        .then(retorno => {
            listaStatus = retorno;
        })
})

        
const refreshLista = async () => {
     const janelaBase =  document.querySelector('#dgBase')
    if (janelaBase) janelaBase.remove()
    await DataGrid.hideLista()
    carregaProdutos()
}

btnCadastrar.addEventListener('click',()=>{
    janelaProduto()
    const BtnGravar = criaBotaoQuadrado(divRodape,'Gravar','styBtn',()=>{btnGravar()})    
    document.querySelector('#divTitulo').innerHTML='Cadastro de Produtos'
})
const btnGravar = ()=>{
    const campoNome = document.querySelector('#inpCProduto').value
    const campoBarras = document.querySelector('#inpCBarras').value
    const campoPreco = document.querySelector('#inpCPreco').value
    const campoTipo = document.querySelector('#Tipo').lastChild.selectedIndex
    const campoStatus = document.querySelector('#Status').lastChild.selectedIndex
    const campoFornecedor = registroSelected.FOR_ID
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ "PRO_NOME": campoNome, "PRO_BARRAS" : campoBarras,"PRO_PRECO" : campoPreco ,"PRO_TIPO": campoTipo,"PRO_STATUS": campoStatus,"PRO_FORNEC": campoFornecedor  });

    var requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiServer+'produtos', requestOptions)
        .then(response => response.json())
        .then(result => { 
            refreshLista()
        })
        .catch(error => console.log('error', error));
        registroSelected = {'FOR_ID' : null}
        document.querySelector('#inpCProduto').value=''
        document.querySelector('#inpCBarras').value=''
        document.querySelector('#inpCPreco').value=''
        document.querySelector('#Tipo').lastChild.selectedIndex=0
        document.querySelector('#Status').lastChild.selectedIndex=1
        document.querySelector('#inpCFornecedor').value=''

}

const btnAlterar = () =>{
    const campoId = document.querySelector('#inpCId').value
    const campoNome = document.querySelector('#inpCProduto').value
    const campoBarras = document.querySelector('#inpCBarras').value
    const campoPreco = document.querySelector('#inpCPreco').value
    const campoTipo = document.querySelector('#Tipo').lastChild.selectedIndex
    const campoStatus = document.querySelector('#Status').lastChild.selectedIndex
    const campoFornecedor = registroSelected.FOR_ID
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ "PRO_NOME": campoNome, "PRO_BARRAS" : campoBarras,"PRO_PRECO" : campoPreco ,"PRO_TIPO": campoTipo,"PRO_STATUS": campoStatus,"PRO_FORNEC": campoFornecedor,"PRO_ID": campoId  });
    var requestOptions = {
        method: 'PUT',
        mode: 'cors',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiServer+'produtos', requestOptions)
        .then(response => response.json())
        .then(result => { 
            refreshLista()
        })
        .catch(error => console.log('error', error));
        registroSelected = {'FOR_ID' : null}
        document.querySelector('#divBaseJFor').remove()        
}

const verProduto = () =>{
    janelaProduto()
    document.querySelector('#divTitulo').innerHTML='<h2> Dados do Produto </h2>'
    registroSelected = {'FOR_ID' : DataGrid.campoRetorno.PRO_FORNEC}
    document.querySelector('#inpCId').value=DataGrid.campoRetorno.PRO_ID
    document.querySelector('#inpCProduto').value=DataGrid.campoRetorno.PRO_NOME
    document.querySelector('#inpCBarras').value=DataGrid.campoRetorno.PRO_BARRAS
    document.querySelector('#inpCPreco').value=DataGrid.campoRetorno.PRO_PRECO
    document.querySelector('#Tipo').lastChild.selectedIndex=DataGrid.campoRetorno.PRO_TIPO
    document.querySelector('#Status').lastChild.selectedIndex=DataGrid.campoRetorno.PRO_STATUS
    document.querySelector('#inpCFornecedor').value=DataGrid.campoRetorno.FOR_NOME

    document.querySelector('#inpCId').setAttribute('disabled','true')
    document.querySelector('#inpCProduto').setAttribute('disabled','true')
    document.querySelector('#inpCBarras').setAttribute('disabled','true')
    document.querySelector('#inpCPreco').setAttribute('disabled','true')
    document.querySelector('#Tipo').setAttribute('disabled','true')
    document.querySelector('#Status').setAttribute('disabled','true')
    document.querySelector('#btnCbtnEmpresa').setAttribute('disabled','true')

}
const alterar = () => {
    janelaProduto()
    const BtnGravar = criaBotaoQuadrado(divRodape,'Alterar','styBtn',()=>{btnAlterar()})
    document.querySelector('#divTitulo').innerHTML='<H2>Altera Produto</H2>'
    registroSelected = {'FOR_ID' : DataGrid.campoRetorno.PRO_FORNEC}
    document.querySelector('#inpCId').value=DataGrid.campoRetorno.PRO_ID
    document.querySelector('#inpCProduto').value=DataGrid.campoRetorno.PRO_NOME
    document.querySelector('#inpCBarras').value=DataGrid.campoRetorno.PRO_BARRAS
    document.querySelector('#inpCPreco').value=DataGrid.campoRetorno.PRO_PRECO
    document.querySelector('#inpCFornecedor').value = DataGrid.campoRetorno.FOR_NOME
    document.querySelector('#Tipo').children[1].selectedIndex=DataGrid.campoRetorno.PRO_TIPO
    document.querySelector('#Status').children[1].selectedIndex = DataGrid.campoRetorno.PRO_STATUS
}
btnPesquisar .addEventListener('click',()=>{

    janelaProduto()
    document.querySelector('#btnCbtnEmpresa').remove()
    document.querySelector('#divTitulo').innerHTML='Pesquisa Produtos'
    const divDados=document.querySelector('#divJDados')
    const grupoL1=document.querySelector('#GruLinha01')
    const grupoL0 = criaGrupCampos(divDados, 'GruLinha00', 'styGrupCampos');
    grupoL0.setAttribute('nextElementSibling',grupoL1);
    const listaTipos=["Id","Produto","Cod Barras","Preço","Tipo","Status"]
    const listaCampos=["PRO_ID","PRO_NOME","PRO_BARRAS","PRO_PRECO","PRO_TIPO","PRO_STATUS"]
    const CampoBusca = utkit.criSelect(grupoL0, 'Pesquisa', 'styCampInput', "Campo Pesquisa",listaTipos)
    CampoBusca.selCampo.selectedIndex=1
    const CampoPesquisa = criCampo(grupoL0, 'Busca', 'styCampInput', "Busca Produto")
    divDados.prepend(grupoL0)
    const BtnBuscar = criaBotaoRedondo(grupoL0,'BtnPesquisar','btnMenu','../img/find.svg','Buscar Produto',()=>{Pesquisar()})
    const Pesquisar = ()=>{
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        mode: 'cors',
        keepalive: false
    };
    const api = apiServer+`produto/pesquisa/?PES_NOME=${CampoPesquisa.inpCampo.value.toUpperCase()}&PES_CAMPO=${listaCampos[CampoBusca.selCampo.selectedIndex]}`
    fetch(api, requestOptions)
        .then(response => response.json())
        .then(retorno => {
            if (retorno.length > 0) {
                registroSelected = {'FOR_ID' : retorno[0].PRO_FORNEC}
                document.querySelector('#inpCId').value=retorno[0].PRO_ID
                document.querySelector('#inpCProduto').value=retorno[0].PRO_NOME
                document.querySelector('#inpCBarras').value=retorno[0].PRO_BARRAS
                document.querySelector('#inpCPreco').value=retorno[0].PRO_PRECO
                document.querySelector('#Tipo').lastChild.selectedIndex=retorno[0].PRO_TIPO
                document.querySelector('#Status').lastChild.selectedIndex=retorno[0].PRO_STATUS
                document.querySelector('#inpCFornecedor').value=retorno[0].FOR_NOME
                }
        })
        .catch(error => console.log('error', error));
    }
        
})


const janelaProduto1 = () =>{
        const apiColab = apiServer+"Produto/id/?PRO_ID="+DataGrid.campoRetorno.PRO_ID
        fetch(apiColab)
            .then(res => res.json())
            .then(retorno => {
                console.log(retorno[0])
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
    const btnFornecedor = criaBotaoRedondo(grupoL4, "btnEmpresa", 'btnMenu', '../img/fornec.svg', 'Busca Fornecedor', () => { gridFornecedor() })
    const NomeFornecedor = utkit.criCampo(grupoL4, 'Fornecedor', 'styCampInput', "Nome do Fornecedor")
    NomeFornecedor.inpCampo.value = dadosdoProduto.FOR_NOME
}
}

const janelaProduto = () => {
    const divBaseJanela = document.createElement('div');
    divBaseJanela.setAttribute('id', 'divBaseJFor');
    divBaseJanela.setAttribute('style', '');
    divBaseJanela.setAttribute('class', 'styBaseJanela');
    divBaseJanela.style.zIndex=999
    document.body.appendChild(divBaseJanela);

    const divJanela = document.createElement('div');
    divJanela.setAttribute('id', 'divJanela');
    divJanela.setAttribute('class', 'styJanela')
    divJanela.setAttribute('style', '');
    divBaseJanela.appendChild(divJanela);

    const divTitulo = document.createElement('div');
    divTitulo.setAttribute('id', 'divTitulo');
    divTitulo.setAttribute('class', 'styTitulo');
    divTitulo.setAttribute('style', '')
    divTitulo.innerHTML = '<h3> Produtos </h3>'
    divJanela.appendChild(divTitulo);

    const divDados = document.createElement('div');
    divDados.setAttribute('id', 'divJDados');
    divDados.setAttribute('style', '');
    divDados.setAttribute('class', 'styDados');
    divJanela.appendChild(divDados);

    const grupoL1 = criaGrupCampos(divDados, 'GruLinha01', 'styGrupCampos');
    const CampoId = criCampo(grupoL1, 'Id', 'styCampInput', "Id")
    CampoId.divCampo.style = 'width : 10% !important;'
    CampoId.inpCampo.setAttribute('disabled', 'true')
    const CampoNome = criCampo(grupoL1, 'Produto', 'styCampInput', "Nome do Produto")
    CampoNome.inpCampo.setAttribute('autofocus','true')
    CampoNome.inpCampo.focus()
    const grupoL2 = criaGrupCampos(divDados, 'GruLinha02', 'styGrupCampos');
    const CampoBarras = criCampo(grupoL2, 'Barras', 'styCampInput', "Código de Barras")
    const CampoPreco = criCampo(grupoL2, 'Preco', 'styCampInput', "Preco")
    CampoPreco.inpCampo.setAttribute('type', 'number')
    const grupoL3 = criaGrupCampos(divDados, 'GruLinha03', 'styGrupCampos');
    const tipo = []
    listaTipos.map((ite, id) => {
        tipo.push(ite.TIP_NOME)
    })
    const CampoTipo = utkit.criSelect(grupoL3, 'Tipo', 'styCampInput', "Tipo",tipo)
    const opstatus = []
    listaStatus.map((ite, id) => {
        opstatus.push(ite.STA_NOME)
    })
    
    const CampoStatus = utkit.criSelect(grupoL3, 'Status', 'styCampInput', "Status",opstatus)
    const grupoL4 = criaGrupCampos(divDados, 'GruLinha04', 'styGrupCampos');
    const btnFornecedor = criaBotaoRedondo(grupoL4, "btnEmpresa", 'btnMenu', '../img/fornec.svg', 'Busca Fornecedor', () => { gridFornecedor() })
    const NomeFornecedor = criCampo(grupoL4, 'Fornecedor', 'styCampInput', "Nome do Fornecedor")
    NomeFornecedor.inpCampo.setAttribute('disabled', 'true')
    NomeFornecedor.inpCampo.style.backgroundColor = 'rgb(225,225,225)'
    NomeFornecedor.inpCampo.style.color = "black"
    btnFornecedor.inpCampo.style.cursor='default'
    const gridFornecedor = () => {
        const dgFor={
            destino : '#divBasListFor',
            local   : 'pt-br'   ,
            moeda   : 'BRL'     ,
            funcoes: {
                "grid"   : { "linha" : "" , "cor" : "black"},
                "filtro" : { "hide" : false , "campo" : 1 ,selectHide : false},
                "rodape" : { "hide" : false},
                "titulo" : { "hide" : false , "cor"   : "#49F"},
                "acoes"  : { "hide" : false , "titulo": "Ações", "width": "90px", "align": "center" ,"material" : 'ion-icon','clicklinha' : ()=>{}},
                "onclose" : { "hide" : false , "funcao" : ()=>{}},
                icones : {
                    Selec  : { hide: false  , name: 'checkmark-done-outline'   , func: ()=>{selecionar()}},
                }
            },
            campos: [
                { campo : 'FOR_ID'    , titulo: 'Id'                    , formato: 'g'   , width: '70px' , align: 'left', soma : false},
                { campo : 'FOR_NOME'  , titulo: 'Nome Fornecedor'      , formato: 'g'   , width: '350px', align: 'left', soma : false},
                //{ campo : 'FOR_CNPJ'  , titulo: 'CNPJ'                , formato: 'g'   , width: '150px', align: 'left', soma : false},        
                { campo : 'FOR_STANOM', titulo: 'Status'                , formato: 'g'   , width: '100px', align: 'left', soma : false},
        
            ]
        }        
        const divBaseJanela = criaDivBase(document.querySelector('#divBaseJFor'),'ListFor');
        dgFor.destino='#'+divBaseJanela.id
        const DataGridFornecedor = DataGrid
        const api = apiServer + "fornecedor/todos"
        fetch(api)
            .then(res => res.json())
            .then(retorno => {
                if(retorno.length>0){
                    DataGridFornecedor.criaLista(dgFor, retorno)
                }
            })
        const selecionar = () => {
            registroSelected = DataGridFornecedor.campoRetorno
            DataGridFornecedor.hideLista()
            divBaseJanela.remove()
            NomeFornecedor.inpCampo.value = registroSelected.FOR_NOME
        }
    }
        const divRodape = document.createElement('div');
        divRodape.setAttribute('id', 'divRodape');
        divRodape.setAttribute('class', 'styRodape');
        divRodape.setAttribute('style', '')
        divJanela.appendChild(divRodape);

        const btncancela = document.createElement('input');
        btncancela.setAttribute('id', 'btncancela');
        btncancela.setAttribute('type', 'Button');
        btncancela.setAttribute('value', 'Cancelar');
        btncancela.setAttribute('class', 'styBtn')
        btncancela.setAttribute('style', '');
        divRodape.appendChild(btncancela);
        btncancela.addEventListener('click', () => {
            divBaseJanela.remove()
        })

}

const carregaContatos = async (fcoFornec) => {
    const apiColab = apiServer+"fornecedor/contatos/?FCO_FORNEC="+fcoFornec
    await fetch(apiColab)
        .then(res => res.json())
        .then(retorno => {
                contatosDoFornecedor = retorno
                return retorno
            })
}
const carregaTelefones = async (usuID) => {
    const apiColab = apiServer+"telefone/?TEL_USUARI="+usuID
    await fetch(apiColab)
        .then(res => res.json())
        .then(retorno => {
                telefonesDoUsuario = retorno
                return retorno
            })
}
const listaTelefones = async(contid)=>{
    const destino = document.querySelector('#dgBase')
    const jfonte = janelaPopup(destino,'<h2> Listagem dos Telefones</h2>')
    //const titulo= jfonte.querySelector('#janTitulo')
    const janDados = jfonte.querySelector('#DivPDados')
    const janRodape = jfonte.querySelector('#DivPRodape')
    destino.style.zIndex=9999999
    janDados.style.flexDirection='row'
    janDados.style.gap='10px'
    janDados.style.flexWrap='wrap'
    janRodape.style.height='30px'
    await carregaTelefones(contid)

    const styDivTelefone = 'display : flex;'
    +'align-items : center;'
    +'justify-content : flex-start;'
    +'flex-direction : row;'
    +'width : 155px!important;'
    +'padding : 2px 0 2px 0 ;'
    +'border-radius : 8px 8px 8px 8px;'
    +'background-color: rgb(220,220,220);'
    telefonesDoUsuario.map((ite,id)=>{
        const telContato = criaBotaoRedondo(janDados,'BtnPTelefone','btnMenu','../img/telefo.svg','',()=>{})
        console.log(telContato.inpCampo.style.cursor)
        telContato.inpCampo.style.removeProperty('cursor')
        telContato.divCampo.style.background='rgb(220,220,220)'
        telContato.divCampo.style.borderRadius='6px'
        telContato.divCampo.style.flexDirection='row'
        telContato.divCampo.style.padding='0px 3px 0px 3px'
        telContato.divCampo.style.gap='3px'
        telContato.divCampo.style.alignItems='center'
        telContato.divCampo.style.justifyContent='center'


        const divNumTelefone  =criaGrupCampos(telContato.divCampo ,'divCNumTel','styDivCampos')
        divNumTelefone.innerHTML=ite.TEL_TELEFO
    })
}

const addContato = (colabid,id, nome) => {
    const divDados = document.querySelector('#GruLinha04')
    const styDivContato = 'display : flex;'
    +'align-items : center;'
    +'justify-content : center'
    +'flex-direction : row;'
    +'border-radius : 8px 8px 8px 8px;'
    +'background-color : rgb(232,232,232);'
    +'margin : 3px 0px 3px 3px;'
    +'gap : 3px'
    const styImgCta = 'background-color : #248 !important;'
       +'height : 25px;'
       +'width : 25px;'
       +'margin : 2px 3px 2px 3px;'
    
    const divCampoContato = criaGrupCampos(divDados, 'divCamoContatos', 'styDivCampos');
    divCampoContato.style=styDivContato
    const imgTrashTelefone = criaBotaoRedondo(divCampoContato,'inpImgContato','btnMenu','../img/tellist.svg','Lista Telefones',()=>{telContatos()})
    imgTrashTelefone.inpCampo.style=styImgCta
    imgTrashTelefone.divCampo.style.height='100%'
    imgTrashTelefone.divCampo.style.width='100%'
    imgTrashTelefone.divCampo.style.removeProperty('background-color')

    const telContatos =()=>{
        const idFco = imgTrashTelefone.divCampo.nextElementSibling.innerHTML
        listaTelefones(idFco)
    }

    var divCampos = criaGrupCampos(divCampoContato, 'divContatoLisId', 'styDivTelefones');
    divCampos.setAttribute('data-colab',colabid)
    divCampos.innerHTML = id

    var divCampos = criaGrupCampos(divCampoContato, 'divContatoLisNome', 'styDivTelefones');
    divCampos.setAttribute('style', 'margin-right : 5px');
    divCampos.innerHTML = nome
}

const janelaFornecedor = () =>{
    const divJBForFundo = criaDivBase(document.querySelector('#dgBase'),'divJBForFundo');
    const divJanela = criaGrupCampos(divJBForFundo,'DivJanela','styJanela')
    const divTitulo = criaGrupCampos(divJanela,'DivTitulo','styTitulo')
    const divFantasma = criaGrupCampos(divTitulo,'DivFantasma','')
    const divTextoTitulo = criaGrupCampos(divTitulo,'DivTexto','')
    divTitulo.innerHTML +='<H2> Fornecedor <h2>'
    const divDados = criaGrupCampos(divJanela,'DivDados','styDados')
    const divRodape = criaGrupCampos(divJanela,'DivRodape','styRodape')
    const btnSair = criaBotaoRedondo(divTitulo,'BtnSair','styBtnRedondo','../img/close.svg','Fechar Janela',()=>{divJBForFundo.remove()})
    btnSair.inpCampo.style.backgroundColor='red'
    divTitulo.style.flexDirection='row'
    divTitulo.style.justifyContent='space-between'

    const grupoL1 = criaGrupCampos(divDados, 'GruLinha01', 'styGrupCampos');
    const CampoId = criCampo(grupoL1, 'Id', 'styCampInput', "Id")
    CampoId.divCampo.style = 'width : 10% !important;'
    CampoId.inpCampo.setAttribute('disabled', 'true')
    const CampoNome = criCampo(grupoL1, 'Produto', 'styCampInput', "Nome do Produto")
    CampoNome.inpCampo.setAttribute('autofocus','true')
    const CampoRazao = criCampo(divDados, 'Razao', 'styCampInput', "Razão Social")
    const grupoL3 = criaGrupCampos(divDados, 'GruLinha03', 'styGrupCampos');    
    const CampoStatus = criCampo(grupoL3, 'Status', 'styCampInput', "Status")
    const CampoCnpj = criCampo(grupoL3, 'Cnpj', 'styCampInput', "Cnpj")
    const grupoL4 = criaGrupCampos(divDados, 'GruLinha04', 'styGrupCampos');
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
                            addContato(ite.FCO_ID, ite.USO_ID, ite.USO_NOME, document.querySelector('#divCPessoas'), 0)
                        })
                    }
                }
                ctu()                                   
            }
        })
        .catch(error => console.log('error', error));
}
const verFornecedor =()=>{janelaFornecedor()}

const toggleStatus = ()=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ "PRO_STATUS": DataGrid.campoRetorno.PRO_STATUS, "PRO_ID" : DataGrid.campoRetorno.PRO_ID});
    var requestOptions = {
        method: 'PUT',
        mode: 'cors',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiServer+"produtos/status", requestOptions)
        .then(response => response.json())
        .then(result => { 
            refreshLista()
        })
        .catch(error => console.log('error', error)); 
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
divCampo.setAttribute('id','divC'+nome);
divCampo.setAttribute('class','styDivCampo');
divCampo.setAttribute('style','');
destino.appendChild(divCampo);
var labCampo = document.createElement('label');
labCampo.setAttribute('id','labC'+nome);
labCampo.setAttribute('class','styCampLabel');
labCampo.setAttribute('style','');
labCampo.innerHTML=titulo
divCampo.appendChild(labCampo);
var inpCampo = document.createElement('Input');
inpCampo.setAttribute('id','inpC'+nome);
inpCampo.setAttribute('class',classe);
inpCampo.setAttribute('style','');
inpCampo.setAttribute('type','text');
divCampo.appendChild(inpCampo);
return {'divCampo' : divCampo,'inpCampo' : inpCampo}
}

const criSelect = (destino,nome,classe,titulo)=>{
    var divCampo  = document.createElement('div');
    divCampo.setAttribute('id','divC'+nome);
    divCampo.setAttribute('class','styDivCampo');
    divCampo.setAttribute('style','');
    destino.appendChild(divCampo);
    var labCampo = document.createElement('label');
    labCampo.setAttribute('id','labC'+nome);
    labCampo.setAttribute('class','styCampLabel');
    labCampo.setAttribute('style','');
    labCampo.innerHTML=titulo
    divCampo.appendChild(labCampo);
    var inpCampo = document.createElement('Select');
    inpCampo.setAttribute('id','SelC'+nome);
    inpCampo.setAttribute('class',classe);
    inpCampo.setAttribute('style','');
    divCampo.appendChild(inpCampo);
    return {'divCampo' : divCampo,'SelCampo' : inpCampo}
    }

const criaDivBase = (destino,nome) => {
    const divBase = document.createElement('div');
    divBase.setAttribute('id', 'divBas'+nome);
    divBase.setAttribute('style', '');
    divBase.setAttribute('class', 'styBaseJanela');
    destino.append(divBase);
    return divBase
}

const criaBotaoRedondo = (destino, nome, classe, imagem, titulo, funcao) => {
    const divCampo = document.createElement('div');
    divCampo.setAttribute('id', 'divC' + nome);
    divCampo.setAttribute('class', 'divBotaoRedondo');
    divCampo.setAttribute('style','');
    destino.appendChild(divCampo);
    const inpCampo = document.createElement('input')
    inpCampo.setAttribute('id', 'btnC' + nome);
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
    inpCampo.setAttribute('id', 'inpB' + nome);
    inpCampo.setAttribute('class', classe);
    inpCampo.setAttribute('style', '');
    inpCampo.setAttribute('type','button')
    inpCampo.setAttribute('value', nome);
    inpCampo.addEventListener('click', funcao)
    destino.prepend(inpCampo);
    return inpCampo
}

const janelaPopup = (destino,titulo) => {
    const divPopFundo = criaDivBase(destino,'divPopFundo');
    const divJanela = criaGrupCampos(divPopFundo,'DivPJanela','styJanela')
    const divTitulo = criaGrupCampos(divJanela,'DivPTitulo','styTitulo')
    const divFantasma = criaGrupCampos(divTitulo,'DivPFantasma','')
    const divTextoTitulo = criaGrupCampos(divTitulo,'DivPTexto','')
    divTitulo.innerHTML +='<H2> '+titulo+' <h2>'

    const btnSair = criaBotaoRedondo(divTitulo,'BtnPSair','styBtnRedondo','../img/close.svg','Fechar Janela',()=>{divPopFundo.remove()})
    btnSair.inpCampo.style.backgroundColor='red'
    divTitulo.style.flexDirection='row'
    divTitulo.style.justifyContent='space-between'

    const divDados = criaGrupCampos(divJanela,'DivPDados','styDados')
    const divRodape = criaGrupCampos(divJanela,'DivPRodape','styRodape')

   return divJanela
}