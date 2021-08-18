import {
Table,
Column,
CreatedAt,
UpdatedAt,
Model,
PrimaryKey,
AutoIncrement,
AllowNull,
BelongsTo,
ForeignKey
} from "sequelize-typescript";
import Whatsapp from "./Whatsapp";


@Table
class WhaticketApiToken extends Model<WhaticketApiToken> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column
    message: string;

    @ForeignKey(() => Whatsapp)
    wpid: number;

    @AllowNull(false)
    @Column
    token: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

  

    @BelongsTo(() => Whatsapp)
    whatsapp: Whatsapp
}

export default WhaticketApiToken;
