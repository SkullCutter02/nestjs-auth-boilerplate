import { EntityRepository } from "@mikro-orm/core";

import { ResetEmail } from "../entities/resetEmail.entity";

export class ResetEmailRepository extends EntityRepository<ResetEmail> {}
