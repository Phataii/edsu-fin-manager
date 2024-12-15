import { Router } from "express"
import TransactionsController from "./transactions.controller"


const controller = new TransactionsController()
const router = Router()

router.post('/vult/create', controller.createVult)
router.post('/vult/account', controller.createAcc)
router.post('/revenue/rt', controller.createRT)
router.post('/revenue', controller.addRevenue)
export default router;