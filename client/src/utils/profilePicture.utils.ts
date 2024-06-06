export const getUserProfilePicture = (profilePicture) => {
    if (
      profilePicture.indexOf("http") > -1 ||
      profilePicture.indexOf("https") > -1
    ) {
      return profilePicture;
    } else {
      return "http://localhost:3000/" + profilePicture;
    }
  }