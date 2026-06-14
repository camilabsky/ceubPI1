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

app.get('/minhas_tarefas', 
   (req, res) => res.send('minhas tarefas')
)
app.post('/concluir_tarefa', 
   (req, res) => res.send('tarefa concluida')
)

function get_tarefas(req, res){
    connection.query('SELECT * FROM Tarefas WHERE id_perfil IS NULL', 
    (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
}
app.get('/tarefas_disponiveis', get_tarefas)

app.post('/aceitar_tarefa', 
   (req, res) => res.send('tarefa aceita')
)

function get_recompensas_disponiveis(req, res){
    connection.query('SELECT * FROM RecompensasDisponiveis', 
    (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
}
app.get('/recompensas_disponiveis', get_recompensas_disponiveis)

app.post('/resgatar_recompensa', 
   (req, res) => res.send('recompensa resgatada')
)

const port = 8080;
app.listen(port, 
   () => console.log(`⚡️[bootup]: Server is running at port: ${port}`)
);
