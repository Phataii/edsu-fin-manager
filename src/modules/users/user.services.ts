import dataSource from "../../datasource/data-source";
import { Privilege, User } from "../../entities/user.entity";
import EmailService from "../../types/email.service";
import Logger from "../../utils/logger";
import { loginResponse } from "../../utils/login-response";
import { BadRequestException, NotFoundException } from "../../utils/service-exceptions";
import { InviteUser, SignInBody, SignUpBody } from "./interfaces/auth.types";
import bcrypt from "bcryptjs";
export default class UserServices{
    private logger = new Logger('users-service');
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
        this.logger = new Logger("user-services");
      }
      signUp = async (payload: SignUpBody) => {
        try {
          // 1. Validate email domain
          if (!payload.email.toLowerCase().endsWith('@edouniversity.edu.ng')) {
            console.log("Invalid email domain");
            throw new BadRequestException('Email must be from the domain "@edouniversity.edu.ng"');
          }
    
          // 2. Validate admin code
          if (payload.code !== process.env.ADMIN_CODE) {
            console.log("Invalid admin code provided");
            throw new BadRequestException("The authorization code you provided is invalid. Contact Admin");
          }
    
          // 3. Check if the user already exists in the database
          const exists = await User.findOne({ where: { email: payload.email.toLowerCase() } });
          if (exists) {
            console.log(`User with email ${payload.email} already exists`);
            throw new BadRequestException('Email already exists');
          }
    
          // 4. Hash the password before saving
          const hashedPassword = await bcrypt.hash(payload.password, 10);
    
          // 5. Create a new user instance and save it
          const user = User.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email.toLowerCase(), // Ensure email is stored in lowercase
            password: hashedPassword,
            privilege: Privilege.Clerk,
          });
    
          // Save the user to the database
          await user.save();
    
          // 6. Return response with a success message
          return {
            message: "Account created. Kindly contact your account manager to verify your account",
            user,
          };
        } catch (error) {
          // Log the error with detailed information for debugging
          console.error("Error during sign-up:", error);
    
          // Rethrow the error to be handled by the controller
          throw new BadRequestException('Something went wrong! contact admin.');
        }
      };

    signIn = async(payload: SignInBody)=>{
      try {
        const user = await User.findOne({ where: { email: payload.email.toLowerCase() } });
        if (!user) {
          throw new BadRequestException('Invalid Credentials');
        }
        const isPasswordValid = await bcrypt.compare(payload.password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Invalid credentials');
    
        if (!user.emailVerified) {
          return {
            user: {
              ...user,
              password: undefined,
            },
            emailVerificationRequired: true,
          };
        }
    
        // Generate the login response and return the access token
        return loginResponse(user.id);
          
        } catch (error) {
            // Log the error with detailed information for debugging
            console.error("Error during sign-in:", error);
      
            // Rethrow the error to be handled by the controller
            throw new BadRequestException('Invalid Credentials. Try again.');
          }
    }

    inviteUser = async(payload: InviteUser) =>{
        const admin = User.findOne({where:{id: payload.userId}});
        if(!admin){
            throw new NotFoundException("User not found")
        }
        if((await admin).privilege != (Privilege.Admin || Privilege.SuperAdmin)){
            throw new BadRequestException("Only Admins are authorized to perform this action")
        }

        if (!payload.email.toLowerCase().endsWith('@edouniversity.edu.ng')) {
          throw new BadRequestException('Email must be from the domain "@edouniversity.edu.ng"');
        }
        
        const dummypword = payload.firstName.toLowerCase()+payload.lastName.toLowerCase()
        const hashedPassword = await bcrypt.hash(dummypword, 10);
        const user = await User.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email.toLowerCase(),
            password: hashedPassword,
            privilege: Privilege.Clerk
          }).save();
        await this.emailService.sendUserInvite(payload.email, dummypword);
        return{
            message: `Account has been created for ${payload.firstName}, Kindly inform them to check their email for activation.`
        }
    }

    verifyAccount = async(userId: string, email: string)=>{
        const manager = User.findOne({where:{id: userId}})
        if(!manager) throw new NotFoundException("User not found");

        const userRepository = dataSource.getRepository(User)
        const userToUpdate = await userRepository.findOneBy({
            email
        })
        userToUpdate.emailVerified = true;
        await userRepository.save(userToUpdate);

        return {
            message: `${userToUpdate.firstName} ${userToUpdate.lastName}'s account has been activated`
        }
    }
}