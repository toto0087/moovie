import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatDto } from './dto/chat.dto';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private readonly chatbot: ChatbotService) {}

  @Post()
  chat(@Body() dto: ChatDto) {
    return this.chatbot.chat(dto.message, dto.lang);
  }
}
