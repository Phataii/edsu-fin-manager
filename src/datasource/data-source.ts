import path from "path";
import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import Account from "../entities/account.entity";
import Log from "../entities/log.entity";
import { OTP } from "../entities/login-access.entity";
import EmailTemplate from "../entities/email-template";
import { Transaction } from "../entities/transactions.entity";
import DVEA from "../entities/dvea.entity";
import VultAccount from "../entities/vult-account.entity";
import Revenue from "../entities/revenue.entity";
import Expenditure from "../entities/expenditure.entity";

export default new DataSource({
    type: "mysql",
    host: process.env.SQL_HOST,
    port: Number(process.env.SQL_PORT || "3306"),
    username: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
    synchronize: process.env.NODE_ENV === "development",
    logging: true,
    entities: [
        Account,
        EmailTemplate,
        Log,
        OTP,
        User,
        Transaction,
        DVEA,
        Revenue,
        VultAccount,
        Expenditure
    ],
    subscribers: [],
    migrations: [path.resolve(__dirname, "../migrations/**/*.ts")],
    migrationsTableName: "bas_migrations",
})