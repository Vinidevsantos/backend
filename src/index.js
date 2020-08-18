const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

//  Metodos Http: 
// 
// GET: Buscar informacoes ou uma unica informacao do back-end
// POST: Criar uma informacao no back-end
// PUT/PATCH: Alterar uma informacao no back-end
// DELETE: Deletar uma informacao no back-end
 
// Tipos de parametros: 
// 
// Query Params: Filtros e paginacao
// Route Params: Identificar recursos (Atualizar/Deletar)
// Request Body: Conteudo na hora de criar ou editar um recurso (JSON)

//
// Middleware:
//
// Interceptador de requisicoes
// Interromper totalmente a requisicao ou alterar dados da requisicao
//

const projects = [];

function logRequests(request, response, next) {
 const { method, url} = request;

 const logLabel = `[${method.toUpperCase()}] ${url}`;

console.time(logLabel);

next(); //Proximo middleware

console.timeEnd(logLabel);

}

function validateProjectId(request, response, next){
 const { id } = request.params;

 if (!isUuid(id)) {
  return response.status(400).json({ error: 'Invalid Project ID.'});
 }

 return next();
}

app.use(logRequests);
app.use('/repositories/:id', validateProjectId);

app.get('/repositories', (request, response) => {
 const { title } = request.query;

 const results = title
  ? projects.filter(project => project.title.includes(title))
  : projects;

 return response.json(results);
});

app.post('/repositories', (request, response) => {
 const {title, owner} = request.body;

 const project = { id: uuid(), title, owner };

 projects.push(project); 

 return response.json(project);
});

app.put('/repositories/:id', (request, response) => {
 const { id } = request.params;
 const { title, owner } = request.body;

 const projectIndex = projects.findIndex(project => project.id === id);

 if (projectIndex < 0) {
  return response.status(400).json({ error: "Project not found." })
 } 

 const project = {
  id,
  title,
  owner,
 };
 
 projects[projectIndex] = project;

 return response.json(project);
});

app.delete('/repositories/:id', (request, response) => {

 const { id } = request.params;

 const projectIndex = projects.findIndex(project => project.id === id );

 if (projectIndex < 0) {
  return response.status(400).json({ error: "Project not found"});
 }

 projects.splice(projectIndex, 1);

 return response.status(204).send();
});

app.listen(3333, () => {
 console.log('🚀🚀🚀 Back-end Started!');
});