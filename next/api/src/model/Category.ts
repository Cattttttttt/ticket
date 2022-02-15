import _ from 'lodash';

import { Model, field, pointerIds, pointerId, pointTo, serialize } from '@/orm';
import { Article } from './Article';
import { Group } from './Group';
import { TicketForm } from './TicketForm';

export interface TinyCategoryInfo {
  objectId: string;
  name: string;
}

export class Category extends Model {
  @field()
  @serialize()
  name!: string;

  @field()
  @serialize()
  description?: string;

  @field()
  @serialize()
  qTemplate?: string;

  @pointerId(() => Category)
  @serialize()
  parentId?: string;

  @pointTo(() => Category)
  parent?: Category;

  @field('order')
  @serialize()
  position?: number;

  @pointerIds(() => Article)
  @serialize()
  FAQIds?: string[];

  @pointerIds(() => Article)
  @serialize()
  noticeIds?: string[];

  @pointerId(() => Group)
  @serialize()
  groupId?: string;

  @pointTo(() => Group)
  group?: Group;

  @pointerId(() => TicketForm)
  @serialize()
  formId?: string;

  @pointTo(() => TicketForm)
  form?: TicketForm;

  @field()
  @serialize.Date()
  deletedAt?: Date;

  getTinyInfo(): TinyCategoryInfo {
    return {
      objectId: this.id,
      name: this.name,
    };
  }
}
