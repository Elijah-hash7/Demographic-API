import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from "typeorm";


@Entity('profiles')
export class Profile {
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column({ type: 'varchar', unique: true })
    name: string;


    @Index()
    @Column({ type: 'varchar' })
    gender: string;


    @Column({type: 'real'})
    gender_probability: number;


    @Index()
    @Column({type: 'integer'})
    age: number;


    @Index()
    @Column({ type: 'varchar' })
    age_group: string;


    @Index()
    @Column({ type: 'varchar', length: 2 })
    country_id: string;

    @Column({ type: 'varchar' })
    country_name: string;

    @Column({type: 'real'})
    country_probability: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;


}
    
    
    
    

    
    

    