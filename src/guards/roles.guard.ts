import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from "./role.enum";
import { ROLES_KEY } from "./roles.decorator";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve required roles defined using the Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Get roles defined at the handler level
      context.getClass(),   // Get roles defined at the class level
    ]);

    // If no specific roles are required, access is granted
    if (!requiredRoles) {
      return true;
    }

    // Extract the JWT token from the request header
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // If the token is missing, throw UnauthorizedException
    if (!token) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const userToken = await this.prisma.user_token.findFirst({
      where: { token: token },
    });
    if (!userToken) {
      throw new UnauthorizedException();
    }

    let payload;
    let getUserData;

    try {
      // Verify the JWT token
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SIGNATURE, // Verify token using secret
      });

      // Assign the payload to the request object for further use
      getUserData = await this.prisma.user.findFirst({
        where: {
          id: payload.id
        }
      });

      request['userRole'] = getUserData;

    } catch (error) {
      console.error('JWT verification failed:', error.message);
      throw new UnauthorizedException(error.message); // Throw UnauthorizedException on verification failure
    }

    // Check if any of the required roles match the roles in the getUserData
    const hasPermission = this.checkRolePreferences(getUserData.user_has_role, requiredRoles);

    // If the user doesn't have the required roles, throw ForbiddenException
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Access is granted if the user has the required roles
    return true;
  }

  // Helper function to extract JWT token from the request header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  // Helper function to check if any of the user's roles match the required roles
  private checkRolePreferences(userRoles: any[], requiredRoles: Role[]): boolean {
    for (const userRole of userRoles) {
      if (requiredRoles.includes(userRole.role.authority as Role) && userRole.isRoleActive) {
        return true;
      }
    }
    return false;
  }
}
