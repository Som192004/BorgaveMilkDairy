import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../model/Admin.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//do some changes in options object when you are going to test the login controller as well as in frontEnd part . . .
//cookies are not set in the mobile application at the user end that's why here we are sending the accesstoken and refreshtoken in the response to the user

//we have to use secure equal to true in the production
const login = asyncHandler(async (req, res) => {
  const { adminMobileNumber, adminPassword } = req.body;

  if (!adminMobileNumber || !adminPassword) {
    throw new ApiError(400, "Mobile Number and Password are required");
  }

  const admin = await Admin.findOne({ adminMobileNumber });

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const isPassValid = await admin.isPasswordCorrect(adminPassword);
  // const isPassValid = await bcrypt.compare(adminPassword, admin.adminPassword);

  if (!isPassValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  try {
    const accessToken = await admin.generateAccessToken();
    const refreshToken = await admin.generateRefToken();
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    //Following is the development setup
    // const cookieOptions = {
    //   httpOnly: true,
    //   secure: false,
    //   // sameSite: "Strict",
    //   sameSite: "lax",
    // };

    //Following is the production setup
    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { admin: admin, accessToken, refreshToken },
          "Admin logged in successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Failed to login. Please try again.");
  }
});

//!This is done
const logoutAdmin = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(401, "Unauthorized");
  }

  await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        refreshToken: null, // Use null instead of undefined to clear
      },
    },
    {
      new: true,
    }
  );

  //development setup
  // const options = {
  //   httpOnly: true,
  //   secure: true,
  // };
  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Admin logged out"));
});

//!This is done
const addAdmin = asyncHandler(async (req, res) => {
  try {
    const { adminName, adminMobileNumber, adminPassword } = req.body;

    // Check if the admin already exists
    const adminExists = await Admin.findOne({ adminMobileNumber });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists!" });
    }

    // Create the new admin
    const newAdmin = new Admin({
      adminName,
      adminMobileNumber,
      adminPassword,
      role: "Admin", // Set the role as admin
    });

    await newAdmin.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, { admin: newAdmin }, "Admin added successfully")
      );
  } catch (err) {
    console.error(err);
    throw new ApiError(500, "Error while adding the admin");
  }
});

const getAdmin = asyncHandler(async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-adminPassword");
    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { admin }, "Admin found successfully"));
  } catch (err) {
    console.error(err);
    throw new ApiError(500, "Error while getting the admin");
  }
});

export { login, logoutAdmin, addAdmin, getAdmin };
