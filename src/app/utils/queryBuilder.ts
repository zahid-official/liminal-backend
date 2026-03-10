import type { Query } from "mongoose";
import type { IMeta } from "./sendResponse.js";

// Utility class to build Mongoose queries based on request query parameters
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
        $or: searchFields?.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            }) as any,
        ),
      });
    }

    return this;
  }

  // Filter based on query parameters (excluding special fields)
  filter(): this {
    const queryObj = { ...this.query };
    const excludedFields = ["searchTerm", "sort", "fields", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj);
    return this;
  }

  // Sort results based on query parameter (default to createdAt desc)
  sort(): this {
    const sort =
      (this.query?.sort as string)?.split(",").join(" ") || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  // Select specific fields based on query parameter
  fields(): this {
    const fields = (this.query?.fields as string)?.split(",").join(" ") || "";

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // Paginate results based on query parameters
  paginate(): this {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 9;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // Get the pagination metadata
  async meta(): Promise<IMeta> {
    const allQueries = this.modelQuery.getFilter();

    const totalDocs = await this.modelQuery.model.countDocuments(allQueries);
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 9;
    const totalPages = Math.ceil(totalDocs / limit);

    return {
      page,
      limit,
      totalPage: totalPages,
      totalDocs,
    };
  }
}

export default QueryBuilder;
