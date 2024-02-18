import { Category } from "../services/category.service";

export interface ExtendedCategory extends Category {
  products: Set<string>;
  childCategories: Set<string>;
}
