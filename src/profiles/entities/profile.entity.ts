import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from "typeorm";


@Entity('profiles')
export class Profile {
    @PrimaryColumn('text')
    id: string;

    @Column({type: 'text', unique: true})
    name: string;


    @Index()
    @Column({type: 'text'})
    gender: string;


    @Column({type: 'real'})
    gender_probability: number;


    @Index()
    @Column({type: 'integer'})
    age: number;


    @Index()
    @Column({type: 'text'})
    age_group: string;


    @Index()
    @Column({type: 'text'})
    country_id: string;

    @Column({type: 'text'})
    country_name: string;

    @Column({type: 'real'})
    country_probability: number;

    @CreateDateColumn({type: 'datetime'})
    created_at: Date;


}
    
    
    
    

    
    

    