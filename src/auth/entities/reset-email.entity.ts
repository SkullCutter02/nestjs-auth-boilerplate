import { Column, Entity } from "typeorm";

import { Model } from "../../shared/model";

@Entity("email")
export class ResetEmail extends Model {
  @Column()
  userId: string;

  @Column()
  token: string;

  @Column()
  expirationDate: Date;
}
