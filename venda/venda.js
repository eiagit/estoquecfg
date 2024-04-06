import utkit from  './../utkit/utkit.js'
import { DataGrid } from "https://eiagit.github.io/DataGrid/src/dataGrid.js";
//import { Cxmsg } from "https://eiagit.github.io/java/cxmsg.js";
//import { DataGrid } from "../../../dataGrid.js";
const  divTitulo  = document.querySelector('#divTituloJanela')
const divProdutos = document.querySelector('#divBlocoE')
const divProduto  = document.querySelector('#divBlocoB')
const divTotal    = document.querySelector('#divtotal')
const divFormPago = document.querySelector('#divpagto')
const divParcela  = document.querySelector('#divParcela')
const divFecha    = document.querySelector('#divFecha')
const divBtnFecha = document.querySelector('#divBtnFecha')
const divAcrescimo = document.querySelector('#divAcrescimo')
const divDesconto = document.querySelector('#divDesconto')
const divBuscar    = document.querySelector('#divbuscar')
const divQuantidade = document.querySelector('#divQuantidade')
const divBtnIncluir = document.querySelector('#divBtnIncluir')
const divBtnApagar  = document.querySelector('#divBtnApagar')
const divPreco      = document.querySelector('#divPreco')
const divGeral      = document.querySelector('#divGeral')
const apiServer = sessionStorage.getItem('servidor')

