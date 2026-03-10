import type { Query } from "mongoose";

class QueryBuilder<T> {
  constructor(
    public modelQuery: Query<T[], T>,
    public readonly query: Record<string, any>,
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Search by term in specified fields
  search(searchFields: string[]): this {
    const searchTerm = this.query?.searchTerm;
    if (searchTerm && typeof searchTerm === "string") {
      this.modelQuery = this.modelQuery.find({
        $or: searchFields?.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      });
    }

    return this;
  }
}

export default QueryBuilder;
