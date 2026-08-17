import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE')
    private readonly database: Pool,
  ) {}

  async guestLogin() {
    const guestEmail = `guest-${Date.now()}@example.com`;
    const guestUsername = `guest-${Date.now()}`;

    const [result] = await this.database.execute(
      `
      INSERT INTO users (name, email, username, title)
      VALUES (?, ?, ?, ?)
      `,
      [
        'Guest User',
        guestEmail,
        guestUsername,
        'Guest',
      ],
    );

    return {
      message: 'Guest login successful',
      user: {
        id: (result as { insertId: number }).insertId,
        name: 'Guest User',
        email: guestEmail,
        username: guestUsername,
        title: 'Guest',
      },
    };
  }
}