import { EntityRepository } from "@mikro-orm/core";

import { ResetEmail } from "../entities/reset-email.entity";

export class ResetEmailRepository extends EntityRepository<ResetEmail> {}
