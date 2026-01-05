import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn, // Import JoinColumn
} from 'typeorm';
import { Board } from '../boards/board.entity';

export enum BoardObjectType {
  STICKY = 'sticky',
  TEXT = 'text',
  IMAGE = 'image',
}

@Entity()
export class BoardObject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  boardId: string;

  @ManyToOne(() => Board, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' }) // Add JoinColumn to map the foreign key
  board: Board;

  @Column({
    type: 'simple-enum',
    enum: BoardObjectType,
    default: BoardObjectType.STICKY,
  })
  type: BoardObjectType;

  @Column('float')
  x: number;

  @Column('float')
  y: number;

  @Column('float', { nullable: true })
  width: number;

  @Column('float', { nullable: true })
  height: number;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
