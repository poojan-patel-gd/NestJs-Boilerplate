import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthResponseDTO } from "./auth.dto";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { AuthHelpers } from "../shared/helpers/auth.helpers";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(bodyData): Promise<AuthResponseDTO> {
    console.log('bodyData', bodyData);

    const {firstName, lastName, userName, email, password, socialId, socialType} = bodyData;

    if (!socialId && !password) {
      throw new BadRequestException({
        type: 'credentials',
        title: 'Missing Credentials',
        description: 'Either social ID or password is required.',
      });
    }

    // Hash password if provided
    if (!socialId && password) {
      bodyData.password = await AuthHelpers.hash(password);
    } else {
      bodyData.IsEmailVerify = true;
      bodyData.password = null;
    }

    // Create the user in the database
    const newUser = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        userName,
        email,
        password: bodyData.password,
        socialId: socialId ? socialId : undefined,
        socialType: socialType ? socialType : undefined
      }
    });

    console.log('newUser', newUser);

    return {
      data: bodyData,
      statusCode: HttpStatus.OK,
      message: 'Registered successfully.',
    };
  }
}
