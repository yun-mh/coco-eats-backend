import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType() // for graphql schema
@Entity() // for typeORM entity
export class Restaurant {
  @Field((type) => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((type) => String) // for graphql schema
  @Column() // for typeORM entity
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => Boolean, { nullable: true }) // for graphql schema
  @Column({ default: true }) // for typeORM entity
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;

  @Field((type) => String, { defaultValue: '강남' }) // for graphql schema
  @Column() // for typeORM entity
  @IsString()
  address: string;
}
