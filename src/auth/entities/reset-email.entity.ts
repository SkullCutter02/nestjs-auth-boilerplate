import { Entity, EntityRepositoryType, Property } from "@mikro-orm/core";

import { BaseEntity } from "../../shared/base-entity";
import { ResetEmailRepository } from "../repositories/reset-email.repository";

@Entity({ tableName: "reset_emails", customRepository: () => ResetEmailRepository })
export class ResetEmail extends BaseEntity {
  @Property()
  userId: string;

  @Property()
  token: string;

  @Property()
  expirationDate: Date;

  [EntityRepositoryType]?: ResetEmailRepository;
}
