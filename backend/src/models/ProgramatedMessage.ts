import {
Table,
Column,
CreatedAt,
UpdatedAt,
Model,
PrimaryKey,
AutoIncrement,
AllowNull,
Unique,
BelongsToMany
} from "sequelize-typescript";


@Table
class ProgramatedMessage extends Model<ProgramatedMessage> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column
    phoneNumber: string;

    @AllowNull(false)
    @Column
    message: string;

    @AllowNull(false)
    @Column
    wpid: number;

    @AllowNull(false)
    @Column
    sendby: string;

    @AllowNull(false)
    @Column
    status: string;

    @AllowNull(false)
    @Column
    idchat: number;

    @AllowNull(false)
    @Column
    sendAt: Date;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

}

export default ProgramatedMessage;
