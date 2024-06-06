import { Injectable } from '@nestjs/common';
import BaseValidation from '../../base/validation.base';
import * as yup from 'yup';
import type {
  CreateRoomInput,
  DeleteUserInput,
  PaginationWithRoomType,
} from '../../interfaces/room';

@Injectable()
export class RoomValidator extends BaseValidation {
  public async validateCreateRoom(data: any) {
    return await this.validate<CreateRoomInput>(
      yup.object().shape({
        users: yup
          .array()
          .required('users is required')
          .of(yup.string().uuid('invalid uuid'))
          .min(1)
          .test('unique value', 'value must be unique', (val) =>
            !val ? true : new Set(val).size === val.length,
          ),
        description: yup.string().optional().default(''),
        name: yup.string().optional(),
        file: yup
          .object()
          .shape(this.fileInputSchema)
          .optional()
          .nullable()
          .default(null),
      }),
      data,
    );
  }

  public validateDeleteUser = async (data: any) =>
    await this.validate<DeleteUserInput>(
      yup.object().shape({
        roomId: this.validateRequiredObjectId('roomId'),
        userId: yup.string().required('userId is required'),
      }),
      data,
    );

  public validateRoomId = async (data: any) =>
    await this.validate<{ roomId: string }>(
      yup.object().shape({
        roomId: this.validateRequiredObjectId('roomId'),
      }),
      data,
    );

  public validateUserId = async (data: any) =>
    await this.validate<{ userId: string }>(
      yup.object().shape({
        userId: yup
          .string()
          .uuid('invalid uuid')
          .required('userId is required'),
      }),
      data,
    );

  public validateGetUserRoom = async (data: any) =>
    await this.validate<PaginationWithRoomType>(
      yup.object().shape({
        page: yup.number().default(1),
        limit: yup.number().default(20),
        type: yup
          .string()
          .oneOf(['Private', 'Group', 'All'], 'invalid type')
          .default('All')
          .optional(),
      }),
      data,
    );
}