divTitulo.style='display: flex; flex-direction : row ; justify-content : space-between !important; '
const divFata = utkit.criaGrupCampos(divTitulo,'div1')
divFata.style = 'display:flex;'
const divMeio = utkit.criaGrupCampos(divTitulo,'div2')
divMeio.innerHTML='Terminal de Vendas'
divMeio.style='displey:flex; ;'
const btnsA = utkit.criaGrupCampos(divTitulo,'div1')
btnsA.style = 'display : flex ; flex-direction : column ; justify-content : center'
const btnsB = utkit.criaGrupCampos(btnsA,'div1')
btnsB.style = 'display : flex;flex-direction : row;justify-content : flex-end'
const btnAjuda = utkit.criaBtnImgRedondo(btnsB,'btnHelp','divBtnImgRedondo','../img/helpw.svg','Ajuda',()=>{})
btnAjuda.divCampo.style = 'display:flex; justify-content : flex-end; ;'
btnAjuda.inpCampo.style = 'backgroud-color : blue ; background-color : rgb(95, 95, 255) ;width : 33px'
btnAjuda.inpCampo.addEventListener('click',()=>{
    const destino = document.querySelector('#divJanelaVenda')
    const janelaAjuda = utkit.janelaPopup(destino,'Ajuda')
    const textoAjuda = janelaAjuda.children[1]
    textoAjuda.innerHTML  = 'Teclas de Atalho :'
    textoAjuda.innerHTML += '<br> Obs.: Todas as teclas de Atalho só funcionam com o cursor'
    textoAjuda.innerHTML += '<br> na caixa de texto pesquisa'
    textoAjuda.innerHTML += '<br>'
    textoAjuda.innerHTML += '<br> (=) igual : abre a janela de busca produto'
    textoAjuda.innerHTML += '<br> (;) ponto e virgula : Salta para a escolha da forma de pagamento'
    textoAjuda.innerHTML += '<br> ([) abre chave : Abre a digitação do Acrescimo'
    textoAjuda.innerHTML += '<br> (]) fecha chave : Abre a digitação do Desconto'
    textoAjuda.innerHTML += '<br> (*) quantidade + * : quantidade a ser vendida'
    textoAjuda.innerHTML += '<br> (Ctrl + Enter) : Fecha a venda'
    textoAjuda.innerHTML += '<br> (codigo + Enter) : Vende um produto por codigo'
    textoAjuda.innerHTML += '<br> (codigo + (-) : Exclui um produto por codigo'

})
const btnMenu = utkit.criaBtnImgRedondo(btnsB,'btnmenu','divBtnImgRedondo','../img/menu.svg','Menú Relatórios',()=>{})
btnMenu.divCampo.style = 'display:flex; justify-content : flex-end; '
btnMenu.inpCampo.style = 'backgroud-color : blue ; background-color : rgb(95, 95, 255) ;width : 33px'
btnMenu.divCampo.style = 'display:flex ; width : 33px ; flex-direction : column'
btnMenu.inpCampo.addEventListener('click',()=>{
    const dbMenu = {
        destino: btnsA,
        top: '10px !important',
        left: '0px',
        width: '200px !important',
        opcoes: [
            { nome: 'Caixa do Dia', src: '../img/newuser.svg', acao: () => { relCaixa() } },
            { nome: 'Vendas do Dia', src: '../img/colab.svg', acao: () => { relVendas() } },
            { nome: 'Produtos Vendidos', src: '../img/login.svg', acao: () => { relVenProdutos() } },
            { nome: 'Fechar', src: '../img/close.svg', acao: () => { utkit.MenuFlutuante.hide() } },
        ]

    }
    utkit.MenuFlutuante.show(dbMenu)
})
const relCaixa=()=>{
    const dgDados={
        destino : '#JbGrid',
        local   : 'pt-br'   ,
        moeda   : 'BRL'     ,
        funcoes: {
            "grid"   : { "linha": ""    , "cor"   : "red"},
            "filtro" : { "hide" : true , "campo" : 1      ,"selectHide" : false },
            "rodape" : { "hide" : false},
            "titulo" : { "hide" : false , "cor"   : "#49F"},
            "onclose" : { "hide" : false , "funcao" : ()=>{dbgridFecha()}},
            "acoes"  : { "hide" : true , "titulo": "Ações", "width": "90px", "align": "center","material" : 'ion-icon','clicklinha' : ()=>{} },
            icones : {
                prod   : { hide: false  , name: 'search-outline'  , func: ()=>{}},
            }
        },
        campos: [
            { campo : 'PAG_NOME'    , titulo: 'Pagamento'           , formato : 'g' , width: '250px' , align: 'left' , soma : false},
            { campo : 'VCN_VALOR' , titulo: 'Total'                 , formato : 'm' , width: '150px', align: 'right', soma : true},                
        ]
    }
    const api = apiServer+"venda/caixa"
    fetch(api)
        .then(res => res.json())
        .then(retorno => {
            console.log(retorno)
            if (retorno.length>0) {
                const jbGrid = utkit.criaDivBase(document.body,'JbGrid')
            DataGrid.criaLista(dgDados, retorno)}

        })    
}
const relVendas=()=>{
    const dgDados={
        destino : '#JbGrid',
        local   : 'pt-br'   ,
        moeda   : 'BRL'     ,
        funcoes: {
            "grid"   : { "linha": ""    , "cor"   : "red"},
            "filtro" : { "hide" : true , "campo" : 1      ,selectHide : false },
            "rodape" : { "hide" : false},
            "titulo" : { "hide" : false , "cor"   : "#49F"},
            "onclose" : { "hide" : false , "funcao" : ()=>{dbgridFecha()}},
            "acoes"  : { "hide" : true , "titulo": "Ações", "width": "90px", "align": "center","material" : 'ion-icon','clicklinha' : ()=>{} },
            icones : {
                prod   : { hide: false  , name: 'search-outline'  , func: ()=>{}},
            }
        },
        campos: [
            { campo : 'VCN_ID'    , titulo: 'ID'           , formato : 'g' , width: '80px' , align: 'left' , soma : false},
            { campo : 'VCN_DATA'    , titulo: 'Data'           , formato : 'd' , width: '80px' , align: 'left' , soma : false},
            { campo : 'VCN_TIME'    , titulo: 'Hora'           , formato : 'g' , width: '80px' , align: 'left' , soma : false},
            { campo : 'PAG_NOME'    , titulo: 'Pagamento'           , formato : 'g' , width: '100px' , align: 'left' , soma : false},
            { campo : 'VCN_VALOR' , titulo: 'Produtos'                 , formato : 'm' , width: '120px', align: 'right', soma : true},
            { campo : 'VCN_DESCON' , titulo: 'Desconto'                 , formato : 'm' , width: '120px', align: 'right', soma : true},
            { campo : 'VCN_ACRESC' , titulo: 'Acrescimo'                 , formato : 'm' , width: '120px', align: 'right', soma : true},
            { campo : 'VCN_VENDA' , titulo: 'Total'                 , formato : 'm' , width: '150px', align: 'right', soma : true},
        ]
    }
    const api = apiServer+"venda/vendas"
    fetch(api)
        .then(res => res.json())
        .then(retorno => {
            if (retorno.length>0) {
                const jbGrid = utkit.criaDivBase(document.body,'JbGrid')
                DataGrid.criaLista(dgDados, retorno)
            }

        })    
}
const relVenProdutos=()=>{
    const dgDados={
        destino : '#JbGrid',
        local   : 'pt-br'   ,
        moeda   : 'BRL'     ,
        funcoes: {
            "grid"   : { "linha": ""    , "cor"   : "red"},
            "filtro" : { "hide" : true , "campo" : 1      ,selectHide : false },
            "rodape" : { "hide" : false},
            "titulo" : { "hide" : false , "cor"   : "#49F"},
            "onclose" : { "hide" : false , "funcao" : ()=>{dbgridFecha()}},
            "acoes"  : { "hide" : true , "titulo": "Ações", "width": "90px", "align": "center","material":"ion-icon",'clicklinha' : ()=>{} },
            icones : {
                prod   : { hide: false  , name: 'search-outline'  , func: ()=>{}},
            }
        },
        campos: [
            { campo : 'PRO_ID'    , titulo: 'Id'           , formato : 'g' , width: '80px' , align: 'left' , soma : false},
            { campo : 'PRO_NOME'    , titulo: 'Descrição do Produto'           , formato : 'g' , width: '350px' , align: 'left' , soma : false},
            { campo : 'MOV_QUANTI' , titulo: 'Quantidade'                 , formato : 'g' , width: '100px', align: 'right', soma : true},
            { campo : 'MOV_VALOR' , titulo: 'Valor'                 , formato : 'm' , width: '120px', align: 'right', soma : true},
            { campo : 'MOV_TOTAL' , titulo: 'Total'                 , formato : 'm' , width: '120px', align: 'right', soma : true},
        ]
    }
    const api = apiServer+"venda/produtos"
    fetch(api)
        .then(res => res.json())
        .then(retorno => {
            if (retorno.length>0) {
                const jbGrid = utkit.criaDivBase(document.body,'JbGrid')
                DataGrid.criaLista(dgDados, retorno)
            }
        })    
}


