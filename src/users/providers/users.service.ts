import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserInput } from '../dtos/update-user-input.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import messages from 'src/utils/messages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async create(createUserInput: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    const newUser = this.userRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserInput,
    });
    if (!user) {
      throw new Error(messages.USER_NOT_FOUND);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
