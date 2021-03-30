import {
  BaseEntity,
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import Book from "./book.entity";

@Entity()
class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime", onUpdate: "GetDate()" })
  updatedAt!: Date;

  @ManyToOne(() => Book, (book) => book.reviews, { onDelete: "CASCADE" })
  book!: Book;

  @Column({ type: "text", nullable: true })
  reviewerName!: string;

  @Column({ type: "text", nullable: true })
  comment!: string;

  @Column({ type: "int", nullable: true })
  rating!: number;
}

export default Review;
