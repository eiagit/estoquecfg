import { DataGrid } from "https://eiagit.github.io/DataGrid/src/dataGrid.js";
//import { DataGrid } from "../../../dataGrid.js";
import { Cxmsg } from "https://eiagit.github.io/java/cxmsg.js";
import utkit from  './../utkit/utkit.js'
const janelaGrid = document.querySelector('#dataGridJ')
const btnCadastrar = document.querySelector('#btnCadastrar')
const btnPesquisar  = document.querySelector('#btnPesquisar')
const filtro = document.querySelector('#inputFiltro')
var fotoLogo = undefined
var telefonesDoUsuario = undefined
var contatosDoFornecedor = undefined
const apiServer = sessionStorage.getItem('servidor')

const dgDados={
    destino : '#dataGridJ',
    local   : 'pt-br'   ,
    moeda   : 'BRL'     ,
    funcoes: {
        "onclose" : { "hide" : false , "funcao" : ()=>{}},
        "grid"   : { "linha" : "V" , "cor" : "GRAY"},
        "filtro" : { "hide" : false , "campo" : 1 ,selectHide : false},
        "rodape" : { "hide" : false},
        "titulo" : { "hide" : false , "cor"   : "#49F"},
        "acoes"  : { "hide" : false , "titulo": "Ações", "width": "90px", "align": "center" ,"material" : 'ion-icon','clicklinha' : ()=>{}},
        icones : {
            switch : { hide: false  , name: 'lock-open-outline', func: ()=>{toggleAtivar()}},
            edit   : { hide: false  , name: 'pencil-outline'   , func: ()=>{alterar()}},
            delete : { hide: false  , name: 'trash-outline'    , func: ()=>{apagar()}},
            view   : { hide: false  , name: 'id-card-outline'  , func: ()=>{listaContatos()}},
            photo  : { hide: false  , name: 'camera-outline'   , func: ()=>{mostraFoto()}},
        }
    },
    campos: [
        { campo : 'FOR_ID'    , titulo: 'Id'                    , formato: 'g'   , width: '70px' , align: 'left', soma : false},
        { campo : 'FOR_NOME'  , titulo: 'Nome Colaborador'      , formato: 'g'   , width: '300px', align: 'left', soma : false},
        { campo : 'FOR_CNPJ'  , titulo: 'CNPJ'                , formato: 'g'   , width: '150px', align: 'left', soma : false},        
        { campo : 'FOR_STANOM', titulo: 'Status'                , formato: 'g'   , width: '150px', align: 'left', soma : false},

    ]
}

const carregaFornec = () => {
    const apiColab = apiServer+"fornecedor/todos"
    fetch(apiColab)
        .then(res => res.json())
        .then(retorno => {
            DataGrid.criaLista(dgDados, retorno)
                retorno.map((ite, id) => {
                    if (ite.FOR_STATUS == 0) {
                        document.querySelector('#dgLinha'+id).lastChild.firstChild.name='lock-closed-outline'
                        document.querySelector('#dgLinha'+id).lastChild.firstChild.style.color="red"
                    }
                    else{document.querySelector('#dgLinha'+id).lastChild.firstChild.style.color="green"}
                })
        })
}
carregaFornec()


const carregaContatos = async (fcoFornec) => {
    const apiColab = apiServer+"fornecedor/contatos/?FCO_FORNEC="+fcoFornec
    await fetch(apiColab)
        .then(res => res.json())
        .then(retorno => {
                contatosDoFornecedor = retorno
                return retorno
            })
}

const apagaUmContato = async(fcoId)=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({'FCO_ID': fcoId});
    var requestOptions = {
        method: 'DELETE',
        mode: 'cors',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    setTimeout( async() => {
        await fetch(apiServer+"fornecedor/contato", requestOptions)
            .then(response => response.json())
            .then(result => {
            })
            .catch(error => console.log('error', error));
        },300)
}

const inserirContato = async (forId,contId)=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ "FCO_FORNEC": forId , "FCO_CONTAT": contId });
    console.log(raw)
    var requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiServer+"fornecedor/contato", requestOptions)
        .then(response => response.text())
        .then(result => {
        })
        .catch(error => console.log('error', error));
}

