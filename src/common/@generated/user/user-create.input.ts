import { Field, InputType } from '@nestjs/graphql';
import { PostCreateNestedManyWithoutAuthorInput } from '../prisma/post-create-nested-many-without-author.input';
import { ProfileCreateNestedOneWithoutUserInput } from '../prisma/profile-create-nested-one-without-user.input';
import { Role } from '../prisma/role.enum';

@InputType()
export class UserCreateInput {
  @Field(() => String, {
    nullable: true,
  })
  id?: string;

  @Field(() => String, {
    nullable: false,
  })
  email!: string;

  @Field(() => String, {
    nullable: false,
  })
  password!: string;

  @Field(() => Role, {
    nullable: true,
  })
  role?: Role;

  @Field(() => Date, {
    nullable: true,
  })
  createdAt?: Date | string;

  @Field(() => Date, {
    nullable: true,
  })
  updatedAt?: Date | string;

  @Field(() => String, {
    nullable: true,
  })
  currentHashedRefreshToken?: string;

  @Field(() => PostCreateNestedManyWithoutAuthorInput, {
    nullable: true,
  })
  posts?: PostCreateNestedManyWithoutAuthorInput;

  @Field(() => ProfileCreateNestedOneWithoutUserInput, {
    nullable: true,
  })
  profile?: ProfileCreateNestedOneWithoutUserInput;
}