const divDesTitulo = utkit.criaGrupCampos(divDesconto,'divDesTitulo','')
const divDesValor = utkit.criaGrupCampos(divDesconto,'divDesValor','')
const divAcrTitulo = utkit.criaGrupCampos(divAcrescimo,'divAcrTitulo','')
const divAcrValor = utkit.criaGrupCampos(divAcrescimo,'divAcrValor','')

const labDes = utkit.criaLabel(divDesTitulo,'labelDesconto','','Desconto')
labDes.divCampo.style="font-size:small;position:relative"

const labAcr = utkit.criaLabel(divAcrTitulo,'labelDesconto','','Acréscimo')
labAcr.divCampo.style="font-size:small;position:relative"

divAcrValor.innerHTML='R$ 0,00'
divDesValor.innerHTML='R$ 0,00'
divDesconto.setAttribute('data-valor',0);
divAcrescimo.setAttribute('data-valor',0);

divAcrescimo.setAttribute('data-valor',0);
divQuantidade.innerHTML='1'
divQuantidade.style='height : 100%; width : 55% !important; justify-content : center'
const dgDados={
    destino : '#JbGrid',
    local   : 'pt-br'   ,
    moeda   : 'BRL'     ,
    funcoes: {
        "titulo"  : { "hide" : false , "cor"    : "#49F"},
        "filtro"  : { "hide" : false , "campo"  : 1      ,selectHide : false },
        "onclose" : { "hide" : false , "funcao" : ()=>{dbgridFecha()}},
        "grid"    : { "linha": ""    , "cor"    : "red"},
        "rodape"  : { "hide" : false},
        "acoes"  : { "hide" : false , "titulo": "F", "width": "50px", "align": "center","material" : 'google','clicklinha' : ()=>{produtoOK()}},
        icones : {
            prod   : { hide: false  , name: 'done_all'  , func: ()=>{}},
        }
    },
    campos: [
        { campo : 'PRO_ID'    , titulo: 'Id'                    , formato : 'g' , width: '50px' , align: 'left' , soma : false},
        { campo : 'PRO_NOME'  , titulo: 'Descrissão do Produto' , formato : 'g' , width: '370px', align: 'left' , soma : false},
        { campo : 'PRO_PRECO' , titulo: 'Preço'                 , formato : 'm' , width: '100px', align: 'right', soma : true},        
    ]
}
const btnIncluir = utkit.criaBtnImgRedondo(divBtnIncluir,'BtnIncluir','divBtnImgRedondo','../img/venpromaw.svg','Inclui item',()=>{})
divBtnIncluir.style='width 20%;'
btnIncluir.inpCampo.style='background-color: rgb(19, 107, 19); box-shadow: 5px 5px 5px black;'

