import utkit from  './utkit/utkit.js'
const btnCfgMenu = document.querySelector('#btnCfgMenu')
const divMenu = document.querySelector('#divMenu')
const opMenu = document.querySelector('#opMenu')
const opMenuLinha = document.querySelector('#divLinMenuA')
const menuop1 = document.querySelector('#menuop1')
const menuop2 = document.querySelector('#menuop2')
const menuop3 = document.querySelector('#menuop3')
const menuop4 = document.querySelector('#menuop4')
const menuop5 = document.querySelector('#menuop5')
const menuop6 = document.querySelector('#menuop6')
const divFrame = document.querySelector('#divShow')
const janelaFrame = document.querySelector('#ifShow')
const btnMenu = document.querySelector('#btnMenu')

const menuTodos = document.querySelectorAll('.divLinMenuA')
const menuIdUser = document.querySelector('#menuIdUser')
const menuNomeUser = document.querySelector('#menuNomeUser')
const arqConfig = './config.cfg'
fetch(arqConfig)
.then(res=>res.json())
.then(res=>{
    sessionStorage.setItem('servidor',res.servidor);
     sessionStorage.setItem('versao',res.versao)
})

const apiServer = sessionStorage.getItem('servidor')

menuTodos.forEach((ele,id)=>{
    ele.addEventListener('click',()=>{
        divMenu.classList.toggle('ocultar')    
    })
})
btnMenu.addEventListener('click',(evt)=>{
   divMenu.classList.toggle('ocultar')
})
menuop1.addEventListener('click',(evt)=>{
    janelaFrame.setAttribute('src','./colaboradores/colab.html')
})
menuop2.addEventListener('click',(evt)=>{
    janelaFrame.setAttribute('src','./fornecedores/fornec.html')
})
menuop3.addEventListener('click',(evt)=>{
    janelaFrame.setAttribute('src','./produtos/produt.html')
})
menuop4.addEventListener('click',(evt)=>{
    janelaFrame.setAttribute('src','./estoque/estoqu.html')
    janelaFrame.setAttribute('date-userName',menuNomeUser.innerHTML)
    janelaFrame.setAttribute('date-userId',menuIdUser.innerHTML)
})
menuop5.addEventListener('click',(evt)=>{
    janelaFrame.setAttribute('src','./venda/venda.html')
    janelaFrame.setAttribute('date-userName',menuNomeUser.innerHTML)
    janelaFrame.setAttribute('date-userId',menuIdUser.innerHTML)
})
menuop6.addEventListener('click',(evt)=>{
    //janelaFrame.setAttribute('src','../lab.html')
    //const base = document.querySelector('#base')
    sessionStorage.clear()
    localStorage.clear()
    window.open("_blank","_self")
    window.close()

})
const objeto =()=>{
    alert('houve um Click')
}

btnCfgMenu.addEventListener("click",(evt)=>{
    const dbMenu = {
        destino : document.querySelector('#menuUser'),
        top : '15px',
        left : '00px',
        width : '180px',
        opcoes : [
             { nome : 'Cadastrar Senha', src : './img/newuser.svg', acao : ()=>{}},
             { nome : 'Alterar', src : './img/colab.svg', acao : ()=>{}},
             { nome : 'Login', src : './img/login.svg', acao : ()=>{loginUser()}},
             { nome : 'Logoff', src : './img/logout.svg', acao : ()=>{logOffUser()}},
             { nome : 'Limpa Token', src : './img/trash.svg', acao : ()=>{limpaToken()}}, 
             { nome : 'Fechar', src : './img/close.svg', acao : ()=>{utkit.MenuFlutuante.hide() }},
        ]
    
    }  
    utkit.MenuFlutuante.show(dbMenu)

})

const loginUser = async ()=>{
    utkit.LoginUser.imgLocal='./img/eia_cl.png'
    await  utkit.LoginUser.callLogin()
    
}

const limpaToken =()=>{
    utkit.LoginUser.limpaTokenVencido()
}

if (document['URL'].indexOf('index.html')>0){
if ((menuIdUser.innerHTML.trim() =='ID' && sessionStorage.getItem('logId') != null) ){
   menuIdUser.innerHTML = sessionStorage.getItem('logId')
   menuNomeUser.innerHTML = sessionStorage.getItem('logUser')
}
}
const logOffUser =()=>{
    utkit.Login.loginImage='./img/eia_cl.png'
    utkit.Login.logoffUser()
    menuIdUser.innerHTML=':.Id'
    menuNomeUser.innerHTML=':.User'
    janelaFrame.innerHTML='';


}

