import HttpError from "../helpers/httpError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") next(HttpError(401));
  const { SECRET_KEY } = process.env;
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) next(HttpError(401));
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401));
  }
};