const btnExcluir = utkit.criaBtnImgRedondo(divBtnApagar,'BtnIncluir','divBtnImgRedondo','../img/venpromew.svg','Exclui item',()=>{})
divBtnApagar.style='width 20%;'
btnExcluir.inpCampo.style='background-color: rgb(105, 18, 18);; box-shadow: 5px 5px 5px black;'
btnExcluir.inpCampo.addEventListener('click',()=>{
    console.log(buscarProduto.inpCampo.value)
    if (buscarProduto.inpCampo.value.trim() !=''){
        const produtos = [...divProdutos.children]
        var total = 0
        produtos.map((ele,id)=>{
            if(ele.firstChild.innerHTML===buscarProduto.inpCampo.value.replace('-','')){
                ele.remove()
                buscarProduto.inpCampo.value=''
            }
        })
        buscarProduto.inpCampo.focus()
        calculaTotal()

    }
})

btnIncluir.inpCampo.addEventListener('click',()=>{
    pesquisaPorId()
})


divTotal.innerHTML='R$ 0,00'
var dataGridProdutos = undefined
const lerPgto = async ()=>{
    const api = apiServer+"pagamento"
    return fetch(api)
    .then(res=>res.json())
    .then(retorno=>{return retorno })
}

const carregaPagamento = async ()=>{
    const pagamentos = await lerPgto()
    const formpag = []
    pagamentos.map((ele,id)=>{ formpag.push(ele.PAG_NOME) })
    const pagamento = utkit.criSelect(divFormPago,'Pagamento','','Apagaar',formpag)
    pagamento.divCampo.style='width : 100% '
    pagamento.selCampo.style='width : 100% ;padding : 4px ; font-size: 150%; ; background-color : rgb(204, 204, 204)'
    pagamento.divCampo.firstChild.remove()
}
carregaPagamento()
const cardParcelas = utkit.criCampo(divParcela,'Parcelas','','Parcelas')
cardParcelas.inpCampo.value='0'
const btnFechamento = utkit.criaBotao(divBtnFecha
    ,'Checkut',['3d',true,1],[40,5],'0%',['green','#2af','gradialx']
    ,['google','shopping_cart_checkout','white'],'Fecha Venda',()=>{})

cardParcelas.inpCampo.style='border-radius : 5px ; padding : 6px; width : 100%;'
cardParcelas.divCampo.style='width :100% !important;'
divBtnFecha.style='height : 100% ; width : 50%;'

const btnCancelar = utkit.criaBotao(divBtnFecha
    ,'Checkut',['3d',true,1],[40,5],'50%',['red','#2af','gradialx']
    ,['google','close','white'],'Cancela Venda',()=>{})

btnCancelar.inpCampo.addEventListener('click',()=>{
    divProdutos.innerText=''
    cardParcelas.inpCampo.value='0'
    divAcrValor.innerHTML='R$ 0,00'
    divDesValor.innerHTML='R$ 0,00'
    divPreco.innerHTML='R$ 0,00'
    divTotal.innerHTML='R$ 0,00'
    divProduto.innerHTML=''
    divQuantidade.innerHTML='1'
    divDesconto.setAttribute('data-valor',0);
    divAcrescimo.setAttribute('data-valor',0);    
    document.querySelector('#Pagamento').firstChild.selectedIndex=0
})

