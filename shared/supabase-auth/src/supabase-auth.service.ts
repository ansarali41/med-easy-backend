import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthService {
  private client: SupabaseClient;

  constructor(private config: ConfigService) {
    this.client = createClient(
      config.getOrThrow<string>('SUPABASE_URL'),
      config.getOrThrow<string>('SUPABASE_SERVICE_KEY'),
    );
  }

  async verifyToken(token: string) {
    const { data, error } = await this.client.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return data.user;
  }

  async getUserById(id: string) {
    const { data, error } = await this.client.auth.admin.getUserById(id);
    if (error) throw new UnauthorizedException('User not found');
    return data.user;
  }

  async createUser(email: string, password: string, metadata?: Record<string, unknown>) {
    const { data, error } = await this.client.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    });
    if (error) throw new Error(error.message);
    return data.user;
  }

  async deleteUser(id: string) {
    const { error } = await this.client.auth.admin.deleteUser(id);
    if (error) throw new Error(error.message);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
