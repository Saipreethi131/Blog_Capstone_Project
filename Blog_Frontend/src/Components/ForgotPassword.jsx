import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
} from "../styles/common";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const newPassword = watch("newpassword");

  const onSubmit = async (data) => {
    setApiError(null);
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/common-api/forgot-password`, {
        email: data.email,
        newpassword: data.newpassword,
      });

      if (res.status === 200) {
        toast.success("Password reset successfully! Redirecting to login...", {
          duration: 3000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setApiError(err.response?.data?.message || "Password reset failed. Please try again.");
      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        {/* Title */}
        <h2 className={formTitle}>Reset Your Password</h2>

        {/* API error */}
        {apiError && <p className={`${errorClass} mb-6`}>{apiError}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Registered Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
                validate: (value) => value.trim().length > 0 || "Email cannot be empty",
              })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* New Password */}
          <div className={formGroup}>
            <label className={labelClass}>New Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              className={inputClass}
              {...register("newpassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                validate: (value) => value.trim().length > 0 || "Password cannot be empty",
              })}
            />
            {errors.newpassword && <p className={errorClass}>{errors.newpassword.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className={formGroup}>
            <label className={labelClass}>Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className={submitBtn}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Footer */}
        <p className={`${mutedText} text-center mt-5`}>
          Remembered your password?{" "}
          <NavLink to="/login" className={linkClass}>
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
