var mysql      = require('mysql2');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'password',
  database : 'horta',
  port     : 3307
});

connection.connect();

connection.query('SELECT * FROM Tarefas WHERE id_perfil IS NULL', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});

connection.end();


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

app.get('/tarefas_disponiveis', 
   (req, res) => res.send('tarefas disponiveis')
)
app.post('/aceitar_tarefa', 
   (req, res) => res.send('tarefa aceita')
)

app.get('/recompensas_disponiveis', 
   (req, res) => res.send('recompensas disponiveis')
)
app.post('/resgatar_recompensa', 
   (req, res) => res.send('recompensa resgatada')
)

const port = 8080;
app.listen(port, 
   () => console.log(`⚡️[bootup]: Server is running at port: ${port}`)
);

