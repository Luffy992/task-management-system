import {
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsIn([
        'NO_PRIORITY',
        'URGENT',
        'HIGH',
        'MEDIUM',
        'LOW',
    ])
    priority?:
        | 'NO_PRIORITY'
        | 'URGENT'
        | 'HIGH'
        | 'MEDIUM'
        | 'LOW';

    @IsOptional()
    @IsString()
    lead?: string;

    @IsOptional()
    @IsString()
    dueDate?: string;
}