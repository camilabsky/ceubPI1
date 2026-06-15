var mysql      = require('mysql2');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'password',
  database : 'horta',
  port     : 3307
});

connection.connect();

const express = require('express'),
app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

function get_minhas_tarefas(req, res){
    const {id_perfil} = req.body
    connection.query(`SELECT * FROM Tarefas WHERE id_perfil=${id_perfil} AND NOT concluido`,
    (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
}
app.get('/minhas_tarefas',  get_minhas_tarefas)

function concluir_tarefas(req, res){
    const {id_tarefa} = req.body
    connection.query(`UPDATE Tarefas SET concluido=true WHERE id=${id_tarefa}`,
    (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
}
app.post('/concluir_tarefa', concluir_tarefas)

function get_tarefas(req, res){
    connection.query('SELECT * FROM Tarefas WHERE id_perfil IS NULL', 
    (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
}
app.get('/tarefas_disponiveis', get_tarefas)

function aceitar_tarefa(req, res){
    const {id_tarefa, id_perfil} = req.body
    connection.query(`UPDATE Tarefas SET id_perfil=${id_perfil} WHERE id=${id_tarefa}`,
    (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
}
app.post('/aceitar_tarefa', aceitar_tarefa)

function get_recompensas_disponiveis(req, res){
    connection.query('SELECT * FROM RecompensasDisponiveis', 
    (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
}
app.get('/recompensas_disponiveis', get_recompensas_disponiveis)

function resgatar_recompensa(req, res){
    const {id_recompensa, id_perfil} = req.body
    connection.query(
        `UPDATE PerfilRecompensas SET id_perfil=${id_perfil} WHERE id_perfil is null AND id_recompensa=${id_recompensa} LIMIT 1`,
        (error, results, fields) => {
            if (error) throw error;
            res.send(results);
        }
    );
}
app.post('/resgatar_recompensa', resgatar_recompensa)

const port = 8080;
app.listen(port, 
   () => console.log(`⚡️[bootup]: Server is running at port: ${port}`)
);
