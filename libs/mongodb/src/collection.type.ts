import type mongodb from 'mongodb';
import { type StringId } from './string-id.interface';

export type Collection<Entity> = mongodb.Collection<Entity & StringId>;
