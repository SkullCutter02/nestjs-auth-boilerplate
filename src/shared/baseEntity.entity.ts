import { PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuid } from "uuid";

export abstract class BaseEntityEntity {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
