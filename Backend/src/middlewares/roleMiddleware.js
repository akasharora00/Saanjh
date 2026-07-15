const authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    next();

  };
};

export default authorize;


//                 LOGIN

//                   │

//           JWT Generated

//                   │

//               Protect()

//                   │

//       req.user = Logged User

//                   │

//           Authorize("admin")

//                   │

//         Is User Admin?

//           /          \
//         Yes          No
//          │            │
//      next()      403 Forbidden
//          │
//    Admin Controller


// Q: `Why do we need both protect and authorize?
//Ans: protect checks whether the user is logged in by verifying the JWT and attaching the user to req.user.
// authorize checks whether that logged-in user has permission (role) to access a specific route, such as admin or faculty.