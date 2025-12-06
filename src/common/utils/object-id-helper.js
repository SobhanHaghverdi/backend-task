import mongoose from "mongoose";

class ObjectIdHelper {
  /**
   * Converts string to objectId
   * @param value String value to convert.
   * @returns ObjectId
   */
  static convert(value) {
    if (!value) return undefined;
    return new mongoose.Types.ObjectId(value);
  }
}

export default ObjectIdHelper;
