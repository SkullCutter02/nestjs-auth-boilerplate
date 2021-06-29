import { Column, Entity } from "typeorm";

import { Model } from "../../shared/ModelEntity";

@Entity("email")
export class Email extends Model {
  @Column()
  userId: string;

  @Column()
  token: string;

  @Column()
  expirationDate: Date;
}
