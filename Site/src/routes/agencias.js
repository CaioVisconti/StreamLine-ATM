const { Router } = require("express");
const agenciaController = require("../controllers/agenciaController");
const atmsController = require("../controllers/atmsController");
const componenteController = require("../controllers/componenteController");

const router = Router();

router.get('/mostrarAgencias', (req, res) => {
    agenciaController.mostrarCards(req, res);
})
router.get('/pesquisarAgencias/:nome', (req, res) => {
    agenciaController.pesquisarAgencias(req, res);
})
router.post('/cadastrarAgencia', (req, res) => {
    agenciaController.cadastrarAgencia(req, res);
})  
router.delete('/deletarAgencia/:idAgencia', async (req, res) => {
    try{
        await componenteController.deletarComponentes(req, res).then()    
        await atmsController.deletarAtms(req, res);
        await agenciaController.deletarAgencia(req, res);
    } catch (error){
        console.log(error)
    }
})  


module.exports = router;