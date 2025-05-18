import React, { useContext, useState } from "react";
import { AuthContext } from "../../Auth/AuthContext";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login,restoreAccount } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const { loading } = useContext(AuthContext);
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
  };
  const handlePasswordShow = () => {
    setShow(!show);
  };
const handleRestoreAccount = (e)=>{
  e.preventDefault()
  restoreAccount(credentials)
}
  return (
    <div className="bg-gray h-[100vh] flex justify-center items-center">
      <div className="bg-darkBlue w-[100%] max-w-[638px] h-[full] rounded-[28px] m-auto">
        <div className="py-[51px] px-[62px]">
          <h1 className="text-[36px] font-[700] text-textGray">Log In</h1>
          <div className="inputs mt-[93px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="text-textGray text-[21px] font-[700]"
                >
                  Email address:
                </label>
                <div className="mt-[11px]">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="rounded-[8px] max-w-[514px] w-[100%] h-[86px] bg-[#122434] placeholder:text-[21px] text-[21px] text-textGray font-[700] pl-[29.5px]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-textGray text-[21px] font-[700]"
                  >
                    Password:
                  </label>
                  <Link
                  onClick={handleRestoreAccount}
                    to="/reset-password" // Adjust the link to your reset password route
                    className="text-textGray text-[18px] font-[600] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="mt-[11px] relative max-w-[514px] w-full">
                  <input
                    id="password"
                    name="password"
                    type={!show ? "password" : "text"}
                    required
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="rounded-[8px] w-full h-[86px] bg-[#122434] placeholder:text-[21px] text-[21px] text-textGray font-[700] pl-[29.5px] pr-[60px]" // pr-[60px] to leave space for button
                  />

                  <button
                    type="button"
                    onClick={handlePasswordShow} // Function to toggle password visibility
                    className="absolute right-[20px] top-[50%] transform -translate-y-[50%] text-textGray font-[700]"
                  >
                    {show ? (
                      <IoMdEyeOff className="text-[21px]" />
                    ) : (
                      <IoMdEye className="text-[21px]" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="h-[86px] w-[100%] text-center bg-yellow rounded-[8px] text-[21px] font-[700] text-[#C4E1FE]"
                >
                  {!loading ? "Log In" : "Loading..."}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
