import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    } from "sequelize-typescript";
    
    
    @Table
    class WhaticketApiMessage extends Model<WhaticketApiMessage> {
        @PrimaryKey
        @AutoIncrement
        @Column
        id: number;

        @AllowNull(false)
        @Column
        wpid: number;
    
        @AllowNull(false)
        @Column
        message: string;
    
        @AllowNull(false)
        @Column
        phone: string;
    
        @CreatedAt
        createdAt: Date;
    
        @UpdatedAt
        updatedAt: Date;
    
    }
    
    export default WhaticketApiMessage;
    