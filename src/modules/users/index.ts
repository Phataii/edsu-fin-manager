import { Router } from "express"
import UserController from "./user.controller"
import * as vA from "./validators/auth.validator";

const controller = new UserController()
const router = Router()

router.post('/users/signup', vA.signUp, controller.signUp)
router.post('/users/signin',  controller.signIn)
router.post('/users/invite',  controller.inviteUser)


export default router;