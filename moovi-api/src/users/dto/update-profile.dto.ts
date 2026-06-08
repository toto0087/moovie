import { IsEmail, IsIn, IsOptional, IsString, IsUrl, MinLength, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsUrl()
  avatar_url?: string;

  @IsOptional()
  @IsIn(['free', 'premium'])
  plan?: 'free' | 'premium';

  @ValidateIf((dto) => dto.new_password !== undefined)
  @IsString()
  current_password?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  new_password?: string;
}
