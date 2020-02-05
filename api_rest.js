/*Initialisation des variables */

/* Les requires */
var express = require('express');
var bodyParser = require('body-parser');
var bdd = require('mysql');

/* Affectation des variables */
var hostname = 'localhost'
var port = 3000
var app = express();
var router = express.Router()

/* Using */
app.use(bodyParser.urlencoded({extends : false}))
app.use(bodyParser.json())

/* Connection à la base de donnée */
app.use(function(req, res, next){
	res.locals.connection = bdd.createConnection({
		host : 'localhost',
		user : 'root',
		password : '',
		database : 'test',
	});

	res.locals.connection.connect();
	next();
})


/*Creation des différentes routes pour l'API*/
router.route('/')
	.all(function(req, res){
		res.json({message : "Bienvenue sur l'API", methode : req.method})
	})

router.route('/articles')
	.get(function(req, res, next){
		res.locals.connection.query('SELECT * FROM article', function(error, results, fields){
			if(error)
			{
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}))
			}
			else
			{
				res.send(JSON.stringify(results))
			}
		})
	})
	.post(function(req, res){
		res.locals.connection.query('INSERT INTO article SET titre = ?, contenu = ?',[req.body.titre, req.body.contenu], function(error, results, fields){
			if(error)
			{
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}))
			}
			else
			{
				res.send(JSON.stringify({"status": 200, "error": null, "message": "L'article a été ajouté avec succès"}))
			}
		})
	})

router.route("/article/:article_id")
	.get(function(req, res){
		res.locals.connection.query('SELECT * FROM article WHERE id_article = ?',[req.params.article_id], function(error, results, fields){
			if(error)
			{
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}))
			}
			else if(results.length == 0)
			{
				res.json({message: "Aucun article ne correspond à cette recherche"})
			}
			else
			{
				res.send(JSON.stringify(results))
			}
		})
	})
	.put(function(req, res){
		res.locals.connection.query('UPDATE article SET titre = ?, contenu = ? WHERE id_article = ?',[req.body.titre, req.body.contenu,req.params.article_id], function(error, results, fields){
			if(error)
			{
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}))
			}
			else if(isNaN(req.params.article_id))
			{
				res.json({message: "Aucun article ne correspond à cette recherche"})
			}
			else
			{
				res.send(JSON.stringify({"status": 200, "error": null, "message": "L'article a été modifié avec succès"}))
			}
		})
	})
	.delete(function(req, res){
		res.locals.connection.query('DELETE FROM article WHERE id_article = ?',[req.params.article_id], function(error, results, fields){
			if(error)
			{
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}))
			}
			else if(isNaN(req.params.article_id))
			{
				res.json({message: "Aucun article ne correspond à cette recherche"})
			}
			else
			{
				res.send(JSON.stringify({"status": 200, "error": null, "message": "L'article a été supprimé avec succès"}))
			}
		})
	})


/* On utilise les routes qu'on a crée précédemment */
app.use(router);

/* Affichage dans la console les informations sur le serveur */
app.listen(port, hostname, function(){
	console.log("Serveur ok")
})