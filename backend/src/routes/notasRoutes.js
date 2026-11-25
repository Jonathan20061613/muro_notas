const { Router } = require('express');
const {
    obtenerNotas,
    crearNota,
    actualizarNota,
    eliminarNota,
} = require('../controllers/notasController');

const router = Router();

router.get('/', obtenerNotas);
router.post('/', crearNota);
router.put('/:id', actualizarNota);
router.delete('/:id', eliminarNota);

module.exports = router;