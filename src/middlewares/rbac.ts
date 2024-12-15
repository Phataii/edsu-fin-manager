import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import {Privilege, User} from "../entities/user.entity";
import Logger from "../utils/logger";
import { ForbiddenRequestException, UnauthorizedException } from "../utils/service-exceptions";

const logger = new Logger('rbac');

export default function rbac(privileges: Privilege[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = await User.createQueryBuilder('user')
        .select('user.id')
        .where({ id: req.auth.userId })
        .getOne()
      
      if (!user) {
        throw new UnauthorizedException('You are not authorized to perform this action');
      }
      
      // const permission = user.teamMemberships.find(t =>
      //   privileges.includes(t.privilege) &&
      //   t.companyId === req.auth.companyId
      // );
      
      // if (!permission) {
      //   throw new ForbiddenRequestException();
      // }

      next();
    } catch (error) {
      next(error);
    }
  };
}