const refreshLista = () => {
    const janelaBase = document.querySelector('#dgBase')
    if (janelaBase) janelaBase.remove()
    DataGrid.hideLista()
    carregaFornec()
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

const resposta = () => {
    if (Cxmsg.mr() == 'mrsim') {
        const usuario = dgDados.campoRetorno[0]['innerHTML']
        // APAGA USUARIO
        const apagaColab = () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({ "FOR_ID" : usuario });
            var requestOptions = {
                method: 'DELETE',
                mode: 'cors',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch(apiServer + "fornecedor", requestOptions)
                .then(response => response.text())
                .then(result => {
                    refreshLista()
                })
                .catch(error => console.log('error', error));
        }

        /*APAGA OS CONTATOS */
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "FOR_ID": DataGrid.campoRetorno.FOR_ID });
        var requestOptions = {
            method: 'DELETE',
            mode: 'cors',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(apiServer + "fornecedor/contatoapagatodos", requestOptions)
            .then(response => response.json())
            .then(result => {
                apagaColab()
            })
            .catch(error => console.log('error', error));

    }

}
   
const janelaFornec=()=>{
    const divBaseJanela = document.createElement('div');
    const styBaseJanela=
        'display : flex;'
        +'justify-content :center;'
        +'align-items : center;'
        +'position : absolute;'
        +'top : 0px;'
        +'left : 0px;'
        +'width : 100%;'
        +'height : 100vh;'
        +'background-color : rgba(0,0,0,0.7);'
        //+'z-index : 1;'
        ;
    divBaseJanela.setAttribute('id','divBaseJFor');
    divBaseJanela.setAttribute('style',styBaseJanela);
    divBaseJanela.setAttribute('class','styLJanela');
    document.body.appendChild(divBaseJanela);

    const divJanela = document.createElement('div');
    divJanela.setAttribute('id','divJanela');
    const styJanela='display : flex;'
        +'justify-content : flex-start;'
        +'align-items : flex-start;'
        +'flex-direction : column;'            
        +'width : 500px;'
    divJanela.setAttribute('style',styJanela);
    divBaseJanela.appendChild(divJanela);

    const divTitulo = document.createElement('div');
    const styTitulo =  'display: flex;'
    +'justify-content: center;'
    +'align-items: center;'
    +'flex-direction: colum;'
    +'background-color: #248;'
    +'color:white;'
    +'border-radius: 15px 15px 0 0;'
    +'width : 100%;'
    +'height: 50px;'
    +'padding:  5px 3px 5px 3px'
    divTitulo.setAttribute('id','divTitulo');
    divTitulo.setAttribute('class','styLTitulo');
    divTitulo.setAttribute('style',styTitulo)
    divTitulo.innerHTML='<h3> Altera Fornecedor</h3>'
    divJanela.appendChild(divTitulo);

    const divDados = document.createElement('div');
    divDados.setAttribute('id','divDados');
    const styDados='display : flex;'
        +'justify-content : flex-start;'
        +'align-items : flex-start;'
        +'flex-direction : column;'
        +'width : 100%;'
        +'background-color : rgb(245,245,245) !important;'
        +'padding : 5px 5px 5px 5px;';
    divDados.setAttribute('style',styDados);
    divDados.setAttribute('class','styLDados');
    divJanela.appendChild(divDados);

    const styDivCampos='display : flex;'
        +'justify-content : flex-start;'
        +'align-items : flex-start;'
        +'flex-direction : column;'
        +'width : 100%;'
        +'color : #000;'
        +'padding : 3px;';
    const styInput = 'display: flex ;'
        +'width : 100%;'
        +'padding : 3px;'
        const styLabel = 'displey: flex ;'
    const stySelect = 'displey: flex ;'
        +'width : 100%'
        +'padding : 3px'

    var divCampos  = document.createElement('div');
    divCampos.setAttribute('id','divCID');
    divCampos.setAttribute('class','styDivCampos');
    divCampos.setAttribute('style',styDivCampos);
    divDados.appendChild(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id','labCId');
    labCampos.setAttribute('class','stylabCampos');
    labCampos.setAttribute('style',styLabel);
    labCampos.innerHTML='Id'
    divCampos.appendChild(labCampos);
    var inpCampos = document.createElement('Input');
    inpCampos.setAttribute('id','inpCId');
    inpCampos.setAttribute('class','styinpCampos');
    inpCampos.setAttribute('style',styInput);
    inpCampos.setAttribute('type','number');
    inpCampos.setAttribute('readonly','true');                
    divCampos.appendChild(inpCampos);

    var divCampos  = document.createElement('div');
    divCampos.setAttribute('id','divCNome');
    divCampos.setAttribute('class','styDivCampos');
    divCampos.setAttribute('style',styDivCampos);
    divDados.appendChild(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id','labCNome');
    labCampos.setAttribute('class','stylabCampos');
    labCampos.setAttribute('style',styLabel);
    labCampos.innerHTML='Nome'
    divCampos.appendChild(labCampos);
    var inpCampos = document.createElement('Input');
    inpCampos.setAttribute('id','inpCNome');
    inpCampos.setAttribute('class','styinpCampos');
    inpCampos.setAttribute('style',styInput);
    inpCampos.setAttribute('type','text');
    divCampos.appendChild(inpCampos);

    var divCampos  = document.createElement('div');
    divCampos.setAttribute('id','divCRazao');
    divCampos.setAttribute('class','styDivCampos');
    divCampos.setAttribute('style',styDivCampos);
    divDados.appendChild(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id','labCRazao');
    labCampos.setAttribute('class','stylabCampos');
    labCampos.setAttribute('style',styLabel);
    labCampos.innerHTML='Razão Social'
    divCampos.appendChild(labCampos);
    var inpCampos = document.createElement('Input');
    inpCampos.setAttribute('id','inpCRazao');
    inpCampos.setAttribute('class','styinpCampos');
    inpCampos.setAttribute('style',styInput);
    inpCampos.setAttribute('type','text');
    divCampos.appendChild(inpCampos);

    const styDivCamposSelect ='display : flex;'
        +'align-items : flex-start;'
        +'justify-content : flex-start;'
        +'flex-direction : row;'
        +'width : 100%;'
        +'height : 100%'
        +'gap : 5px;'
    const divCamposSelect  = document.createElement('div');
    divCamposSelect.setAttribute('id','divCSelects');
    divCamposSelect.setAttribute('class','styDivCampos');
    divCamposSelect.setAttribute('style',styDivCamposSelect);
    divDados.appendChild(divCamposSelect);

    var divCampos  = document.createElement('div');
    divCampos.setAttribute('id','divCStatus');
    divCampos.setAttribute('class','styDivCampos');
    divCampos.setAttribute('style',styDivCampos);
    divCamposSelect.appendChild(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id','labCStatus');
    labCampos.setAttribute('class','stylabCampos');
    labCampos.setAttribute('style',styLabel);
    labCampos.innerHTML='Status'
    divCampos.appendChild(labCampos);

    var inpCampos = document.createElement('select');
    inpCampos.setAttribute('id','inpCStatus');
    inpCampos.setAttribute('class','stySelCampos');
    inpCampos.setAttribute('style',stySelect);
    divCampos.appendChild(inpCampos);  
    var  checkOpcao= document.createElement('option')
    checkOpcao.setAttribute('class','sysCoptions');
    checkOpcao.setAttribute('style','diplay:flex;');
    checkOpcao.innerHTML='Inativo'
    inpCampos.appendChild(checkOpcao);
    var  checkOpcao= document.createElement('option')
    checkOpcao.setAttribute('class','sysCoptions');
    checkOpcao.setAttribute('style','diplay:flex;');
    checkOpcao.innerHTML='Ativo'
    inpCampos.appendChild(checkOpcao);

    var divCampos  = document.createElement('div');
    divCampos.setAttribute('id','divCCnpj');
    divCampos.setAttribute('class','styDivCampos');
    divCampos.setAttribute('style',styDivCampos);
    divCamposSelect .appendChild(divCampos);
    var labCampos = document.createElement('label');
    labCampos.setAttribute('id','labCCnpj');
    labCampos.setAttribute('class','stylabCampos');
    labCampos.setAttribute('style',styLabel);
    labCampos.innerHTML='CNPJ'
    divCampos.appendChild(labCampos);
    var inpCampos = document.createElement('Input');
    inpCampos.setAttribute('id','inpCCnpj');
    inpCampos.setAttribute('class','styinpCampos');
    inpCampos.setAttribute('style',styInput);
    inpCampos.setAttribute('type','text');
    divCampos.appendChild(inpCampos);

     var divCampos  = document.createElement('div');
     divCampos.setAttribute('id','divCFoto');
     divCampos.setAttribute('class','styDivCampos');
     divCampos.setAttribute('style',styDivCampos);
     divDados.appendChild(divCampos);
     var labCampos = document.createElement('label');
     labCampos.setAttribute('id','labCFoto');
     labCampos.setAttribute('class','stylabCampos');
     labCampos.setAttribute('style',styLabel);
     labCampos.innerHTML='Logo da Empresa'
     divCampos.appendChild(labCampos);
     var inpCampos = document.createElement('Input');
     inpCampos.setAttribute('id','inpCFoto');
     inpCampos.setAttribute('class','styinpCampos');
     inpCampos.setAttribute('style',styInput);
     inpCampos.setAttribute('type','file');
     inpCampos.setAttribute('accept','image/png, image/jpeg, image/jpg')
     divCampos.appendChild(inpCampos);
     const eleFoto = inpCampos;
     eleFoto.addEventListener('change',(evt)=>{
        janelaPopup(divBaseJanela)
        const janTitulo = document.querySelector('#janTitulo')
        const janDados = document.querySelector('#JanDivDados')
        janDados.style.justifyContent='center'
        janDados.style.alignItems='center'        
        janTitulo.innerHTML="<f2>Foto<F2>";
        const styDivJanFoto = 'display : flex;'
            +'align-items : center;'
            +'justify-content : center;'
            +'width : 200px;'
            +'height : 266px;'
            +'flex-wrap : wrap;'
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
        divCampos.appendChild(imgCampos);
        converteImagemBase64(imgCampos,evt.target.files[0])
     })

     var divCampos  = document.createElement('div');
     divCampos.setAttribute('id','divCContatos');
     divCampos.setAttribute('class','styDivCampos');
     divCampos.setAttribute('style',styDivCamposSelect+' align-items : baseline ; display :content ');
     divDados.appendChild(divCampos);
     const divContatos = divCampos;

     var divCampos  = document.createElement('div');
     divCampos.setAttribute('id','divCPessoa');
     divCampos.setAttribute('class','styDivCampos');
     divCampos.setAttribute('style',styDivCampos);
     divContatos.appendChild(divCampos);
     var labCampos = document.createElement('label');
     labCampos.setAttribute('id','labCPessoa');
     labCampos.setAttribute('class','stylabCampos');
     labCampos.setAttribute('style',styLabel);
     labCampos.innerHTML='Contatos'
     divCampos.appendChild(labCampos);
     var inpCampos = document.createElement('Input');
     inpCampos.setAttribute('id','inpCPessoa');
     inpCampos.setAttribute('class','styinpCampos');
     inpCampos.setAttribute('style',styInput);
     inpCampos.setAttribute('type','text');
     divCampos.appendChild(inpCampos);
     const inpContatos = inpCampos;

     const styDivContatos=
     'display : flex;'
     +'justify-content : flex-start;'
     +'align-items : flex-start;'
     +'flex-direction : row;'
     +'border-radius : 5px;'
     +'width : 100%;'
     +'padding : 5px;'
     +'background-color : white;'
     +'flex-wrap: wrap;'
     +'gap : 5px;'
     +'background-color : gray'
     const divCContatos  = document.createElement('div');
     divCContatos.setAttribute('id','divCPessoas');
     divCContatos.setAttribute('class','styDivContatos');
     divCContatos.setAttribute('style',styDivContatos);
     divDados.appendChild(divCContatos);
     
     var divCampos  = document.createElement('div');
     divCampos.setAttribute('id','divCGrupBtn');
     divCampos.setAttribute('class','');
     divCampos.setAttribute('style','display:flex;  flex-direction : column ;');
     divContatos.appendChild(divCampos);
     const grupBtn = divCampos

     var divCampos  = document.createElement('div');
     divCampos.setAttribute('id','divCGranBtn');
     divCampos.setAttribute('class','');
     divCampos.setAttribute('style','display:flex;justify-content : flex-end;  flex-direction : column  heigth : 30px');
     grupBtn.appendChild(divCampos);
     const divCGranBtn = divCampos;

     var divCampos  = document.createElement('div');
     divCampos.setAttribute('id','divCBtnBotoes');
     divCampos.setAttribute('class','');
     divCampos.setAttribute('style',';display: flex ;align-items : baseline ; !important; gap : 5px');
     grupBtn.appendChild(divCampos);
     const divCBtnBotoes = divCampos
     
     var inpCampos = document.createElement('Input');
     inpCampos.setAttribute('id','inpBContato');
     inpCampos.setAttribute('class','btnMenu');
     inpCampos.setAttribute('style','');
     inpCampos.setAttribute('type','image');
     inpCampos.setAttribute('src','../img/find.svg')
     inpCampos.setAttribute('title','Busca Colaborador');
     divCBtnBotoes.appendChild(inpCampos);
     const BtnBuscarCta = inpCampos;

     var inpCampos = document.createElement('Input');
     inpCampos.setAttribute('id','inpBGrava');
     inpCampos.setAttribute('class','btnMenu');
     inpCampos.setAttribute('style','');
     inpCampos.setAttribute('type','image');
     inpCampos.setAttribute('src','../img/newuser.svg')
     inpCampos.setAttribute('title','Grava Colaborador');
     divCBtnBotoes.appendChild(inpCampos);
     const BtnGravaCta = inpCampos;

     BtnBuscarCta.addEventListener('click',(evt)=>{
        const divBaseJanela = document.createElement('div');
        const styBaseJanela =
            'display : flex;' 
            +'justify-content :center;' 
            +'align-items : center;' 
            +'position : absolute;' 
            +'top : 0px;' 
            +'left : 0px;' 
            +'width : 100%;' 
            +'height : 100vh;' 
            +'background-color : rgba(0,0,0,0.7);' 
            //'z-index : 2;'
            ;
        divBaseJanela.setAttribute('id', 'divBaseListaColab');
        divBaseJanela.setAttribute('style', styBaseJanela);
        divBaseJanela.setAttribute('class', 'styLJanela');
        document.body.append(divBaseJanela);
        
        const janelaGridPessoa = divBaseJanela
        const dgDados={
            destino : '#divBaseListaColab',
            local   : 'pt-br'   ,
            moeda   : 'BRL'     ,
            funcoes: {
                "onclose" : { "hide" : false , "funcao" : ()=>{fecharBaseGrid()}},
                "filtro" : { "hide" : false , "campo" : 1 ,selectHide : false},
                "rodape" : { "hide" : false},
                "grid"    : { "linha": ""    , "cor"    : "red"},
                "titulo" : { "hide" : false , "cor"   : "#49F"},
                "acoes"  : { "hide" : false , "titulo": "Ações", "width": "90px", "align": "center" ,"material" : 'ion-icon','clicklinha' : ()=>{}},
                icones : {
                    photo  : { hide: false  , name: 'checkmark-done-outline'   , func: ()=>{selecionar()}},
                }
            },
            campos: [
                { campo : 'USO_ID'    , titulo: 'Id'         , formato: 'g' , width: '70px' , align: 'left', soma : false},
                { campo : 'USO_NOME'  , titulo: 'Nome Pessoa', formato: 'g' , width: '300px', align: 'left', soma : false},
                { campo : 'USO_STANOM', titulo: 'Status'     , formato: 'g' , width: '150px', align: 'left', soma : false},
            ]
        }
        const DataGridColab =  DataGrid
            const apiColab = apiServer+"colaborador/contatos"
            fetch(apiColab)
                .then(res => res.json())
                .then(retorno => {
                    DataGridColab.criaLista(dgDados, retorno)
                })
        var colabSelected = undefined
        const fecharBaseGrid = ()=>{
            divBaseJanela.remove()
        }
         const selecionar = () => {

             colabSelected = DataGridColab.campoRetorno
             DataGridColab.hideLista()
             janelaGridPessoa.remove()
             inpContatos.value = colabSelected.USO_NOME
         }
         
        BtnGravaCta.addEventListener('click',(evt)=>{
            evt.preventDefault()
            if (inpContatos.value != "" && colabSelected!=undefined) {
                const contatInseridos = [].slice.call(document.querySelector('#divCPessoas').children)
                var exiteContato = false
                contatInseridos.map((ite,id)=>{
                    if(exiteContato==false && ite.firstChild.nextElementSibling.innerHTML==colabSelected.USO_ID) exiteContato = true
                })
                if (!exiteContato){
                    addContato(-1,colabSelected.USO_ID, colabSelected.USO_NOME,document.querySelector('#divCPessoas'),1);
                    if (document.querySelector('#divTitulo').innerHTML=='<h2>Alterar Fornecedor</h2>'){
                        inserirContato(document.querySelector('#inpCId').value, colabSelected.USO_ID)
                    }
                }
                inpContatos.value = ''
                colabSelected=undefined                
            }
        })
////////////        
     })

    const divRodape = document.createElement('div');
    const styRodape =  'display: flex;'
    +'justify-content: center;'
    +'align-items: flex-start;'
    +'flex-direction: row;'
    +'background-color: #248;'
    +'color:white;'
    +'border-radius: 0 0 10px 10px;'
    +'width : 100%;'
    +'gap: 10px;'
    +'padding:  5px 3px 5px 3px;'
    divRodape.setAttribute('id','divRodape');
    divRodape.setAttribute('class','styLRodape');
    divRodape.setAttribute('style',styRodape)
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

const converteImagemBase64 =  (localDestino,arquivoImagem)=>{
    const obj = arquivoImagem;
    const reader = new FileReader()
    reader.addEventListener('load',async (evt)=>{
        const res =  reader.result
        localDestino.src = res
        fotoLogo = await res
    });
    if(obj){
        reader.readAsDataURL(obj);
    }
}

btnCadastrar.addEventListener('click',()=>{
    janelaFornec()

    document.querySelector('#divTitulo').innerHTML='<h2>Cadastrar Fornecedor<h2>'
    const styBtnx = document.querySelector('#btncancela').style.cssText

    const btnAlterar = document.createElement('input');
    btnAlterar.setAttribute('id', 'btnAlterar');
    btnAlterar.setAttribute('type', 'Button');
    btnAlterar.setAttribute('value', 'Cadastrar');
    btnAlterar.setAttribute('style', styBtnx);
    
    btnAlterar.addEventListener('click', () => {
        const campoID =  document.querySelector('#inpCId').value
        const campoNome = document.querySelector('#inpCNome').value
        const campoRazao = document.querySelector('#inpCRazao').value
        const campoCnpj = document.querySelector('#inpCCnpj').value
        const campoStatus = document.querySelector('#inpCStatus').selectedIndex        
        const campoFoto = document.querySelector('#inpCFoto')
        fotoLogo = fotoLogo ? fotoLogo : null
        var idFornecedor = undefined

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "FOR_NOME": campoNome, "FOR_RAZAO" : campoRazao,"FOR_CNPJ" : campoCnpj ,"FOR_STATUS": campoStatus,  "FOR_FOTO": fotoLogo });
        var requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(apiServer+"fornecedor", requestOptions)
            .then(response => response.json())
            .then(result => { 
                idFornecedor = result;
                const contatInseridos = [].slice.call(document.querySelector('#divCPessoas').children)
                contatInseridos.map((ite,id)=>{
                    
                    inserirContato(idFornecedor[0].FOR_ID,parseInt(ite.firstChild.nextElementSibling.innerHTML))
                })
                refreshLista()
            })
            .catch(error => console.log('error', error));
        fotoLogo = undefined
    })
     divRodape.prepend(btnAlterar);
})

const alterar = () => {
    janelaFornec()
    const divJanTelefones = document.querySelector('#divCTelefones')

    document.querySelector('#divTitulo').innerHTML = '<h2>Alterar Fornecedor</h2>'
    document.querySelector('#inpCId').value = DataGrid.campoRetorno.FOR_ID
    document.querySelector('#inpCNome').value = DataGrid.campoRetorno.FOR_NOME
    document.querySelector('#inpCRazao').value = DataGrid.campoRetorno.FOR_RAZAO
    document.querySelector('#inpCCnpj').value = DataGrid.campoRetorno.FOR_CNPJ
    document.querySelector('#inpCStatus').selectedIndex = DataGrid.campoRetorno.USO_STATUS

    const ctu = async () => {
        await carregaContatos(DataGrid.campoRetorno.FOR_ID)   
        const ctatos = await [].slice.call(contatosDoFornecedor)
        await ctatos.map((ite,id)=>{

            addContato(ite.FCO_ID,ite.USO_ID,ite.USO_NOME,document.querySelector('#divCPessoas'),1)
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
        const campoID = document.querySelector('#inpCId').value
        const campoNome = document.querySelector('#inpCNome').value
        const campoRazao = document.querySelector('#inpCRazao').value
        const campoCnpj = document.querySelector('#inpCCnpj').value
        const campoStatus = document.querySelector('#inpCStatus').selectedIndex
        const campoFoto = document.querySelector('#inpCFoto')
        if (campoFoto.files.length==0) fotoLogo = DataGrid.campoRetorno.FOR_FOTO
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "FOR_NOME": campoNome, "FOR_RAZAO" : campoRazao,"FOR_CNPJ" : campoCnpj ,"FOR_STATUS": campoStatus,  "FOR_FOTO": fotoLogo,"FOR_ID":campoID});
        var requestOptions = {
            method: 'PUT',
            mode: 'cors',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(apiServer+"fornecedor", requestOptions)
            .then(response => response.text())
            .then(result => {
                refreshLista()
            })
            .catch(error => console.log('error', error));
    })

    divRodape.prepend(btnAlterar);
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

const listaContatos = async ()=>{
    const destino=document.querySelector('#dgBase')
    janelaPopup(destino)
    const titulo= destino.querySelector('#janTitulo')
    const janDados = destino.querySelector('#JanDivDados')
    const janRodape = destino.querySelector('#janDivRodape')
    titulo.innerHTML='<h2> Listagem dos Contatos</h2>'
    janDados.style.flexDirection='row'
    janDados.style.gap='10px'
    janDados.style.flexWrap='wrap'
    janRodape.style.height='30px'
    
    await carregaContatos(DataGrid.campoRetorno.FOR_ID)   
    const ctatos = await [].slice.call(contatosDoFornecedor)
    await ctatos.map((ite,id)=>{
        addContato(ite.FCO_ID,ite.USO_ID,ite.USO_NOME,janDados,0)
    })
}

const carregaTelefones = async (usuID) => {
    const apiColab = apiServer+`telefone/?TEL_USUARI=${usuID}`
    await fetch(apiColab)
        .then(res => res.json())
        .then(retorno => {
                telefonesDoUsuario = retorno
                console.log(telefonesDoUsuario)
                console.log(retorno)
                return retorno
            })
}

const listaTelefones = async(contid)=>{
    const destino = document.querySelector('#dgBase')
    const jfonte = janelaPopup(destino)
    const titulo= jfonte.querySelector('#janTitulo')
    const janDados = jfonte.querySelector('#JanDivDados')
    const janRodape = jfonte.querySelector('#janDivRodape')
    titulo.innerHTML='<h2> Listagem dos Telefones</h2>'
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
    console.log(telefonesDoUsuario)
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
        
        var divCampos  = document.createElement('div');
        divCampos.setAttribute('id','divTelefoneAdd');
        divCampos.setAttribute('class','styDivTelefones');
        divCampos.setAttribute('style','');
        divCampos.innerHTML = ite.TEL_TELEFO
        divCampoTelefone.appendChild(divCampos);
    })
}

const mostraFoto = ()=>{
    const destino=document.querySelector('#dgBase')
    janelaPopup(destino)
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
    imgCampos.setAttribute('src',DataGrid.campoRetorno.FOR_FOTO)
    divCampos.appendChild(imgCampos);    
}

const janelaPopup = (destino) => {
    const divBaseJanela = document.createElement('div');
    const styBaseJanela =
    'display : flex;' 
    +'justify-content :center;' 
    +'align-items : center;' 
    +'position : absolute;' 
    +'top : 0px;' 
    +'left : 0px;' 
    +'width : 100%;' 
    +'height : 100vh;' 
    +'background-color : rgba(0,0,0,0.7);' 
    //+'z-index : 3;'
    ;
    divBaseJanela.setAttribute('id', 'divBaseJPopup');
    divBaseJanela.setAttribute('style', styBaseJanela);
    divBaseJanela.setAttribute('class', 'styLJanela');
    destino.appendChild(divBaseJanela);

    const divJanela = document.createElement('div');
    divJanela.setAttribute('id', 'divJanela');
    const styJanela = 'display : flex;'
        + 'justify-content : felex-start;'
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
   return divBaseJanela
}

const toggleAtivar = ()=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ "FOR_STATUS": DataGrid.campoRetorno.FOR_STATUS, "FOR_ID" : DataGrid.campoRetorno.FOR_ID});
    var requestOptions = {
        method: 'PUT',
        mode: 'cors',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiServer+"fornecedor/status", requestOptions)
        .then(response => response.json())
        .then(result => { 
            refreshLista()
        })
        .catch(error => console.log('error', error)); 
}

