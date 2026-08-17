import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import type { Pool } from 'mysql2/promise';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @Inject('DATABASE')
        private readonly database: Pool,
    ) { }

    async findAll() {
        const [rows] = await this.database.query(`
            SELECT
                projects.id,
                projects.name,
                projects.description,
                projects.priority,
                users.name AS \`lead\`,
                projects.due_date AS dueDate,
                projects.created_at AS createdAt,
                projects.updated_at AS updatedAt
            FROM projects
            LEFT JOIN users
                ON projects.lead_id = users.id
            ORDER BY projects.created_at DESC
        `);

        return rows;
    }

    async findOne(id: number) {
        const [rows] = await this.database.execute(
            `
            SELECT
                projects.id,
                projects.name,
                projects.description,
                projects.priority,
                users.name AS \`lead\`,
                projects.due_date AS dueDate,
                projects.created_at AS createdAt,
                projects.updated_at AS updatedAt
            FROM projects
            LEFT JOIN users
                ON projects.lead_id = users.id
            WHERE projects.id = ?
            `,
            [id],
        );

        const projects = rows as any[];

        if (projects.length === 0) {
            throw new NotFoundException(
                'Project not found',
            );
        }

        return projects[0];
    }

    async create(
        createProjectDto: CreateProjectDto,
    ) {
        console.log(
            'CREATE PROJECT DTO:',
            createProjectDto,
        );
        

        const name =
            createProjectDto.name ?? null;

        const description =
            createProjectDto.description ?? null;

        const priority =
            createProjectDto.priority ??
            'NO_PRIORITY';

            

        const dueDate =
            createProjectDto.dueDate ?? null;

        const values = [
            name,
            description,
            priority,
            1,
            dueDate,
        ];

        console.log(
            'SQL VALUES:',
            values,
        );

        const [result] = await this.database.execute(
            `
            INSERT INTO projects
            (
                name,
                description,
                priority,
                lead_id,
                due_date
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            values,
        );

        return {
            message:
                'Project created successfully',
            id: (
                result as {
                    insertId: number;
                }
            ).insertId,
        };
    }

    async update(
        id: number,
        updateProjectDto: UpdateProjectDto,
    ) {
        const {
            name,
            description,
            priority,
            dueDate,
        } = updateProjectDto;

        const formattedDueDate =
            dueDate
                ? dueDate.split('T')[0]
                : null;

        const [result] = await this.database.execute(
            `
            UPDATE projects
            SET
                name = COALESCE(?, name),
                description = COALESCE(
                    ?,
                    description
                ),
                priority = COALESCE(
                    ?,
                    priority
                ),
                due_date = COALESCE(
                    ?,
                    due_date
                )
            WHERE id = ?
            `,
            [
                name ?? null,
                description ?? null,
                priority ?? null,
                formattedDueDate,
                id,
            ],
        );

        const affectedRows = (
            result as {
                affectedRows: number;
            }
        ).affectedRows;

        if (affectedRows === 0) {
            throw new NotFoundException(
                'Project not found',
            );
        }

        return this.findOne(id);
    }

    async remove(id: number) {
        const [result] = await this.database.execute(
            'DELETE FROM projects WHERE id = ?',
            [id],
        );

        const affectedRows = (
            result as {
                affectedRows: number;
            }
        ).affectedRows;

        if (affectedRows === 0) {
            throw new NotFoundException(
                'Project not found',
            );
        }

        return {
            message:
                'Project deleted successfully',
        };
    }
}