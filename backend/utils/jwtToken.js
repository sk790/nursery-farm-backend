//Create token and saving in cookie

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  // console.log("genrated", token);

  //option for cookie

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false, //if you want to get cookie only on http protocol then you have to set this to false
    sameSite: "none",
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
