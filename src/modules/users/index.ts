import { Router } from "express"
import UserController from "./user.controller"
import * as vA from "./validators/auth.validator";
import { jwtGuard } from "../../middlewares/auth-guard";

const controller = new UserController()
const router = Router()
const jwt = jwtGuard({ credentialsRequired: true });

router.post('/users/signup', vA.signUp, controller.signUp)
router.post('/users/signin',  controller.signIn)
router.post('/users/invite', jwt, controller.inviteUser)
router.get('/users/delete', jwt, controller.deleteUser)

export default router;