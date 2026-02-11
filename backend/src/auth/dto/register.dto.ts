import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Nom requis' })
  nom: string;

  @IsString()
  @IsNotEmpty({ message: 'Prénom requis' })
  prenom: string;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @IsNotEmpty({ message: 'Mot de passe requis' })
  password: string;

  @IsString()
  @IsOptional()
  telephone?: string;
}
