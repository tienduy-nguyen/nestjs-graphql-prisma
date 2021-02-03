import { PrismaService } from '@modules/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './post.model';
import { User } from '@modules/user/user.model';
import { Prisma } from '@prisma/client';
import { CreatePostInput, UpdatePostInput } from './dto';
import slugify from 'slugify';
import { randomBytes } from 'crypto';
import { CategoryService } from '@modules/category/category.service';
import { PostWhereUniqueInput } from '@common/@generated/post';
import { PostFindManyArgs } from './args/post-find-many.args';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
  ) {}

  public async getPosts(args: PostFindManyArgs) {
    return await this.prisma.post.findMany({
      include: { author: true },
      ...args,
    });
  }

  public async getPost(where: PostWhereUniqueInput) {
    return await this.prisma.post.findUnique({
      where,
      rejectOnNotFound: true,
    });
  }

  public async getUserOfPost(where: PostWhereUniqueInput): Promise<User> {
    const post: Post = await this.prisma.post.findUnique({
      where,
      include: {
        author: true,
      },
    });
    return post.author;
  }

  public async createPost(input: CreatePostInput, user: User) {
    try {
      // Get or create category from input
      const categories = await this.categoryService.createCategories(
        input.categories,
      );

      const { title } = input;
      const randomString = randomBytes(256).toString('hex').substring(0, 10);
      const slug = slugify(title, { lower: true }) + randomString;
      const data: Prisma.PostCreateInput = {
        ...input,
        slug: slug,
        author: {
          connect: {
            id: user.id,
          },
        },
        categories: {
          connect: categories.map((c) => ({ id: c.id })),
        },
      };

      const post = await this.prisma.post.create({
        data,
        include: {
          author: true,
        },
      });
      return post;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updatePost(
    where: PostWhereUniqueInput,
    postInput: UpdatePostInput,
  ) {
    try {
      return await this.prisma.post.update({
        where,
        data: postInput,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public;

  public async deletePost(where: PostWhereUniqueInput): Promise<Post> {
    try {
      return await this.prisma.post.delete({ where });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
