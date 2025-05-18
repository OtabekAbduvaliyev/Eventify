import React, { useContext, useState } from "react";
import { AuthContext } from "../../Auth/AuthContext";
import { Link } from "react-router-dom";
const Register = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { register, loading } = useContext(AuthContext);
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(credentials);
    setCredentials({ password: "", email: "" });
  };
  return (
    <div className="bg-gray h-[100vh] flex justify-center items-center">
    <div className="bg-darkBlue w-[100%] max-w-[638px] h-[full] rounded-[28px] m-auto">
        <div className="py-[51px] px-[62px]">
        <h1 className="text-[36px] font-[700] text-textGray">Register</h1>
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
            </div>
            <div className="mt-[11px]">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                className="rounded-[8px] max-w-[514px] w-[100%] h-[86px] bg-[#122434] placeholder:text-[21px] text-[21px] text-textGray font-[700] pl-[29.5px]"              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="h-[86px] w-[100%] text-center bg-yellow rounded-[8px] text-[21px] font-[700] text-[#C4E1FE]"
            >
              {!loading ? "Register" : "Loading..."}
            </button>
          </div>
        </form>
        </div>
        </div>
    </div>
    </div>
  );
};

export default Register;
