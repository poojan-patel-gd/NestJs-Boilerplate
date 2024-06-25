import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterDTO } from "./auth.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  async register(@Body() body: RegisterDTO) {
    return await this.authService.register(body);
  }
}