divDesconto.addEventListener('click',(evt)=>{
    const destino = document.querySelector('#divJanelaVenda')
    const valorDesconto = utkit.janelaPopup(destino,'<h2>Valor do Desconto<h2>')
    valorDesconto.style='width : 400px!important';
    const jDados = valorDesconto.children[1]
    jDados.style='display : flex ; flex-direction: row !important; align-items : center;justify-content : center !important'
    var inputDesconto = utkit.criCampo(jDados,'inpDesconto','styDivCampo','Valor Desconto')
    inputDesconto.divCampo.style = 'width : 35% !important;padding : 30px 0 30px 7px '
    inputDesconto.inpCampo.style = 'paddin : 3px;border-radius : 5px'
    inputDesconto.inpCampo.setAttribute('type','number')
    inputDesconto.inpCampo.focus()
    inputDesconto.inpCampo.value=divDesconto.getAttribute('data-desconto')
    inputDesconto.inpCampo.addEventListener('keyup',(evt)=>{
        if(evt.key==='Enter'){
            if(inputDesconto.inpCampo.value != ''){
            divDesconto.setAttribute('data-valor',inputDesconto.inpCampo.value)
            const valdes = parseFloat(inputDesconto.inpCampo.value)
            divDesValor.innerHTML= valdes.toLocaleString(dgDados.local, { style: 'currency', currency: dgDados.moeda });
            }
            buscarProduto.inpCampo.focus()
            valorDesconto.parentNode.remove()
        }
    })
})

divAcrescimo.addEventListener('click',(evt)=>{
    const destino = document.querySelector('#divJanelaVenda')
    const valor = utkit.janelaPopup(destino,'<h2>Valor do Acrescimo<h2>')
    valor.style='width : 400px!important';
    const jDados = valor.children[1]
    jDados.style='display : flex ; flex-direction: row !important; align-items : center;justify-content : center !important'
    var entrada = utkit.criCampo(jDados,'inpDesconto','styDivCampo','Valor Desconto')
    entrada.divCampo.style = 'width : 35% !important;padding : 30px 0 30px 7px '
    entrada.inpCampo.style = 'paddin : 3px;border-radius : 5px'
    entrada.inpCampo.setAttribute('type','number')
    entrada.inpCampo.focus()
    entrada.inpCampo.value=divDesconto.getAttribute('data-desconto')
    entrada.inpCampo.addEventListener('keyup',(evt)=>{
        if(evt.key==='Enter'){
            if(entrada.inpCampo.value != ''){
            divAcrescimo.setAttribute('data-valor',entrada.inpCampo.value)
            const valdes = parseFloat(entrada.inpCampo.value)
            divAcrValor.innerHTML= valdes.toLocaleString(dgDados.local, { style: 'currency', currency: dgDados.moeda });
            }
            buscarProduto.inpCampo.focus()
            valor.parentNode.remove()
        }
    })
})

