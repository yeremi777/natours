class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;

    const { page, sort, limit, fields, ...queryObj } = this.queryString;

    this.page = page;
    this.sort = sort;
    this.limit = limit;
    this.fields = fields;
    this.queryObj = queryObj;
  }

  filter() {
    let queryStr = JSON.stringify(this.queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const newQueryObj = JSON.parse(queryStr);

    this.query = this.query.find(newQueryObj);

    return this;
  }

  sortData() {
    if (this.sort) {
      const sortBy = this.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.fields) {
      const fields = this.fields.split(',').join(' ');
      this.query =
        fields[0] === '-'
          ? this.query.select(`${fields} -__v`)
          : this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.page * 1 || 1;
    const limit = this.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
