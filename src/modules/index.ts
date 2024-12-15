import { Router } from "express";
import { jwtGuard } from "../middlewares/auth-guard";
import userRoutes from './users';
import transactionRoutes from './transactions';
const router = Router();

const jwt = jwtGuard({ credentialsRequired: true }).unless({
    path: [
        '/',
        '/api/v1/users/signin',
        '/api/v1/users/signup',
        '/api/v1/revenue/rt',
        
    ]})
    router.use(userRoutes);
    router.use(transactionRoutes);
    router.use('/api/v1', jwt, router);
export default router;

