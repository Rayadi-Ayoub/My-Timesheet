import AccessControl from "accesscontrol";

const ac = new AccessControl();

export const roles = (function() {
    ac.grant("user")
        .readOwn("profile");
    
    ac.grant("controller")
        .extend("user")
        .updateOwn("profile");
    
    ac.grant("manager")
        .extend("controller")
        .readAny("profile");
    
    ac.grant("admin")
        .extend("manager")
        .extend("controller")
        .updateAny("profile")
        .deleteAny("profile");

    return ac;
})();

export const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.poste)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while verifying permissions' });
    }
  };
};


 // user =====>grantAccess("readOwn", "profile")
    // controller ==========> grantAccess("updateOwn","profile")
    // manager ==========> grantAccess("readAny","profile")
    // admin ===========> grantAccess("deleteAny","profile")