btnPesquisar.addEventListener('click', (evt) => {
    janelaFornec()
    document.querySelector('#divCContatos').remove()
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
    inpCampos.innerHTML='Razão'
    pesSelect.appendChild(inpCampos); 
    var inpCampos = document.createElement('option');    
    inpCampos.innerHTML='Cnpj'
    pesSelect.appendChild(inpCampos); 
    var inpCampos = document.createElement('option');    
    inpCampos.innerHTML='Status'
    pesSelect.appendChild(inpCampos);     

    divCampos.appendChild(pesSelect);
    pesSelect.selectedIndex = 1
    const nomeCampos=["FOR_ID","FOR_NOME","FOR_RAZAO","FOR_CNPJ","USO_STATUS"]

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
        const api = apiServer+`fornecedor/pesquisa/?FOR_DADOS=${campoPesquiss.value.toUpperCase()}&FOR_CAMPO=${nomeCampos[pesSelect.selectedIndex]}`
        fetch(api, requestOptions)
            .then(response => response.json())
            .then(retorno => {
                if (retorno.length > 0) {
                    document.querySelector('#inpCId').value = retorno[0].FOR_ID
                    document.querySelector('#inpCNome').value = retorno[0].FOR_NOME
                    document.querySelector('#inpCRazao').value = retorno[0].FOR_RAZAO
                    document.querySelector('#inpCCnpj').value = retorno[0].FOR_CNPJ
                    document.querySelector('#inpCStatus').selectedIndex = retorno[0].FOR_STATUS
                    const ctu = async () => {
                        if(retorno[0].FOR_ID){
                            await carregaContatos(retorno[0].FOR_ID)
                            const ctatos = await [].slice.call(contatosDoFornecedor)
                            await ctatos.map((ite, id) => {
                                addContato(ite.FCO_ID, ite.USO_ID, ite.USO_NOME, document.querySelector('#divCPessoas'), 0)
                            })
                        }
                    }
                    ctu()                                   
                }
            })
            .catch(error => console.log('error', error));
    })
    
})