btnFechamento.inpCampo.addEventListener('click', () => {
    const fita = utkit.janelaPopup(divGeral, 'Cupon da Venda',()=>{})
    fita.style = 'width:600px !important; '
    const janDados = fita.querySelector('#DivPDados')
    janDados.style = "font-family: 'Courier New', Courier, monospace; width : 550px ; padding : 6px 5px 10px 5px ;"
    const produtos = [...divProdutos.children]
    const cuonLinha = utkit.criaGrupCampos(janDados, 'cuponLinha')
    //janDados.innerHTML=''
    cuonLinha.innerHTML += '    Empresa  .: Ennios´s Inteligência Artificial'
    cuonLinha.innerHTML += '<BR>Endereço .: Rua José Ferreira Sobrinho,21'
    cuonLinha.innerHTML += '<BR>Bairro   .: Centro'
    cuonLinha.innerHTML += '<BR>Cidade   .: Ipiaú-Baha Cep 45.570.000'
    cuonLinha.innerHTML += '<BR>Telefone .: (73)98816-3135'
    cuonLinha.innerHTML += '<BR>C.N.P.J .: 17.728.897.0001-77'
    var lineData = new Date()
    lineData = `${('0' + lineData.getDate()).slice(-2)}/${('0' + (parseInt(lineData.getMonth()) + 1)).slice(-2)}/${('0000' + lineData.getFullYear()).slice(-4)}`
    cuonLinha.innerHTML += '<BR>Data     .: ' + lineData
    cuonLinha.innerHTML += '<BR>************************************** PRODUTOS ********************************'
    produtos.map((ele, id) => {
        const cuonLinha = utkit.criaGrupCampos(janDados, 'cuponLinha')
        cuonLinha.style = 'display : flex; width : 100% ; flex-direction : row; '
        const cuponId = utkit.criaGrupCampos(cuonLinha, 'cuponId')
        cuponId.innerHTML = ele.children[0].innerHTML
        cuponId.style = 'display:flex;width : 10%; '
        const cuponNome = utkit.criaGrupCampos(cuonLinha, 'cuponNome')
        cuponNome.innerHTML = ele.children[1].innerHTML
        cuponNome.style = 'display:flex;width : 52% ; '
        const cuponPreco = utkit.criaGrupCampos(cuonLinha, 'cuponPreco')
        cuponPreco.innerHTML = ele.children[2].innerHTML
        cuponPreco.style = 'display:flex;width : 15%;justify-content : flex-end'
        const cuponQuanti = utkit.criaGrupCampos(cuonLinha, 'cuponQuanti')
        cuponQuanti.innerHTML = ele.children[3].innerHTML
        cuponQuanti.style = 'display:flex;width : 8%;justify-content : center'
        const cuponTotal = utkit.criaGrupCampos(cuonLinha, 'cuponTotal')
        cuponTotal.innerHTML = ele.children[4].innerHTML
        cuponTotal.style = 'display:flex;width : 15%;justify-content : flex-end'
    })
    const cuponfimTotal = utkit.criaGrupCampos(janDados, 'cuponQuanti')
    cuponfimTotal.style = 'display:flex; flex-direction : column; text-align : right ;width : 100%'
    cuponfimTotal.innerHTML = '---------------------------------------------------------------------------------'
    cuponfimTotal.innerHTML += '<br>Produtos  =    ' + divTotal.innerHTML;
    cuponfimTotal.innerHTML += '<br>Acrescimos =    ' + divAcrValor.innerHTML;
    cuponfimTotal.innerHTML += '<br>Descontos =    ' + divDesValor.innerHTML;
    const fpgto = document.querySelector('#Pagamento').firstChild
    const valorFinal = parseFloat(divTotal.getAttribute('date-valor')) + parseFloat(divAcrescimo.getAttribute('data-valor')) - parseFloat(divDesconto.getAttribute('data-valor'))
    cuponfimTotal.innerHTML += '<br>' + fpgto[fpgto.selectedIndex].innerHTML + ' =    ' + valorFinal.toLocaleString(dgDados.local, { style: 'currency', currency: dgDados.moeda });
    var data  = new Date()
    data = data
    var hora = new Date().toLocaleTimeString('pt-BR')
    const cabeca = {
        'VCN_DATA': data,
        'VCN_TIME': hora.replaceAll(":",':'),
        'VCN_VALOR': parseFloat(divTotal.getAttribute('date-valor')),
        'VCN_PAGTO': fpgto.selectedIndex,
        'VCN_CANCEL': 0,
        'VCN_VENDED': -1,
        'VCN_PDV': 1,
        'VCN_USUARI': parseInt(sessionStorage.getItem('logId')),
        'VCN_DESCON': parseFloat(divDesconto.getAttribute('data-valor')),
        'VCN_ACRESC': parseFloat(divAcrescimo.getAttribute('data-valor')),
        "VCN_CLIENT": -1
    }
    var dados = []
    produtos.map((ele, id) => {
        const campo = {
            'MOV_USUARI': parseInt(sessionStorage.getItem('logId')),
            'MOV_TIPO': 1,
            'MOV_DATA': data,
            'MOV_VALOR': parseFloat(ele.getAttribute('date-valor')),
            'MOV_PRODUT': parseFloat(ele.getAttribute('date-id')),
            'MOV_QUANTI': parseFloat(ele.getAttribute('date-quantidade'))
        }
        dados.push(campo)
    })
    gravaCupon(cabeca,dados)
})

