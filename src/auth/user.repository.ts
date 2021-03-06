import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
const bcrypt = require('bcrypt');


@EntityRepository(User)
export class UserRepository extends Repository<User>{

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const {username, password} = authCredentialsDto;
    const user = this.create();

    user.username = username;
    user.salt = await bcrypt.genSalt(10);
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save()
    } catch (error) {
      if (error.code === '23505'){ // duplicate value in database
        throw new ConflictException('Username already Exists')
      }
      else{
        throw new InternalServerErrorException();
      }
    }
    await user.save();
  }

  async validatePassword(authCredentialsDto: AuthCredentialsDto): Promise<string>{
    const {username, password} = authCredentialsDto;
    const user = await this.findOne({username});

    if (user && await user.validatePassword(password)){
      return user.username
    } else {
      return null
    }

  }

  private async hashPassword(password: string, salt: string): Promise<string>{
    return bcrypt.hash(password, salt);
  }

}