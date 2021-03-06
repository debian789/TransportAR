// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Empresa = mongoose.model('Empresa');

// Crear un nuevo método controller para el manejo de errores
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Error de servidor desconocido';
	}
};

// Crear un nuevo método controller para crear nuevos artículos
exports.create = function(req, res) {
	// Crear un nuevo objeto artículo
	var empresa = new Empresa(req.body);

	// Configurar la propiedad 'creador' del artículo
	empresa.creador = req.user;


	// Intentar salvar el artículo
	empresa.save(function(err) {
		if (err) {
			// Si ocurre algún error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo
			res.json(empresa);
		}
	});
};

// Crear un nuevo método controller que recupera una lista de artículos
exports.list = function(req, res) {
	//obtener el parametro de busqueda de empresas
	var search = req.param('search');
	var parametroBusqueda = {};

	if ( search !== undefined ){
		parametroBusqueda = {"nombre":{'$regex':search}}
	}

	// Usar el método model 'find' para obtener una lista de artículos
	Empresa.find(parametroBusqueda).sort('-creado').populate('creador', 'firstName lastName fullName').exec(function(err, empresas) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo
			res.json(empresas);
		}
	});



};

// Crear un nuevo método controller que devuelve un artículo existente
exports.read = function(req, res) {
	res.json(req.empresa);
};

// Crear un nuevo método controller que actualiza un artículo existente
exports.update = function(req, res) {
	// Obtener el artículo usando el objeto 'request'
	var empresa = req.empresa;

	// Actualizar los campos artículo
	empresa.nombre = req.body.nombre;
	empresa.provincia = req.body.provincia;
	empresa.localidad = req.body.localidad;


	// Intentar salvar el artículo actualizado
	empresa.save(function(err) {
		if (err) {
			// si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo
			res.json(empresa);
		}
	});
};

// Crear un nuevo método controller que borre un artículo existente
exports.delete = function(req, res) {
	// Obtener el artículo usando el objeto 'request'
	var empresa = req.empresa;

	// Usar el método model 'remove' para borrar el artículo
	empresa.remove(function(err) {
		if (err) {
			// Si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo
			res.json(empresa);
		}
	});
};

// Crear un nuevo controller middleware que recupera un único artículo existente
exports.empresaByID = function(req, res, next, id) {
	// Usar el método model 'findById' para encontrar un único artículo
	Empresa.findById(id).populate('creador', 'firstName lastName fullName').exec(function(err, empresa) {
		if (err) return next(err);
		if (!empresa) return next(new Error('Fallo al cargar la empresa ' + id));

		// Si un artículo es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.empresa = empresa;

		// Llamar al siguiente middleware
		next();
	});
};

// Crear un nuevo controller middleware que es usado para autorizar una operación article
exports.hasAuthorization = function(req, res, next) {
	// si el usuario actual no es el creador del artículo, enviar el mensaje de error apropiado
	if (req.empresa.creador.id !== req.user.id) {
		return res.status(403).send({
			message: 'Usuario no está autorizado'
		});
	}

	// Llamar al siguiente middleware
	next();
};
