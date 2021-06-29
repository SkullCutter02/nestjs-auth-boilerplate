import { EntityRepository, Repository } from "typeorm";
import { ResetEmail } from "../entities/reset-email.entity";

@EntityRepository(ResetEmail)
export class ResetEmailRepository extends Repository<ResetEmail> {}
