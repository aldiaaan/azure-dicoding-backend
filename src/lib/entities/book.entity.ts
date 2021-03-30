import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import Review from "./review.entity";

@Entity()
class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime", onUpdate: "GetDate()" })
  updatedAt: Date;

  @Column({ type: "text", nullable: true })
  title: string;

  @Column({ type: "text", nullable: true })
  author: string;

  @Column({ type: "text", nullable: true })
  synopsis: string;

  @Column({ type: "int", nullable: true })
  releaseYear: number;

  @Column({ type: "text", nullable: true })
  coverURL: string;

  @OneToMany(() => Review, (review) => review.book)
  reviews: Array<Review>;
}

export default Book;
