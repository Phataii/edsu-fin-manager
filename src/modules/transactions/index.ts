import { Router } from "express"
import TransactionsController from "./transactions.controller"
import { jwtGuard } from "../../middlewares/auth-guard";


const controller = new TransactionsController()
const router = Router()
const jwt = jwtGuard({ credentialsRequired: true });

router.post('/vult/create', controller.createVult)
router.post('/vult/account', controller.createAcc)
router.post('/revenue', controller.addRevenue)
router.post('/expenditure', controller.addExpenditure)
router.post('/settle-revenue', controller.settleRevenue)
router.post('/revenue/delete', jwt, controller.deleteRevenue)
export default router;