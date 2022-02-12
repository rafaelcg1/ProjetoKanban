var botaoAdicionarCartao = document.querySelector("#adicionar-cartao");
var botaoAdicionarColaborador = document.querySelector("#botao-add-colaborador");

let usuarioResponsavel = new Array();
let index = 0;
let indexCard = 0;

let usuarioSelect = document.getElementById("usuarioCartao").options;

botaoAdicionarCartao.addEventListener("click", function (event) {
  event.preventDefault();

  var form = document.querySelector("#form-adiciona");

  var titulo = form.tituloCartao.value;
  var descricao = form.descricaoCartao.value;
  var usuario = form.usuarioCartao.value;
  var estimativa = form.estimativaCartao.value;

  if(form.tituloCartao.value != "" && form.descricaoCartao.value != "" && form.usuarioCartao.value != "Selecione um colaborador" && form.estimativaCartao.value != ""){
    var cartaoTr = document.createElement("tr");

    var capsulaCartao = document.createElement("td");

    var corpoCartao = document.createElement("table");

    var tituloCorpoCartao = document.createElement("tr");

    var descricaoCorpoCartao = document.createElement("tr");

    var usuarioCorpoCartao = document.createElement("tr");

    var estimativaCorpoCartao = document.createElement("tr");

    var tituloTd = document.createElement("td");
    tituloTd.setAttribute("class", "cartao");

    var descricaoTd = document.createElement("td");
    descricaoTd.setAttribute("class", "cartao");

    var usuarioTd = document.createElement("td");
    usuarioTd.setAttribute("class", "cartao");

    var estimativaTd = document.createElement("td");
    estimativaTd.setAttribute("class", "cartao");

    tituloTd.textContent = ("Título: " +titulo);
    descricaoTd.textContent = ("Descrição: "+descricao);
    usuarioTd.textContent = ("Responsável: "+usuario);
    estimativaTd.textContent = ("Estimativa: "+estimativa);

    tituloCorpoCartao.appendChild(tituloTd);
    descricaoCorpoCartao.appendChild(descricaoTd);
    usuarioCorpoCartao.appendChild(usuarioTd);
    estimativaCorpoCartao.appendChild(estimativaTd);

    corpoCartao.appendChild(tituloCorpoCartao);
    corpoCartao.appendChild(descricaoCorpoCartao);
    corpoCartao.appendChild(usuarioCorpoCartao);
    corpoCartao.appendChild(estimativaCorpoCartao);

    capsulaCartao.appendChild(corpoCartao);

    cartaoTr.appendChild(capsulaCartao);

    var tabela = document.querySelector("#tabela-cartoes");

    tabela.appendChild(cartaoTr);
    form.tituloCartao.value = "";
    form.descricaoCartao.value = "";
    form.estimativaCartao.value = "";
    form.usuarioCartao.value = "Selecione um colaborador";
  }else {
    alert("Favor preencher todos os campos");
  }
});

botaoAdicionarColaborador.addEventListener("click", function (event) {
  event.preventDefault();

  var form = document.querySelector("#form-adiciona-colaborador");

  var usuario = form.adicionaColaborador.value;

  usuarioResponsavel.forEach((user) => {
    if (usuario == user) {
      usuario = "";
    }
  });

  if (usuario != "") {
    usuarioResponsavel[index] = usuario;
    index++;
    form.adicionaColaborador.value = "";

    usuarioSelect.add(new Option(usuario, usuario, false, false));
  } else {
    form.adicionaColaborador.value = "Usuário já cadastrado";
    setTimeout(() => {
      form.adicionaColaborador.value = "";
    }, 1000);
  }
});
