import { EntityRepository, Repository } from "typeorm";
import { Email } from "../entities/email.entity";

@EntityRepository(Email)
export class EmailRepository extends Repository<Email> {}
