import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @Inject('DATABASE')
        private readonly database: Pool,
    ) { }

    async findAll() {
        const [rows] = await this.database.query(
            'SELECT * FROM tasks ORDER BY created_at DESC',
        );

        return rows;
    }

    async findOne(id: number) {
        const [rows] = await this.database.execute(
            'SELECT * FROM tasks WHERE id = ?',
            [id],
        );

        const tasks = rows as any[];

        if (tasks.length === 0) {
            throw new NotFoundException('Task not found');
        }

        return tasks[0];
    }

    async remove(id: number) {
        const [result] = await this.database.execute(
            'DELETE FROM tasks WHERE id = ?',
            [id],
        );

        const affectedRows = (result as { affectedRows: number }).affectedRows;

        if (affectedRows === 0) {
            throw new NotFoundException('Task not found');
        }

        return {
            message: 'Task deleted successfully',
        };
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
        const {
            title,
            description,
            status,
            priority,
            projectId,
            reporterId,
            dueDate,
        } = updateTaskDto;

        const [result] = await this.database.execute(
            `
    UPDATE tasks
    SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      priority = COALESCE(?, priority),
      project_id = COALESCE(?, project_id),
      reporter_id = COALESCE(?, reporter_id),
      due_date = COALESCE(?, due_date)
    WHERE id = ?
    `,
            [
                title ?? null,
                description ?? null,
                status ?? null,
                priority ?? null,
                projectId ?? null,
                reporterId ?? null,
                dueDate ?? null,
                id,
            ],
        );

        const affectedRows = (result as { affectedRows: number }).affectedRows;

        if (affectedRows === 0) {
            throw new NotFoundException('Task not found');
        }

        return this.findOne(id);
    }

    async create(createTaskDto: CreateTaskDto) {
        const {
            title,
            description,
            status = 'TODO',
            priority = 'NO_PRIORITY',
            projectId,
            reporterId,
            dueDate,
        } = createTaskDto;

        const [result] = await this.database.execute(
            `
      INSERT INTO tasks
      (title, description, status, priority, project_id, reporter_id, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
            [
                title,
                description ?? null,
                status,
                priority,
                projectId ?? null,
                reporterId ?? null,
                dueDate ?? null,
            ],
        );

        return {
            message: 'Task created successfully',
            id: (result as { insertId: number }).insertId,
        };
    }
}