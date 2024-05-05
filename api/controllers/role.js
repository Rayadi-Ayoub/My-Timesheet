import AccessControl from "accesscontrol" ;
const ac = new AccessControl();

export const roles = (function() {
    //user
    ac.grant("user")
        .readOwn("profile")
    //controller
    ac.grant("controller")
        .extend("user")
        .updateOwn("profile")
    //agent
    ac.grant("manager")
        .extend("controller")
        .readAny("profile")
    //admin
    ac.grant("admin")
        .extend("manager")
        .extend("controller")
        .updateAny("profile")
        .deleteAny("profile")

    return ac;
})();




    // user =====>grantAccess("readOwn", "profile")
    // controller ==========> grantAccess("updateOwn","profile")
    // manager ==========> grantAccess("readAny","profile")
    // admin ===========> grantAccess("deleteAny","profile")