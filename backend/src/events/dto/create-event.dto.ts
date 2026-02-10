import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  Min,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Titre requis' })
  @MaxLength(200, { message: 'Le titre ne peut pas dépasser 200 caractères' })
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString({}, { message: 'Date de début invalide' })
  @IsNotEmpty({ message: 'Date de début requise' })
  dateHeureDebut: string;

  @IsDateString({}, { message: 'Date de fin invalide' })
  @IsNotEmpty({ message: 'Date de fin requise' })
  dateHeureFin: string;

  @IsString()
  @IsNotEmpty({ message: 'Lieu requis' })
  lieu: string;

  @IsInt({ message: 'La capacité doit être un nombre entier' })
  @Min(1, { message: 'La capacité doit être au moins 1' })
  capaciteMax: number;

  @IsString()
  @IsOptional()
  imageAffiche?: string;

  @IsUUID('4', { message: 'ID de catégorie invalide' })
  @IsNotEmpty({ message: 'Catégorie requise' })
  categorieId: string;
}