const gravaCupon = (cabeca,dados)=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({'VCN_DATA': cabeca.VCN_DATA,'VCN_TIME': cabeca.VCN_TIME,'VCN_VALOR': cabeca.VCN_VALOR,'VCN_PAGTO': cabeca.VCN_PAGTO,'VCN_CANCEL': cabeca.VCN_CANCEL,'VCN_VENDED': cabeca.VCN_VENDED,'VCN_PDV'   : cabeca.VCN_PDV,'VCN_USUARI': cabeca.VCN_USUARI,'VCN_DESCON': cabeca.VCN_DESCON,'VCN_ACRESC': cabeca.VCN_ACRESC,"VCN_CLIENT": cabeca.VCN_CLIENT});
    var requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiServer + 'venda', requestOptions)
        .then(response => response.json())
        .then(result => {
            var VCN_ID = result[0].VCN_ID
            dados.map((ite, id) => {
                var raw = JSON.stringify({ 'MOV_USUARI' : ite.MOV_USUARI ,'MOV_TIPO' :  ite.MOV_TIPO , 'MOV_DATA' : ite.MOV_DATA, 'MOV_VALOR' : ite.MOV_VALOR, 'MOV_QUANTI' : ite.MOV_QUANTI , 'MOV_PRODUT' : ite.MOV_PRODUT,'MOV_VCNID': VCN_ID});
                var requestOptions = {
                    method: 'POST',
                    mode: 'cors',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };                
                fetch(apiServer + 'produtos/movimento', requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        var raw = JSON.stringify({ 'MOV_TIPO': ite.MOV_TIPO, 'MOV_QUANTI': ite.MOV_QUANTI, 'PRO_ID': ite.MOV_PRODUT });
                        var requestOptions = {
                            method: 'PUT',
                            mode: 'cors',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };
                        fetch(apiServer + 'produtos/estoque', requestOptions)
                            .then(response => response.json())
                            .then(result => {
                            })
                            .catch(error => console.log('error', error));
                    })
                    .catch(error => console.log('error', error));

            })
            btnCancelar.inpCampo.click()
        })

}    

const buscarProduto = utkit.criaInput(divBuscar,'Busca','','')
buscarProduto.divCampo.style='width : 100% ; padding : 0 4px 0 4px'
buscarProduto.inpCampo.style='padding : 9px;border-radius : 8px;width : 100%'
buscarProduto.inpCampo.focus()
//const btnBuscar = utkit.criaBtnImgRedondo(divBuscar,'BtnIncluir','divBtnImgRedondo','../img/searchw.svg','Busca Produto',()=>{})
//btnBuscar.inpCampo.style='background-color: rgb(255, 106, 0); box-shadow: 5px 5px 5px black;'

const btnBuscar = utkit.criaBotao(divBuscar
    ,'BtnIncluir',['none',true,1],[40,0],'50%',['rgb(255, 106, 0)','#2af','gradialx']
    ,['google','search','white'],'Buscar Produto',()=>{})

divPreco.innerHTML='R$ 0,00'

buscarProduto.inpCampo.addEventListener('keyup',(evt)=>{
    const click = evt.key
    if (click==='*' && parseInt(buscarProduto.inpCampo.value)>0){
        divQuantidade.innerHTML=parseInt(buscarProduto.inpCampo.value)
        buscarProduto.inpCampo.value=''
    }
    if (click === 'Enter' && buscarProduto.inpCampo.value!=''){
        btnIncluir.inpCampo.click()
    }
    if (click === '-'){
        btnExcluir.inpCampo.click()
    }
    if (click === '='){
        buscarProduto.inpCampo.value=''
        btnBuscar.inpCampo.click()
    }    
    if (click === ';'){
        buscarProduto.inpCampo.value=''
        document.querySelector('#Pagamento').firstChild.focus()
    }
    if (click === '['){
        divAcrescimo.click()
        buscarProduto.inpCampo.value=''

    }    
    if (click === ']'){
        divDesconto.click()
        buscarProduto.inpCampo.value=''
        
    }        
    if (evt.ctrlKey &&click === 'Enter'){
        btnFechamento.inpCampo.click()
    }
    //console.log(click) 
    
})

