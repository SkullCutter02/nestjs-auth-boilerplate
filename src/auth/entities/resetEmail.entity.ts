import { Entity, EntityRepositoryType, Property } from "@mikro-orm/core";

import { BaseEntityEntity } from "../../shared/baseEntity.entity";
import { ResetEmailRepository } from "../repositories/resetEmail.repository";

@Entity({ tableName: "reset_emails", customRepository: () => ResetEmailRepository })
export class ResetEmail extends BaseEntityEntity {
  @Property()
  userId: string;

  @Property()
  token: string;

  @Property()
  expirationDate: Date;

  [EntityRepositoryType]?: ResetEmailRepository;
}
