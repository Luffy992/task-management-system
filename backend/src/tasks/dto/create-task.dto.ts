import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['TODO', 'DOING', 'COMPLETED', 'ON_HOLD'])
  status?: 'TODO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';

  @IsOptional()
  @IsIn(['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'])
  priority?: 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsInt()
  reporterId?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}