btnBuscar.inpCampo.addEventListener('click',(evt)=>{
    GridProdutos()
})

const GridProdutos = ()=>{
    const jbGrid = utkit.criaDivBase(document.body,'JbGrid')
    console.log('atualizou')
    const carregaProdutos = () => {
        const apiColab = apiServer+"Produtos"
        fetch(apiColab)
            .then(res => res.json())
            .then(retorno => {
                dataGridProdutos = DataGrid.criaLista(dgDados, retorno)
            })
    }
    carregaProdutos()    
}

const produtoOK = () =>{
    DataGrid.hideLista()
    criaLinha(DataGrid.campoRetorno)
}

const criaLinha = (linha) =>{
    const divLinhaProduto = utkit.criaGrupCampos(divProdutos,'LinhaProdoto','divLinhaProdutos')
    
    const divLinhaId = utkit.criaGrupCampos(divLinhaProduto,'LinhaProdoto','divLinhaProduto')
    divLinhaId.style='width : 10% ;padding : 0 0px 0 3px;'
    divLinhaId.innerHTML=linha.PRO_ID

    const divLinhaNome = utkit.criaGrupCampos(divLinhaProduto,'LinhaProdoto','divLinhaProduto')
    divLinhaNome.style='width : 50%'
    divLinhaNome.innerHTML=linha.PRO_NOME
    divProduto.innerHTML=linha.PRO_NOME

    const divLinhaPreco = utkit.criaGrupCampos(divLinhaProduto,'LinhaProdoto','divLinhaPreco')
    divLinhaPreco.style = 'width : 15%'
    const preco = linha.PRO_PRECO
    divLinhaPreco.innerHTML = preco.toLocaleString(dgDados.local, { style: 'currency', currency: dgDados.moeda });
    divPreco.innerHTML=divLinhaPreco.innerHTML
        
    const divLinhaQuantidade = utkit.criaGrupCampos(divLinhaProduto,'LinhaProdoto','divLinhaQuantidade')
    divLinhaQuantidade.style = 'width : 10%'
    divLinhaQuantidade.innerHTML = divQuantidade.innerHTML
    divQuantidade.innerHTML = '1'

    const divLinhaTotal = utkit.criaGrupCampos(divLinhaProduto,'LinhaProdoto','divLinhaTotal')
    divLinhaTotal.style = 'width : 15%'
    const valorTotal = linha.PRO_PRECO * divLinhaQuantidade.innerHTML
    divLinhaTotal.innerHTML = valorTotal
    divLinhaTotal.innerHTML = valorTotal.toLocaleString(dgDados.local, { style: 'currency', currency: dgDados.moeda });

    divLinhaProduto.setAttribute('date-quantidade',divLinhaQuantidade.innerHTML)
    divLinhaProduto.setAttribute('date-valor',linha.PRO_PRECO)
    divLinhaProduto.setAttribute('date-id',linha.PRO_ID)
    calculaTotal()
}

const calculaTotal = ()=>{
    const produtos = [...divProdutos.children]
    var total = 0
    produtos.map((ele,id)=>{
        total+= ele.getAttribute('date-valor') * ele.getAttribute('date-quantidade')
    })
    divTotal.innerHTML= total.toLocaleString(dgDados.local, { style: 'currency', currency: dgDados.moeda });
    divTotal.setAttribute('date-valor',total)
    buscarProduto.inpCampo.focus()   

}
const dbgridFecha =()=>{
    const doc = document.querySelector('#JbGrid')
    if (doc!=undefined) doc.remove()
}

const pesquisaPorId = async ()=>{
    const linha = await pesquisar('PRO_ID')
    if (linha !=undefined){
       criaLinha(linha[0])
       buscarProduto.inpCampo.value=''
    }
}

const pesquisar = (campo)=>{
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        mode: 'cors',
        keepalive: false
    };
    const api = apiServer+`produto/id/?PRO_ID=${buscarProduto.inpCampo.value}`
    return fetch(api, requestOptions)
        .then(response => response.json())
        .then(retorno => {
            if (retorno.length > 0) {
                return retorno
                }
        })
        .catch(error => console.log('error', error));
    }