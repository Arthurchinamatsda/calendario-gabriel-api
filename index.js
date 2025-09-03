const express = require('express');
const fs = require('fs');
const app = express();

const feriados = JSON.parse(fs.readFileSync('./feriados.json', 'utf-8'));

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

