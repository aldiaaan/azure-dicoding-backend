import { Review as ReviewEntity } from "lib/entities";

export const add = async (review: Partial<ReviewEntity>): Promise<ReviewEntity> => {
  return await ReviewEntity.create(review).save();
};
