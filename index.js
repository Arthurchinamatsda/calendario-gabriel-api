const express = require('express');
const fs = require('fs');
const app = express();

const feriados = JSON.parse(fs.readFileSync('./feriados.json', 'utf-8'));

app.use(express.json()); // permite ler JSON no body (POST/PUT)

const DATA_FILE = './feriados.json';

function toISO(d) {
  return new Date(d).toISOString().slice(0, 10); // garante YYYY-MM-DD
}

function persistir() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(feriados, null, 2), 'utf-8');
}

function validarDataISO(data) {
  // aceita apenas YYYY-MM-DD e checa se a data é válida no calendário
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const dt = new Date(data);
  return toISO(dt) === data; // normalização idêntica => data válida
}


app.post('/cadastroFeriado', (req, res)=>{
    const {data, nome} = req.body || {}

    if(!data || !nome){
        return res.status(400).json({erro: "Data invalida. use o formato YYYY-MM-DD e Nome."})
    }
    const iso = toISO(data);
    if(!validarDataISO(iso)){
        return res.status(400).json({erro: "Data invalida. use o formato YYYY-MM-DD e o nome."})
    }

    const JaExiste = feriados.some(f => f.data === iso);
    if(JaExiste){
        return res.status(409),json({erro: "Ja existe esse feriado nessa data"})
    }

    const novo = {data:iso, nome:String(nome).trim()};
    feriados.push(novo);
    feriados.sort((a,b) => new Date(a.data)- new Date(b.data))

    persistir();
    return res.status(201).json(novo)

})

app.post('/cadastroDiaComum', (req, res) => {
    const data = {data,nome};

    if(!data || !nome){
        return res.status(400).json({erro: "Data invalida. use o formato YYYY-MM-DD e Nome."})
    }
    const iso = toISO(data);
    if(!validarDataISO(iso)){
        return res.status(400).json({erro: "Data invalida. use o formato YYYY-MM-DD e o nome."})
    }

    const JaExiste = feriados.some(f => f.data === iso);
    if(JaExiste){
        return res.status(409),json({erro: "Ja existe esse feriado nessa data"})
    }

    const novo = {data:iso, nome:String(nome).trim()};
    feriados.push(novo);
    feriados.sort((a,b) => new Date(a.data)- new Date(b.data))

    persistir();
    return res.status(201).json(novo)
})







app.get('/feriados', (req, res)=>{
    res.json(feriados);
})

app.get('/feriados/nome/:nome', (req, res)=>{
    const nome = (req.params.nome||'').toLowerCase();
    const resultado = feriados.find(f=> f.nome.toLowerCase().includes(nome));

    resultado ? res.json(resultado) : res.status(404).json({erro:"feriado nao encontrado"});
})

app.get('/feriados', (req, res)=>{
    const hoje = new Date();
    const proximoFeriado = feriados
        .map(f=>({... f, dias: Math.ceil((new Date(f.data)-hoje)/ (1000 * 60 * 60 * 24))}))
        .filter(f=>f.dias >= 0)
        .sort((a, b) => a.dias - b-dias);
    proximos.length > 0 ? res.json(proximoFeriado[0]) : res.json({mensagem:"nenhum feriado"});
})


app.listen(3000, ()=> console.log('rodando...'));

